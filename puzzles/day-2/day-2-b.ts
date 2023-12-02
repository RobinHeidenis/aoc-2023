import { readData } from '../../shared.ts';
import chalk from 'chalk';

// Example line:
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  return data
    .map((line) => {
      if (line.length === 0) return 0;

      const colourValues = {
        red: 0,
        green: 0,
        blue: 0,
      };

      const revealItems = line
        .split(':')[1]
        .split(';')
        .flatMap((reveal) => reveal.split(','));

      revealItems.forEach((item) => {
        const numberRegex = /(\d+)/;
        const colourRegex = /(green|blue|red)/;

        const number = Number(item.match(numberRegex)[0]);
        const [colour] = item.match(colourRegex);

        const currentMax = colourValues[colour];
        if (currentMax === undefined)
          throw new Error('OOPSIE DOOPSIE SOMETHING WENT WRONG: ' + colour);

        if (currentMax < number) {
          colourValues[colour] = number;
        }
      });

      const { red, green, blue } = colourValues;

      return red * green * blue;
    })
    .reduce((prev, curr) => prev + curr, 0);
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
