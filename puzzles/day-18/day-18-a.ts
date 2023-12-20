import { readData } from '../../shared.ts';
import chalk from 'chalk';

const UP = 'U';
const DOWN = 'D';
const LEFT = 'L';
const RIGHT = 'R';

type Coordinate = { x: number; y: number };

type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

export async function day18a(dataPath?: string) {
  const data = await readData(dataPath);

  let area = 0;
  let perimeter = 0;
  let pos: Coordinate = { x: 0, y: 0 };
  for (const line of data) {
    const [direction, amountStr] = line.split(' ') as [Direction, string];
    const amount = Number(amountStr);
    let newPos: Coordinate;

    if (direction === UP) newPos = { x: pos.x + amount, y: pos.y };
    else if (direction === DOWN) newPos = { x: pos.x - amount, y: pos.y };
    else if (direction === LEFT) newPos = { x: pos.x, y: pos.y - amount };
    else newPos = { x: pos.x, y: pos.y + amount };

    area += pos.x * newPos.y - newPos.x * pos.y;
    perimeter += Math.abs(newPos.x - pos.x) + Math.abs(newPos.y - pos.y);
    pos = newPos;
  }

  return (Math.abs(area) + perimeter) / 2 + 1;
}

const answer = await day18a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
