import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  return data.map(line => {
    const numberArray = line.split('').filter(Number);

    if (numberArray.length === 0) {
      return 0;
    }

    return Number(`${numberArray.at(0)}${numberArray.at(-1)}`)
  }).reduce((acc, curr) => acc + curr, 0)
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
