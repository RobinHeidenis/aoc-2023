import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8a(dataPath?: string) {
  const [instructionsString, _, ...nodes] = await readData(dataPath);
  const instructions = instructionsString.split('');
  const nodesMap = new Map(
    nodes.map((item) => {
      const [node, rest] = item.split(' = ');
      const [left, right] = rest.replaceAll(/[)(]/g, '').split(', ');

      return [node, { node, L: left, R: right }];
    }),
  );

  let steps = 0;
  let node = nodesMap.get('AAA');
  while (node.node !== 'ZZZ') {
    for (const instruction of instructions) {
      if (node.node === 'ZZZ') break;
      steps++;
      node = nodesMap.get(node[instruction]);
    }
  }

  return steps;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
