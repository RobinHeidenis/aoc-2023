import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Node = {
  heatLoss: number;
  y: number;
  x: number;
  directionY: number;
  directionX: number;
  directionSteps: number;
};

export async function day17a(dataPath?: string) {
  const nodes = (await readData(dataPath)).map((l, i) =>
    l.split('').map(Number),
  );

  const seen = new Set<string>();

  const customPriorityComparator = (a: Node, b: Node) =>
    b.heatLoss - a.heatLoss;

  const pq: Node[] = [
    {
      heatLoss: 0,
      y: 0,
      x: 0,
      directionY: 0,
      directionX: 0,
      directionSteps: 0,
    },
  ];

  while (pq.length) {
    const { heatLoss, y, x, directionY, directionX, directionSteps } = pq
      .sort(customPriorityComparator)
      .pop();

    if (y === nodes.length - 1 && x === nodes[0].length - 1) {
      return heatLoss;
    }

    const key = `${y}, ${x}, ${directionY}, ${directionX}, ${directionSteps}`;

    if (seen.has(key)) continue;

    seen.add(key);

    if (directionSteps < 3 && (directionX !== 0 || directionY !== 0)) {
      const nextY = y + directionY;
      const nextX = x + directionX;
      if (
        nextX >= 0 &&
        nextX < nodes[0].length &&
        nextY >= 0 &&
        nextY < nodes.length
      ) {
        pq.push({
          heatLoss: heatLoss + nodes[nextY][nextX],
          x: nextX,
          y: nextY,
          directionX,
          directionY,
          directionSteps: directionSteps + 1,
        });
      }
    }

    for (const [newDirectionX, newDirectionY] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      if (
        (newDirectionX !== directionX || newDirectionY !== directionY) &&
        (newDirectionX !== -directionX || newDirectionY !== -directionY)
      ) {
        const nextY = y + newDirectionY;
        const nextX = x + newDirectionX;
        if (
          nextX >= 0 &&
          nextX < nodes[0].length &&
          nextY >= 0 &&
          nextY < nodes.length
        ) {
          pq.push({
            heatLoss: heatLoss + nodes[nextY][nextX],
            x: nextX,
            y: nextY,
            directionX: newDirectionX,
            directionY: newDirectionY,
            directionSteps: 1,
          });
        }
      }
    }
  }

  return 0;
}

console.time('Run');
const answer = await day17a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.timeEnd('Run');
