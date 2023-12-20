import { readData } from '../../shared.ts';
import chalk from 'chalk';

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

interface EndCondition {
  destination: string | typeof ACCEPT | typeof REJECT;
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

const evaluateCondition = (part: Part, condition: Condition) => {
  if (condition.operator === GT) {
    return part[condition.identifier] > condition.value;
  } else {
    return part[condition.identifier] < condition.value;
  }
};

const runWorkflow = (
  part: Part,
  workflowIdentifier: string,
  workflowMap: Map<string, [...Condition[], EndCondition]>,
) => {
  if (workflowIdentifier === ACCEPT) return true;
  if (workflowIdentifier === REJECT) return false;
  const workflow = workflowMap.get(workflowIdentifier);
  for (let condition of workflow) {
    if ('destination' in condition) {
      if (condition.destination === ACCEPT) return true;
      if (condition.destination === REJECT) return false;
      else return runWorkflow(part, condition.destination, workflowMap);
    } else {
      if (evaluateCondition(part, condition))
        return runWorkflow(part, condition.result, workflowMap);
    }
  }
};

export async function day19a(dataPath?: string) {
  const [workflowsBlock, partsBlock] = (await readData(dataPath, true)).split(
    '\n\n',
  );
  const workflows = new Map<string, [...Condition[], EndCondition]>();

  workflowsBlock.split('\n').forEach((workflow) => {
    const [identifier, conditionsStr] = workflow.split('{');
    const conditions = conditionsStr.replace('}', '').split(',');
    const parsedConditions = conditions.map((condition) => {
      let newCondition: Condition | EndCondition;
      if (condition.includes(GT)) {
        const [id, valueAndResult] = condition.split(GT);
        const [value, result] = valueAndResult.split(':');
        newCondition = {
          identifier: id,
          operator: GT,
          value: Number(value),
          result,
        };
      } else if (condition.includes(LT)) {
        const [id, valueAndResult] = condition.split(LT);
        const [value, result] = valueAndResult.split(':');
        newCondition = {
          identifier: id,
          operator: LT,
          value: Number(value),
          result,
        };
      } else {
        newCondition = { destination: condition };
      }
      return newCondition;
    }) as [...Condition[], EndCondition];

    workflows.set(identifier, parsedConditions);
  });

  const parts: Part[] = partsBlock.split('\n').map((part) => {
    const [xPart, mPart, aPart, sPart] = part
      .slice(1, part.length - 1)
      .split(',');
    return {
      x: Number(xPart.split('=')[1]),
      m: Number(mPart.split('=')[1]),
      a: Number(aPart.split('=')[1]),
      s: Number(sPart.split('=')[1]),
    };
  });

  const acceptedParts = parts
    .map((part) => {
      if (runWorkflow(part, 'in', workflows)) return part;
      return null;
    })
    .filter(Boolean);

  return acceptedParts.reduce(
    (prev, { x, m, a, s }) => prev + x + m + a + s,
    0,
  );
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
