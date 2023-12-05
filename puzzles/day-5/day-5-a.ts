import chalk from 'chalk';
import { readFile } from 'fs/promises';

export async function day5a(dataPath?: string) {
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();

  const maps: {
    [key: string]: {
      originStart: number;
      destinationStart: number;
      range: number;
      offset: number;
    }[];
  } = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': [],
  };

  const seeds = Array.from(
    data.split('\n')[0].matchAll(/\d+/g),
    (item) => item[0],
  );

  const lines = data.split('\n\n');

  lines.shift();

  lines.forEach((mapDef) => {
    const defLines = mapDef.split('\n');
    const key = defLines[0].split(' ')[0];
    const mapItem = maps[key];
    if (!mapItem) throw new Error('OOPSIE SOMETHING WENT WRONG: ' + key);
    defLines.shift();

    defLines.forEach((line) => {
      const numbers = line.split(' ');
      const destinationStart = Number(numbers[0]);
      const originStart = Number(numbers[1]);
      const range = Number(numbers[2]);

      mapItem.push({
        originStart,
        destinationStart,
        range: range - 1,
        offset: destinationStart - originStart,
      });
    });
  });

  let lowestNumber = Number.MAX_SAFE_INTEGER;
  seeds.forEach((seed) => {
    const seedNum = Number(seed);

    const soil =
      maps['seed-to-soil'].find(
        ({ originStart, range }) =>
          seedNum >= originStart && seedNum <= originStart + range,
      )?.offset + seedNum || seedNum;
    const fertilizer =
      maps['soil-to-fertilizer'].find(
        ({ originStart, range }) =>
          soil >= originStart && soil <= originStart + range,
      )?.offset + soil || soil;
    const water =
      maps['fertilizer-to-water'].find(
        ({ originStart, range }) =>
          fertilizer >= originStart && fertilizer <= originStart + range,
      )?.offset + fertilizer || fertilizer;
    const light =
      maps['water-to-light'].find(
        ({ originStart, range }) =>
          water >= originStart && water <= originStart + range,
      )?.offset + water || water;
    const temperature =
      maps['light-to-temperature'].find(
        ({ originStart, range }) =>
          light >= originStart && light <= originStart + range,
      )?.offset + light || light;
    const humidity =
      maps['temperature-to-humidity'].find(
        ({ originStart, range }) =>
          temperature >= originStart && temperature <= originStart + range,
      )?.offset + temperature || temperature;
    const location =
      maps['humidity-to-location'].find(
        ({ originStart, range }) =>
          humidity >= originStart && humidity <= originStart + range,
      )?.offset + humidity || humidity;

    if (location < lowestNumber) lowestNumber = location;
  });

  return lowestNumber;
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
