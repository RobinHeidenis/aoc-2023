import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day9b(dataPath?: string) {
  const data = await readData(dataPath);

  return data
    .map((line) => {
      const levels: number[][] = [line.split(' ').map(Number)];

      while (!levels.at(-1).every((i) => i === 0)) {
        const sequence: number[] = [];
        const level = levels.at(-1);
        for (let i = 0; i < level.length - 1; i++) {
          sequence.push(level[i + 1] - level[i]);
        }
        levels.push(sequence);
      }

      levels.at(-1).unshift(0);
      for (let i = levels.length - 2; i >= 0; i--) {
        const level = levels[i];
        level.unshift(level.at(0) - levels[i + 1].at(0));
      }

      return levels.at(0).at(0);
    })
    .reduce((prev, curr) => prev + curr);
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
