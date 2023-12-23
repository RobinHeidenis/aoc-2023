import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Position = [x: number, y: number];
type Instruction = { position: Position; steps: number };

export async function day21a(dataPath?: string) {
  const data = (await readData(dataPath)).map((line) => line.split('')) as (
    | 'S'
    | '.'
    | '#'
  )[][];

  const startY = data.findIndex((l) => l.includes('S'));
  const startX = data[startY].findIndex((item) => item === 'S');

  const queue: Instruction[] = [];

  queue.push({ position: [startX, startY], steps: 0 });

  const finalGardenPlots = new Set<string>();

  while (queue.length) {
    const {
      position: [x, y],
      steps,
    } = queue.shift();

    if (
      x < 0 ||
      x > data[0].length - 1 ||
      y < 0 ||
      y > data.length - 1 ||
      data[y][x] === '#'
    )
      continue;

    if (steps === 64) {
      finalGardenPlots.add(`x:${x}, y:${y}`);
      continue;
    }

    const newSteps = steps + 1;

    for (const [dirX, dirY] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      if (
        !queue.find(
          (i) =>
            i.steps === newSteps &&
            i.position[0] === x + dirX &&
            i.position[1] === y + dirY,
        )
      ) {
        queue.push({ position: [x + dirX, y + dirY], steps: newSteps });
      }
    }
  }

  console.log(finalGardenPlots);
  return finalGardenPlots.size;
}

const answer = await day21a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
