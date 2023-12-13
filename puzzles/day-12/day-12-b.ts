import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);

  const cache = new Map<string, number>();
  const _countWays = (row: string, ns: number[]): number => {
    row = row.replace(/^\.+|\.+$/, '');
    if (row === '') return ns.length ? 0 : 1;
    if (!ns.length) return row.includes('#') ? 0 : 1;
    const key = [row, ns].join(' ');
    if (cache.has(key)) return cache.get(key)!;

    let result = 0;
    const damaged = row.match(/^#+(?=\.|$)/);
    if (damaged) {
      if (damaged[0].length === ns[0]) {
        result += _countWays(row.slice(ns[0]), ns.slice(1));
      }
    } else if (row.includes('?')) {
      const total = ns.reduce((a, b) => a + b);
      result += _countWays(row.replace('?', '.'), ns);
      if ((row.match(/#/g) || []).length < total) {
        result += _countWays(row.replace('?', '#'), ns);
      }
    }
    cache.set(key, result);
    return result;
  };

  return data
    .map((line) => {
      const [conditionsWithUnknowns, differentlyFormattedConditions] =
        line.split(' ');
      const [
        unfoldedConditionsWithUnknowns,
        unfoldedDifferentlyFormattedConditions,
      ] = [
        [...Array(5)].fill(conditionsWithUnknowns).join('?'),
        [...Array(5)].fill(differentlyFormattedConditions).join(','),
      ];
      return _countWays(
        unfoldedConditionsWithUnknowns,
        unfoldedDifferentlyFormattedConditions.split(',').map(Number),
      );
    })
    .reduce((prev, curr) => prev + curr);
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
