import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Position = [x: number, y: number];
type Instruction = { position: Position; steps: number };

const getAbsolutePosition = (point: number, matrixLength: number) => {
  return point % (matrixLength - 1);
};

const gap = (point: number, matrixLength: number) =>
  getAbsolutePosition(point, matrixLength);

export async function day21b(dataPath?: string) {
  const data = (await readData(dataPath)).map((line) => line.split('')) as (
    | 'S'
    | '.'
    | '#'
  )[][];

  const startY = data.findIndex((l) => l.includes('S'));
  const startX = data[startY].findIndex((item) => item === 'S');

  console.assert(data.length === data[0].length, 'Grid is not square');
  const size = data.length;
  const steps = 26501365;

  console.assert(
    startY === startX,
    'Starting position is not in the middle of the grid, Starting X and Y are not the same',
  );
  console.assert(
    startY === Math.floor(size / 2),
    'Starting position is not in the middle of the grid',
  );
  console.assert(
    steps % size === Math.floor(size / 2),
    'Amount of steps is not a proper amount for our assumptions',
  );

  const fill = (startY: number, startX: number, steps: number) => {
    const queue: Instruction[] = [];
    queue.push({ position: [startX, startY], steps });

    const finalGardenPlots = new Set<string>();

    const seen = new Set<`${number} ${number}`>([`${startY} ${startX}`]);
    while (queue.length) {
      const {
        position: [x, y],
        steps,
      } = queue.shift();

      if (steps % 2 === 0) finalGardenPlots.add(`${x} ${y}`);
      if (steps === 0) continue;

      for (const [dirX, dirY] of [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ]) {
        if (
          dirY < 0 ||
          dirY > data.length - 1 ||
          dirX < 0 ||
          dirX > data[0].length - 1 ||
          data[dirY][dirX] === '#' ||
          seen.has(`${dirY} ${dirX}`)
        )
          continue;

        seen.add(`${dirY} ${dirX}`);
        queue.push({ position: [dirY, dirX], steps: steps - 1 });
      }
    }
    return finalGardenPlots.size;
  };

  const gridWidth = Math.floor(steps / size) - 1;
  const odd = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
  const even = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;

  const oddPoints = fill(startY, startX, size * 2 + 1);
  const evenPoints = fill(startY, startX, size * 2);

  const topCorner = fill(size - 1, startX, size - 1);
  const rightCorner = fill(startY, 0, size - 1);
  const bottomCorner = fill(0, startX, size - 1);
  const leftCorner = fill(startY, size - 1, size - 1);

  const smallSegmentSteps = Math.floor(size / 2) - 1;
  const smallSegmentTopRight = fill(size - 1, 0, smallSegmentSteps);
  const smallSegmentTopLeft = fill(size - 1, size - 1, smallSegmentSteps);
  const smallSegmentBottomRight = fill(0, 0, smallSegmentSteps);
  const smallSegmentBottomLeft = fill(0, size - 1, smallSegmentSteps);

  const largeSegmentSteps = ~~((size * 3) / 2) - 1;
  const largeSegmentTopRight = fill(size - 1, 0, largeSegmentSteps);
  const largeSegmentTopLeft = fill(size - 1, size - 1, largeSegmentSteps);
  const largeSegmentBottomRight = fill(0, 0, largeSegmentSteps);
  const largeSegmentBottomLeft = fill(0, size - 1, largeSegmentSteps);

  return (
    odd * oddPoints +
    even * evenPoints +
    topCorner +
    rightCorner +
    bottomCorner +
    leftCorner +
    (gridWidth + 1) *
      (smallSegmentTopRight +
        smallSegmentTopLeft +
        smallSegmentBottomRight +
        smallSegmentBottomLeft) +
    gridWidth *
      (largeSegmentTopRight +
        largeSegmentTopLeft +
        largeSegmentBottomRight +
        largeSegmentBottomLeft)
  );
}

const answer = await day21b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
