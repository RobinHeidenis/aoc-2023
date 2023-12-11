import { readData } from '../../shared.ts';
import chalk from 'chalk';

const ONE_MILLION = 1_000_000;

export async function day11b(dataPath?: string) {
  const data = await readData(dataPath);

  const rowsToExpand = data
    .map((line, i) => {
      if (!line.includes('#')) return i;
      return null;
    })
    .filter((i) => typeof i === 'number');

  const colsToExpand = [];
  for (let i = 0; i < data[0].length; i++) {
    let galaxyInThisRow = false;
    for (let j = 0; j < data.length; j++) {
      if (data[j][i] === '#') galaxyInThisRow = true;
    }
    if (!galaxyInThisRow) colsToExpand.push(i);
  }

  const galaxies: { x: number; y: number }[] = [];
  data.forEach((line, i) => {
    const matches = line.matchAll(/#/g);

    galaxies.push(
      ...Array.from(matches, (match) => {
        const x = match.index;
        let amountOfColCrosses = 0;
        colsToExpand.forEach((col) => {
          if (col < x) amountOfColCrosses++;
        });
        let amountOfRowCrosses = 0;
        rowsToExpand.forEach((row) => {
          if (row < i) amountOfRowCrosses++;
        });

        return {
          x: x + amountOfColCrosses * (ONE_MILLION - 1),
          y: i + amountOfRowCrosses * (ONE_MILLION - 1),
        };
      }),
    );
  });

  const pathLengths: number[] = [];
  galaxies.forEach((galaxy, index) => {
    const { x, y } = galaxy;
    galaxies.slice(index + 1).forEach((g) => {
      pathLengths.push(Math.abs(g.x - x) + Math.abs(g.y - y));
    });
  });

  return pathLengths.reduce((prev, curr) => prev + curr);
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
