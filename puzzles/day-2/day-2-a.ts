import { readData } from '../../shared.ts';
import chalk from 'chalk';

const maxValues = {
  red: 12,
  green: 13,
  blue: 14,
};

// Example line:
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  const games = data.map((line) => {
    if (line.length === 0)
      return { gameID: 0, maxRed: 0, maxBlue: 0, maxGreen: 0 };

    const colourValues = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const [game, rest] = line.split(':');

    const revealItems = rest.split(';').flatMap((reveal) => reveal.split(','));

    revealItems.forEach((item) => {
      const numberRegex = /(\d+)/;
      const colourRegex = /(green|blue|red)/;

      const number = Number(item.match(numberRegex)[0]);
      const [colour] = item.match(colourRegex);

      const currentMax = colourValues[colour];

      if (currentMax < number) {
        colourValues[colour] = number;
      }
    });

    const { red, green, blue } = colourValues;

    return {
      gameID: parseInt(game.substring(5)),
      maxRed: red,
      maxGreen: green,
      maxBlue: blue,
    };
  });

  const possibleGames = games.filter((game) => {
    return !(
      game.maxBlue > maxValues.blue ||
      game.maxRed > maxValues.red ||
      game.maxGreen > maxValues.green
    );
  });

  return possibleGames.reduce((prev, curr) => prev + curr.gameID, 0);
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
