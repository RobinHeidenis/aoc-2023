import { readData } from '../../shared.ts';
import chalk from 'chalk';

const rotateArray = (array: string[][], counterClockwise?: boolean) => {
  return counterClockwise
    ? array[0].map((val, index) =>
        array.map((row) => row[row.length - 1 - index]),
      )
    : array[0].map((val, index) => array.map((row) => row[index]).reverse());
};

export async function day14a(dataPath?: string) {
  const data = (await readData(dataPath)).map((l) => l.split(''));
  const rotatedArray = rotateArray(data, true);

  rotatedArray.forEach((line, index) => {
    let newLine = '';
    const lineSegments = line.join('').split(/(#)/g);
    lineSegments.forEach((segment) => {
      if (segment === '#') {
        newLine += '#';
        return;
      }
      if (segment === '.') {
        newLine += '.';
        return;
      }
      const zeroMatches = Array.from(segment.matchAll(/O/g), (i) => i[0]);
      zeroMatches.forEach(() => (newLine += 'O'));
      if (zeroMatches.length !== segment.length) {
        for (let i = 0; i < segment.length - zeroMatches.length; i++) {
          newLine += '.';
        }
      }
    });
    rotatedArray[index] = newLine.split('');
  });

  return rotatedArray.reduce(
    (prev, curr) =>
      prev +
      curr
        .reverse()
        .reduce((prev, curr, i) => (curr === 'O' ? prev + i + 1 : prev), 0),
    0,
  );
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
