import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day9a(dataPath?: string) {
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

      levels.at(-1).push(0);
      for (let i = levels.length - 2; i >= 0; i--) {
        const level = levels[i];
        level.push(level.at(-1) + levels[i + 1].at(-1));
      }

      return levels.at(0).at(-1);
    })
    .reduce((prev, curr) => prev + curr);
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
