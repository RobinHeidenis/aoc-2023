import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  return data
    .map((line) => {
      const [winningNumbersString, receivedNumbersString] = line
        .split(': ')[1]
        .split(' | ');
      const winningNumbers = Array.from(
        winningNumbersString.matchAll(/\d+/g),
        (item) => Number(item[0]),
      );
      const receivedNumbers = Array.from(
        receivedNumbersString.matchAll(/\d+/g),
        (item) => Number(item[0]),
      );
      const winningReceivedNumbers = receivedNumbers.filter((num) =>
        winningNumbers.includes(num),
      );

      if (winningReceivedNumbers.length === 0) return 0;
      return winningReceivedNumbers.reduce((prev) => prev * 2, 0.5);
    })
    .reduce((prev, curr) => prev + curr, 0);
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
