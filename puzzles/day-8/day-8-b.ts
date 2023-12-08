import { readData } from '../../shared.ts';
import chalk from 'chalk';

const lcm = (arr: number[]) => {
  const gcd = (x: number, y: number) => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

export async function day8b(dataPath?: string) {
  const [instructionsString, _, ...nodes] = await readData(dataPath);
  const nodesMap = new Map(
    nodes.map((item) => {
      const [node, rest] = item.split(' = ');
      const [left, right] = rest.replaceAll(/[)(]/g, '').split(', ');

      return [node, { node, L: left, R: right }];
    }),
  );

  const nodeStateMap = new Map(
    Array.from(nodesMap.keys())
      .filter((n) => n.endsWith('A'))
      .map((n) => [n, { node: nodesMap.get(n), steps: 0 }]),
  );

  const stepsArr = [];

  for (let [_, { node }] of nodeStateMap) {
    let currentNode = node;
    let steps = 0;
    while (!currentNode.node.endsWith('Z')) {
      for (const instruction of instructionsString.split('')) {
        if (currentNode.node.endsWith('Z')) break;
        steps++;
        currentNode = nodesMap.get(currentNode[instruction]);
      }
    }
    stepsArr.push(steps);
  }

  return lcm(stepsArr);
}

console.time('run');
const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.timeEnd('run');
