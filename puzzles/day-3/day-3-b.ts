import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface AdjacentNumber {
  start: number;
  end: number;
  number: number;
}

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    const adjacentNumbers: AdjacentNumber[][] = [];
    for (const match of line.matchAll(/\*/g)) {
      const starIndex = match.index;
      const numberRegex = /\d+/g;

      const numbersInLine = Array.from(
        [
          ...line.matchAll(numberRegex),
          ...(i > 0 ? data[i - 1].matchAll(numberRegex) : []),
          ...(i < data.length - 1 ? data[i + 1].matchAll(numberRegex) : []),
        ],
        (match) => {
          return {
            start: match.index,
            end: match.index + match[0].length,
            number: Number(match[0]),
          };
        },
      ).filter(
        (number) =>
          number.start === starIndex + 1 ||
          number.end === starIndex ||
          ((number.start < starIndex || number.start === starIndex) &&
            (number.end > starIndex || number.end === starIndex)),
      );

      adjacentNumbers.push(numbersInLine);
    }

    sum += adjacentNumbers
      .filter((numberArray) => numberArray.length === 2)
      .map((numberArray) => numberArray[0].number * numberArray[1].number)
      .reduce((prev, curr) => prev + curr, 0);
  }

  return sum;
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
