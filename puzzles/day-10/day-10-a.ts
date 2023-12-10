import { readData } from '../../shared.ts';
import chalk from 'chalk';
import * as console from 'console';

const pipes = {
  F: 'F',
  '7': '7',
  L: 'L',
  J: 'J',
  '-': '-',
  '|': '|',
  S: 'S',
  '.': '.',
} as const;

const directions = {
  above: { x: 0, y: -1 },
  below: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
} as const;

const { above, below, left, right } = directions;

const allowedNextPipes: Record<
  keyof typeof pipes,
  {
    direction: (typeof directions)[keyof typeof directions];
    disallowed: (keyof typeof pipes)[];
  }[]
> = {
  F: [
    { direction: right, disallowed: [pipes.F, pipes.L, pipes['|']] },
    { direction: below, disallowed: [pipes.F, pipes['7'], pipes['-']] },
  ],
  '7': [
    { direction: left, disallowed: [pipes['7'], pipes.J, pipes['|']] },
    { direction: below, disallowed: [pipes['7'], pipes.F, pipes['-']] },
  ],
  L: [
    { direction: right, disallowed: [pipes.L, pipes.F, pipes['|']] },
    { direction: above, disallowed: [pipes.L, pipes.J, pipes['-']] },
  ],
  J: [
    { direction: left, disallowed: [pipes.J, pipes['7'], pipes['|']] },
    { direction: above, disallowed: [pipes.J, pipes['L'], pipes['-']] },
  ],
  '-': [
    { direction: right, disallowed: [pipes['|'], pipes.F, pipes.L] },
    { direction: left, disallowed: [pipes['|'], pipes.J, pipes['7']] },
  ],
  '|': [
    { direction: above, disallowed: [pipes['-'], pipes.L, pipes.J] },
    { direction: below, disallowed: [pipes['-'], pipes.F, pipes['7']] },
  ],
  S: [
    { direction: above, disallowed: [pipes['.']] },
    { direction: below, disallowed: [pipes['.']] },
    { direction: left, disallowed: [pipes['.']] },
    { direction: right, disallowed: [pipes['.']] },
  ],
  '.': [],
};

export async function day10a(dataPath?: string) {
  const data = (await readData(dataPath)).map((l) => l.split(''));

  let startX: number;
  let startY: number;

  startY = data.findIndex((l) => {
    const SIndex = l.findIndex((u) => u === 'S');
    if (SIndex === -1) return false;
    startX = SIndex;
    return true;
  });

  let done = false;
  let currentX = startX;
  let currentY = startY;
  let previousDirection = { x: startX, y: startY };
  let steps = 0;
  while (!done) {
    const pipe = data[currentY][currentX] as keyof typeof pipes;
    const checkDirections = allowedNextPipes[pipe];
    steps++;
    for (const dir of checkDirections) {
      const {
        direction: { x, y },
        disallowed,
      } = dir;
      if (x === previousDirection.x && y === previousDirection.y) continue;
      const pipeAtLocation = data[currentY + y]?.[
        currentX + x
      ] as keyof typeof pipes;
      if (
        pipeAtLocation === undefined ||
        disallowed.includes(pipeAtLocation) ||
        pipeAtLocation === '.'
      )
        continue;
      if (pipeAtLocation === 'S') {
        done = true;
        continue;
      }
      currentY = currentY + y;
      currentX = currentX + x;
      previousDirection = { x: x === 0 ? 0 : -x, y: y === 0 ? 0 : -y };
      break;
    }
  }

  return steps / 2;
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
