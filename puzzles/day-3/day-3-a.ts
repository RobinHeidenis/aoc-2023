import { readData } from '../../shared.ts';
import chalk from 'chalk';

const specialCharacterRegex = /[^A-Za-z 0-9.]/;

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    const matches = line.matchAll(/(\d+)/g);

    for (const match of matches) {
      const number = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + number.length;
      const substringStartIndex = startIndex > 0 ? startIndex - 1 : startIndex;
      const substringEndIndex =
        endIndex < line.length ? endIndex + 1 : endIndex;

      let lineToMatch = '';

      if (i > 0) {
        lineToMatch += data[i - 1].substring(
          substringStartIndex,
          substringEndIndex,
        );
      }
      lineToMatch += line.substring(substringStartIndex, substringEndIndex);
      if (i < data.length - 1) {
        lineToMatch += data[i + 1].substring(
          substringStartIndex,
          substringEndIndex,
        );
      }
      const specialCharsMatch = lineToMatch.match(specialCharacterRegex);
      if (specialCharsMatch !== null) sum += Number(number);
    }
  }

  return sum;
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
