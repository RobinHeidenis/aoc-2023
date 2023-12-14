import { readData } from '../../shared.ts';
import chalk from 'chalk';

const rotateArray = (array: string[][], counterClockwise?: boolean) => {
  return counterClockwise
    ? array[0].map((_val, index) =>
        array.map((row) => row[row.length - 1 - index]),
      )
    : array[0].map((_val, index) => array.map((row) => row[index]).reverse());
};

const moveRocksLeft = (array: string[][]): string[][] => {
  const matrix = [...array];

  matrix.forEach((line, index) => {
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
    matrix[index] = newLine.split('');
  });

  return matrix;
};

const rotateCycle = (array: string[][]) => {
  let arr = [...array];

  for (let i = 0; i < 4; i++) {
    arr = moveRocksLeft(arr);
    arr = rotateArray(arr);
  }

  return arr;
};

export async function day14b(dataPath?: string) {
  const data = (await readData(dataPath)).map((l) => l.split(''));
  let rotatedArray = rotateArray(data, true);

  console.table(rotatedArray);

  for (let i = 0; i < 1000; i++) {
    rotatedArray = rotateCycle(rotatedArray);
  }

  return rotatedArray.reduce(
    (prev, curr) =>
      prev +
      curr
        .reverse()
        .reduce((prev, curr, i) => (curr === 'O' ? prev + i + 1 : prev), 0),
    0,
  );
}

console.time('Run');
const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.timeEnd('Run');
