import { readData } from '../../shared.ts';
import chalk from 'chalk';

const cardValues = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  const handValues = data
    .map((line) => {
      const [hand, bid] = line.split(' ');

      const cards: { [card: string]: number } = {};

      hand
        .split('')
        .forEach((card) =>
          cards[card] !== undefined ? (cards[card] += 1) : (cards[card] = 1),
        );

      const amountOfCards = Object.keys(cards).length;
      const cardValues = Object.values(cards);

      let value = 1;
      switch (amountOfCards) {
        case 1:
          value = 7;
          break;
        case 2:
          if (cardValues.includes(4)) value = 6;
          else value = 5;
          break;
        case 3:
          if (cardValues.includes(3)) value = 4;
          else value = 3;
          break;
        case 4:
          if (cardValues.includes(2)) value = 2;
          break;
      }

      return { hand, value, bid: Number(bid) };
    })
    .sort((a, b) => a.value - b.value);

  handValues.sort((a, b) => {
    if (a.value !== b.value) return 0;

    const aHand = a.hand.split('');
    const bHand = b.hand.split('');

    for (let i = 0; i < aHand.length; i++) {
      const a = aHand[i];
      const b = bHand[i];
      if (a !== b) return cardValues[a] - cardValues[b];
    }

    return 0;
  });

  return handValues
    .map((item, i) => item.bid * (i + 1))
    .reduce((prev, curr) => prev + curr);
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
