import { readData } from '../../shared.ts';
import chalk from 'chalk';

const numberMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const eligibleFlowNumbers = {
  one: 1,
  two: 2,
  three: 3,
  eight: 8,
  nine: 9,
};

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);

  return data
    .map((line) => {
      if (line.length === 0) return 0;

      const numbers: number[] = [];

      for (let i = 0; i < line.length - 1; ) {
        const substring = line.substring(i, i + 6);

        const possibleMatches = Object.keys(numberMap).filter((key) =>
          key.startsWith(substring[0]),
        );

        const notFoundKey = possibleMatches.every((key) => {
          if (substring.startsWith(key)) {
            numbers.push(numberMap[key]);
            for (let numberMapKey in eligibleFlowNumbers) {
              if (
                line
                  .substring(i + key.length - 1, i + key.length + 6)
                  .startsWith(numberMapKey)
              ) {
                numbers.push(numberMap[numberMapKey]);
                i += numberMapKey.length - 1;
                break;
              }
            }

            i += key.length;

            return false;
          }
          return true;
        });

        if (notFoundKey) {
          const number = parseInt(line[i]);
          if (!isNaN(number)) numbers.push(number);
          i++;
        }
      }

      return Number(`${numbers.at(0)}${numbers.at(-1)}`);
    })
    .reduce((prev, curr) => prev + curr, 0);
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
