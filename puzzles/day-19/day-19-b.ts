import chalk from 'chalk';
import { readData } from '../../shared.ts';

const REJECT = 'R';
const ACCEPT = 'A';

const GT = '>';
const LT = '<';

interface Condition {
  identifier: string;
  operator: typeof GT | typeof LT;
  value: number;
  result: string | typeof ACCEPT | typeof REJECT;
}

interface Part {
  x: { start: number; end: number };
  m: { start: number; end: number };
  a: { start: number; end: number };
  s: { start: number; end: number };
}

const runWorkflow = (
  part: Part,
  workflowIdentifier: string,
  workflowMap: Map<string, Condition[]>,
) => {
  if (workflowIdentifier === REJECT) return 0;
  if (workflowIdentifier === ACCEPT) {
    return Object.values(part).reduce((product, { start, end }) => {
      return product * (end - start + 1);
    }, 1);
  }

  let combos = 0;
  for (const { identifier, operator, value, result } of workflowMap.get(
    workflowIdentifier,
  )) {
    const { start: low, end: high } = part[identifier];

    if ((operator === GT && low > value) || (operator === LT && low < value)) {
      if (
        (operator === GT && high > value) ||
        (operator === LT && high < value)
      ) {
        return combos + runWorkflow(part, result, workflowMap);
      } else {
        combos += runWorkflow(
          {
            ...part,
            [identifier]: {
              start: low,
              end: value - 1,
            },
          },
          result,
          workflowMap,
        );
        part[identifier] = { start: value, end: high };
      }
    } else if (
      (operator === GT && high > value) ||
      (operator === LT && high < value)
    ) {
      combos += runWorkflow(
        {
          ...part,
          [identifier]: { start: value + 1, end: high },
        },
        result,
        workflowMap,
      );
      part[identifier] = { start: low, end: value };
    }
  }
};

export async function day19b(dataPath?: string) {
  const [workflowsBlock] = (await readData(dataPath, true)).split('\n\n');
  const workflows = new Map<string, Condition[]>();

  workflowsBlock.split('\n').forEach((workflow) => {
    const [identifier, conditionsStr] = workflow.split('{');
    const conditions = conditionsStr.replace('}', '').split(',');
    const parsedConditions = conditions.map((condition) => {
      if (condition.includes(GT) || condition.includes(LT)) {
        const operator = condition.includes(GT) ? GT : LT;
        const [id, valueAndResult] = condition.split(operator);
        const [value, result] = valueAndResult.split(':');
        return {
          identifier: id,
          operator,
          value: Number(value),
          result,
        } satisfies Condition;
      } else {
        return { identifier: 'x', operator: GT, value: 0, result: condition };
      }
    }) as Condition[];

    workflows.set(identifier, parsedConditions);
  });

  return runWorkflow(
    {
      x: { start: 1, end: 4000 },
      m: { start: 1, end: 4000 },
      a: { start: 1, end: 4000 },
      s: { start: 1, end: 4000 },
    },
    'in',
    workflows,
  );
}

const answer = await day19b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
