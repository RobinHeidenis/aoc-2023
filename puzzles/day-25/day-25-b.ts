import chalk from 'chalk';

export async function day25b() {
  return 'PRESS THE BIG RED BUTTON!!!!!';
}

const answer = await day25b();
console.log(chalk.bgGreen('Your Answer:'), chalk.red(answer));
console.log(
  '🎄🎄🎄🎄🎄🎄 ',
  chalk.bgGreen('M') +
    chalk.bgGreen('E') +
    chalk.bgRed('R') +
    chalk.bgRed('R') +
    chalk.bgGreen('Y') +
    chalk.bgGreen(' ') +
    chalk.bgRed('C') +
    chalk.bgRed('H') +
    chalk.bgGreen('R') +
    chalk.bgGreen('I') +
    chalk.bgRed('S') +
    chalk.bgRed('T') +
    chalk.bgGreen('M') +
    chalk.bgGreen('A') +
    chalk.bgRed('S') +
    chalk.bgRed('!'),
  '🎄🎄🎄🎄🎄🎄🎄',
);
