import { readData } from '../../shared.ts';
import chalk from 'chalk';

const RIGHT = '0';
const DOWN = '1';
const LEFT = '2';
const UP = '3';

type Coordinate = { x: number; y: number };

type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

export async function day18b(dataPath?: string) {
  const data = await readData(dataPath);

  let area = 0;
  let perimeter = 0;
  let pos: Coordinate = { x: 0, y: 0 };
  for (const line of data) {
    const [_direction, _amountStr, hexStr] = line.split(' ') as [
      Direction,
      string,
      string,
    ];
    const hex = hexStr.replaceAll(/[#()]/g, '');
    const amountStr = hex.substring(0, 5);
    const direction = hex.slice(5);
    const amount = parseInt(amountStr, 16);
    let newPos: Coordinate;

    console.log(amount, direction, typeof direction);

    if (direction === UP) newPos = { x: pos.x + amount, y: pos.y };
    else if (direction === DOWN) newPos = { x: pos.x - amount, y: pos.y };
    else if (direction === LEFT) newPos = { x: pos.x, y: pos.y - amount };
    else if (direction === RIGHT) newPos = { x: pos.x, y: pos.y + amount };
    else
      throw new Error(
        "Please change the input format from CRLF to LF, then it'll work",
      );

    area += pos.x * newPos.y - newPos.x * pos.y;
    perimeter += Math.abs(newPos.x - pos.x) + Math.abs(newPos.y - pos.y);
    pos = newPos;
  }

  return (Math.abs(area) + perimeter) / 2 + 1;
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
