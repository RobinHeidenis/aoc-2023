import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6b(dataPath?: string) {
  const [maxTime, recordDistance] = (await readData(dataPath)).map((line) =>
    Number(line.replaceAll(' ', '').match(/\d+/)),
  );

  let winningDistances = 0;
  for (let j = 1; j < maxTime; j++)
    if ((maxTime - j) * j > recordDistance) winningDistances++;

  return winningDistances;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
