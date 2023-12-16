import { readData } from '../../shared.ts';
import chalk from 'chalk';

const calculateHashForCharacter = (character: string, currentValue: number) => {
  const asciiValue = character.charCodeAt(0);
  currentValue += asciiValue;
  currentValue *= 17;
  currentValue %= 256;
  return currentValue;
};

const calculateHashForString = (string: string) => {
  return string
    .split('')
    .reduce((prev, curr) => calculateHashForCharacter(curr, prev), 0);
};
export async function day15a(dataPath?: string) {
  const data = await readData(dataPath, true);

  const steps = data.split(',');
  return steps.reduce((prev, curr) => prev + calculateHashForString(curr), 0);
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
