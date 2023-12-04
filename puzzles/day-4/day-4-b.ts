import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);
  const cardMap: Map<number, { line: string; amount: number }> = new Map();

  data.forEach((line, i) => {
    const [cardNumberString, rest] = line.split(': ');
    const cardNumber = Number(cardNumberString.match(/\d+/)[0]);
    if (!cardMap.has(cardNumber)) cardMap.set(cardNumber, { line, amount: 1 });

    const [winningNumbersString, receivedNumbersString] = rest.split('|');
    const winningNumbers = Array.from(
      winningNumbersString.matchAll(/\d+/g),
      (item) => Number(item[0]),
    );
    const receivedNumbers = Array.from(
      receivedNumbersString.matchAll(/\d+/g),
      (item) => Number(item[0]),
    );

    const winningReceivedNumbers = receivedNumbers.filter((num) =>
      winningNumbers.includes(num),
    );

    const { amount: currentLineAmount } = cardMap.get(cardNumber);

    winningReceivedNumbers.forEach((_, i) => {
      const cardMapNumber = cardNumber + i + 1;
      if (!cardMap.has(cardMapNumber)) {
        cardMap.set(cardMapNumber, {
          line: data[cardMapNumber],
          amount: 1 + currentLineAmount,
        });
        return;
      }
      const cardMapItem = cardMap.get(cardMapNumber);
      cardMap.set(cardNumber + i + 1, {
        ...cardMapItem,
        amount: cardMapItem.amount + currentLineAmount,
      });
    });
  });

  return Array.from(cardMap.values()).reduce(
    (prev, curr) => prev + curr.amount,
    0,
  );
}

console.time('run');
const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.timeEnd('run');
