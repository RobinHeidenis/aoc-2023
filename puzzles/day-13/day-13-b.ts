import { readData } from '../../shared.ts';
import chalk from 'chalk';

const format = (text: string) => {
  let lines = text.split('\n');
  let sections: string[][] = [];
  let section: string[] = [];
  for (let line of lines) {
    if (!line) {
      sections.push([...section]);
      section = [];
    } else {
      section.push(line);
    }
  }
  sections.push([...section]);
  return sections;
};

const getDiff = (left: string, right: string) => {
  let diff = 0;
  let i = 0;
  while (i < left.length) {
    if (left[i] !== right[i]) diff++;
    i++;
  }
  return diff;
};

const findHorizontalReflection = (section: string[]) => {
  let cCount = section[0].length;
  for (let col = 0; col < cCount - 1; col++) {
    let l = col;
    let r = col + 1;
    let diff = 0;
    while (l >= 0 && r < cCount) {
      let lCol = section.map((row) => row[l]).join('');
      let rCol = section.map((row) => row[r]).join('');
      diff += getDiff(lCol, rCol);
      l--;
      r++;
    }
    if (diff === 1) return col + 1;
  }
  return null;
};

const findVerticalReflection = (section: string[]) => {
  for (let row = 0; row < section.length - 1; row++) {
    let diff = 0;
    let l = row;
    let r = row + 1;
    while (l >= 0 && r < section.length) {
      let lRow = section[l];
      let rRow = section[r];
      diff += getDiff(lRow, rRow);
      l--;
      r++;
    }
    if (diff === 1) return (row + 1) * 100;
  }
  return null;
};

export async function day13b(dataPath?: string) {
  const data = await readData(dataPath, true);

  const sections = format(data);
  let sum = 0;
  for (let section of sections) {
    let horizontal = findHorizontalReflection(section);
    let vertical = findVerticalReflection(section);
    sum += horizontal ?? vertical ?? 0;
  }
  return sum;
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
