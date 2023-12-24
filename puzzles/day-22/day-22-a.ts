import { readData } from '../../shared.ts';
import chalk from 'chalk';

// Data is in format start[x, y, z]~end[x, y, z] where Z is the vertical axis.

type Brick = [number, number, number, number, number, number];

export async function day22a(dataPath?: string) {
  const bricks: Brick[] = (await readData(dataPath))
    .map((line) => line.replace('~', ',').split(',').map(Number) as Brick)
    .sort((a, b) => a[2] - b[2]);

  const overlaps = (a: Brick, b: Brick) =>
    Math.max(a[0], b[0]) <= Math.min(a[3], b[3]) &&
    Math.max(a[1], b[1]) <= Math.min(a[4], b[4]);

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    let maxZ = 1;
    for (let checkBrick of bricks.slice(0, i)) {
      if (overlaps(brick, checkBrick)) {
        maxZ = Math.max(maxZ, checkBrick[5] + 1);
      }
    }
    brick[5] -= brick[2] - maxZ;
    brick[2] = maxZ;
  }

  bricks.sort((a: Brick, b: Brick) => a[2] - b[2]);

  const keySupportsValue = new Map<number, Set<number>>();
  const valueSupportsKey = new Map<number, Set<number>>();

  for (let i = 0; i < bricks.length; i++) {
    keySupportsValue.set(i, new Set<number>());
    valueSupportsKey.set(i, new Set<number>());
  }

  for (let j = 0; j < bricks.length; j++) {
    const upper = bricks[j];
    const slice = bricks.slice(0, j);
    for (let i = 0; i < slice.length; i++) {
      const lower = slice[i];
      if (overlaps(lower, upper) && upper[2] === lower[5] + 1) {
        keySupportsValue.get(i).add(j);
        valueSupportsKey.get(j).add(i);
      }
    }
  }

  let total = 0;

  for (let i = 0; i < bricks.length; i++) {
    if (
      Array.from(keySupportsValue.get(i)).every(
        (j) => valueSupportsKey.get(j).size >= 2,
      )
    ) {
      total += 1;
    }
  }

  return total;
}

const answer = await day22a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
