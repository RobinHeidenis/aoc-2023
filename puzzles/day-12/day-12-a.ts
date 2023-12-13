import { readData } from '../../shared.ts';
import chalk from 'chalk';

const generateRandomKnowns = (string: string) => {
  const generateRandomNum = () => Math.floor(Math.random() * 10);
  const workArr = string.slice().split('');
  for (let i = 0; i < workArr.length; i++) {
    if (workArr[i] === '?') {
      const randomNum = generateRandomNum();
      if (randomNum < 5) workArr[i] = '.';
      else workArr[i] = '#';
    }
  }
  return workArr.join('');
};

const checkCorrect = (candidate: string, check: string) => {
  const brokenMatches = Array.from(candidate.matchAll(/#+/g), (m) => m[0]);
  const checkItems = check.split(',').map((c) => Number(c));
  if (brokenMatches.length !== checkItems.length) return false;
  for (let i = 0; i < checkItems.length; i++) {
    if (brokenMatches[i]?.length !== checkItems[i]) return false;
  }
  return true;
};

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);

  return data
    .map((line, index) => {
      const [conditionsWithUnknowns, differentlyFormattedConditions] =
        line.split(' ');

      const seenVariationsMap = new Set();

      if (index % 50 === 0) console.log('Iteration:', index);
      let amountOfCorrectOptions = 0;
      for (let i = 0; i < 1_000_000; i++) {
        const string = generateRandomKnowns(conditionsWithUnknowns);
        if (seenVariationsMap.has(string)) continue;
        seenVariationsMap.add(string);
        if (checkCorrect(string, differentlyFormattedConditions)) {
          amountOfCorrectOptions++;
          // console.log('valid:', string);
        }
      }
      // console.log(line, amountOfCorrectOptions);
      return amountOfCorrectOptions;
    })
    .reduce((prev, curr) => prev + curr);
}

console.time('Run');
const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.timeEnd('Run');
