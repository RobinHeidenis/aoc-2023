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

const boxMap = new Map<number, `${string} ${number}`[]>();

export async function day15b(dataPath?: string) {
  const data = await readData(dataPath, true);

  data.split(',').forEach((step) => {
    const [lensLabel] = step.split(/[-=]/g);
    const boxNumber = calculateHashForString(lensLabel);
    if (!boxMap.has(boxNumber)) boxMap.set(boxNumber, []);
    const box = boxMap.get(boxNumber);
    const lensIndex = box.findIndex((i) => i.split(' ')[0] === lensLabel);
    const operation = step.match(/[-=]/)[0];

    if (operation === '-' && lensIndex > -1) {
      const newLensArray = box.slice();
      newLensArray.splice(lensIndex, 1);
      boxMap.set(boxNumber, newLensArray);
      return;
    }

    if (operation === '=') {
      const focalLength = step.split('=')[1];

      if (lensIndex > -1) {
        const newLensArray = box.slice();
        newLensArray.splice(
          lensIndex,
          1,
          `${lensLabel} ${Number(focalLength)}`,
        );
        boxMap.set(boxNumber, newLensArray);
        return;
      }

      boxMap.set(boxNumber, [...box, `${lensLabel} ${Number(focalLength)}`]);
    }
  });

  return Array.from(boxMap.entries()).reduce((prev, [boxNumber, lensArray]) => {
    return (
      prev +
      lensArray.reduce((prev, curr, index) => {
        return (
          prev + (boxNumber + 1) * (index + 1) * Number(curr.split(' ')[1])
        );
      }, 0)
    );
  }, 0);
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
