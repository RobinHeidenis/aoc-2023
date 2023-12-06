import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6a(dataPath?: string) {
  const [timeLine, distanceLine] = await readData(dataPath);
  const times = Array.from(timeLine.matchAll(/\d+/g), (item) => item[0]);
  const distances = Array.from(
    distanceLine.matchAll(/\d+/g),
    (item) => item[0],
  );

  return times
    .map((timeString, i) => {
      const time = Number(timeString);

      let winningDistances = 0;
      for (let j = 1; j < time; j++)
        if ((time - j) * j > Number(distances[i])) winningDistances++;

      return winningDistances;
    })
    .reduce((prev, curr) => prev * curr);
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
