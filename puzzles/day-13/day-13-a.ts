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

const findHorizontalReflection = (section: string[]) => {
  let cCount = section[0].length;
  for (let col = 0; col < cCount - 1; col++) {
    let valid = true;
    let l = col;
    let r = col + 1;
    while (l >= 0 && r < cCount) {
      let lCol = section.map((row) => row[l]).join('');
      let rCol = section.map((row) => row[r]).join('');
      if (lCol !== rCol) {
        valid = false;
        break;
      }
      l--;
      r++;
    }
    if (valid) return col + 1;
  }
  return null;
};

const findVerticalReflection = (section: string[]) => {
  for (let row = 0; row < section.length - 1; row++) {
    let valid = true;
    let l = row;
    let r = row + 1;
    while (l >= 0 && r < section.length) {
      let lRow = section[l];
      let rRow = section[r];
      if (lRow !== rRow) {
        valid = false;
        break;
      }
      l--;
      r++;
    }
    if (valid) return (row + 1) * 100;
  }
  return null;
};

export async function day13a(dataPath?: string) {
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

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
