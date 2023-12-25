import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Slopes = '>' | '^' | 'v' | '<';

type Wall = '#';

type Path = '.';

type Tiles = Slopes | Wall | Path;

export async function day23a(dataPath?: string) {
  const data = (await readData(dataPath)).map(
    (line) => line.split('') as Tiles[],
  );

  const start = [0, data[0].indexOf('.')] as [number, number];
  const end = [data.length - 1, data.at(-1).indexOf('.')] as [number, number];

  const points: [number, number][] = [start, end];

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      if (data[y][x] === '#') continue;
      let neighbors = 0;
      for (const [neighborY, neighborX] of [
        [y, x - 1],
        [y, x + 1],
        [y - 1, x],
        [y + 1, x],
      ]) {
        if (
          neighborX > 0 &&
          neighborX < data[0].length &&
          neighborY > 0 &&
          neighborY < data.length &&
          data[neighborY][neighborX] !== '#'
        ) {
          neighbors++;
        }
      }
      if (neighbors >= 3) points.push([y, x]);
    }
  }

  const graph = new Map<string, Map<string, number>>();

  for (let point of points) {
    graph.set(`${point[0]} ${point[1]}`, new Map());
  }

  const dirs = {
    '^': [[-1, 0]],
    v: [[1, 0]],
    '<': [[0, -1]],
    '>': [[0, 1]],
    '.': [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ],
  };

  for (let [startingY, startingX] of points) {
    let stack: [number, number, number][] = [[0, startingY, startingX]];
    let seen = new Set<string>();
    seen.add(`${startingY} ${startingX}`);

    while (stack.length) {
      let [steps, y, x] = stack.pop() as [number, number, number];

      if (steps !== 0 && points.find(([sY, sX]) => sY === y && sX === x)) {
        let startKey = `${startingY} ${startingX}`;
        let endKey = `${y} ${x}`;
        if (!graph.has(startKey)) {
          graph.set(startKey, new Map<string, number>());
        }
        graph.get(startKey)!.set(endKey, steps);
        continue;
      }

      for (let [dr, dc] of dirs[data[y][x]]) {
        let nr = y + dr;
        let nc = x + dc;
        if (
          nr >= 0 &&
          nr < data.length &&
          nc >= 0 &&
          nc < data[0].length &&
          data[nr][nc] !== '#' &&
          !seen.has(`${nr} ${nc}`)
        ) {
          stack.push([steps + 1, nr, nc]);
          seen.add(`${nr} ${nc}`);
        }
      }
    }
  }

  const seen = new Set<string>();

  const dfs = ([y, x]: [number, number]) => {
    if (y === end[0] && x === end[1]) {
      return 0;
    }

    let maximum = -Infinity;

    seen.add(`${y} ${x}`);

    for (const [coordinate, length] of graph.get(`${y} ${x}`)) {
      const [adjacentPointY, adjacentPointX] = coordinate
        .split(' ')
        .map(Number);
      maximum = Math.max(
        maximum,
        dfs([adjacentPointY, adjacentPointX]) +
          graph.get(`${y} ${x}`).get(`${adjacentPointY} ${adjacentPointX}`),
      );
    }

    seen.delete(`${y} ${x}`);

    return maximum;
  };

  return dfs(start);
}

const answer = await day23a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
