import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  const rowsToExpand = data
    .map((line, i) => {
      if (!line.includes('#')) return i;
      return null;
    })
    .filter((i) => typeof i === 'number');

  const colsToExpand = [];
  for (let i = 0; i < data[0].length; i++) {
    let starInThisRow = false;
    for (let j = 0; j < data.length; j++) {
      if (data[j][i] === '#') starInThisRow = true;
    }
    if (!starInThisRow) colsToExpand.push(i);
  }

  let expandedSky = [...data];

  rowsToExpand.forEach((skyIndex, i) => {
    expandedSky.splice(
      skyIndex + i,
      0,
      Array.from({ length: data[0].length }).fill('.').join(''),
    );
  });

  colsToExpand.forEach((skyIndex, i) => {
    expandedSky.forEach((row, index) => {
      expandedSky[index] = row
        .split('')
        .toSpliced(skyIndex + i, 0, '.')
        .join('');
    });
  });

  const galaxies: { x: number; y: number }[] = [];
  expandedSky.forEach((line, i) => {
    const matches = line.matchAll(/#/g);
    galaxies.push(
      ...Array.from(matches, (match) => {
        return {
          x: match.index,
          y: i,
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

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
