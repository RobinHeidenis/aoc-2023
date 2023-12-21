import { readData } from '../../shared.ts';
import chalk from 'chalk';
import * as console from 'console';
import { AssertionError } from 'node:assert/strict';

const ON = 1;
const OFF = 0;
const HIGH = ON;
const LOW = OFF;

const FLIPFLOP = '%';
const CONJUNCTION = '&';
const BROADCASTER = 'broadcaster';

type ModuleType = typeof FLIPFLOP | typeof CONJUNCTION | typeof BROADCASTER;
type BaseModule = { identifier: string; type: ModuleType; targets: string[] };
type State = typeof ON | typeof OFF | typeof HIGH | typeof LOW;
type Pulse = State;

interface FlipFlopModule extends BaseModule {
  type: typeof FLIPFLOP;
  state: State;
}

interface ConjunctionModule extends BaseModule {
  type: typeof CONJUNCTION;
  inputs: { module: string; previousState: State }[];
}

interface BroadcasterModule extends BaseModule {
  identifier: 'broadcaster';
  type: typeof BROADCASTER;
}

type Module = FlipFlopModule | ConjunctionModule | BroadcasterModule;

type Queue = { module: string; pulse: Pulse; sender: string }[];

const initModuleMap = (data: string[]) => {
  const moduleMap = new Map<string, Module>();

  data.forEach((line) => {
    const [fullIdentifier, targetsStr] = line.split(' -> ');
    const targets = targetsStr.trim().split(', ');
    const type = fullIdentifier.startsWith('%')
      ? FLIPFLOP
      : fullIdentifier.startsWith('&')
        ? CONJUNCTION
        : BROADCASTER;
    let module: Module;
    if (type === BROADCASTER) {
      module = {
        identifier: 'broadcaster',
        type: BROADCASTER,
        targets,
      } satisfies BroadcasterModule;
    } else if (type === FLIPFLOP) {
      module = {
        identifier: fullIdentifier.substring(1),
        type: FLIPFLOP,
        state: 0,
        targets,
      } satisfies FlipFlopModule;
    } else {
      module = {
        identifier: fullIdentifier.substring(1),
        type: CONJUNCTION,
        targets,
        inputs: [],
      } satisfies ConjunctionModule;
    }
    moduleMap.set(module.identifier, module);
  });

  Array.from(moduleMap.values()).forEach((module) => {
    module.targets.forEach((target) => {
      const targetModule = moduleMap.get(target);
      if (!targetModule) return;
      if (targetModule.type === CONJUNCTION)
        targetModule.inputs.push({
          module: module.identifier,
          previousState: OFF,
        });
    });
  });

  return moduleMap;
};

const lcm = (arr: number[]) => {
  const gcd = (x: number, y: number) => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

export async function day20a(dataPath?: string) {
  const data = await readData(dataPath);
  const moduleMap = initModuleMap(data);

  const queue: Queue = [];

  const [feed] = Array.from(moduleMap.values())
    .filter((module) => module.targets.includes('rx'))
    .map((module) => module.identifier);

  const cycleLengths: Record<string, number> = {};
  const seen: Record<string, number> = {};
  Array.from(moduleMap.values())
    .filter((module) => module.targets.includes(feed))
    .forEach((module) => (seen[module.identifier] = null));

  let presses = 0;
  while (true) {
    presses++;
    queue.push({ module: BROADCASTER, pulse: LOW, sender: 'button' });

    while (queue.length > 0) {
      const instruction = queue.shift();
      const module = moduleMap.get(instruction.module);

      if (!module) continue;

      if (module.identifier === feed && instruction.pulse === HIGH) {
        seen[instruction.sender] += 1;

        if (cycleLengths[instruction.sender] === undefined) {
          cycleLengths[instruction.sender] = presses;
        } else if (
          presses !==
          seen[instruction.sender] * cycleLengths[instruction.sender]
        )
          throw new AssertionError();

        if (Object.values(seen).every((seen) => seen > 0))
          return lcm(Object.values(cycleLengths));
      }

      switch (module.type) {
        case BROADCASTER:
          module.targets.forEach((target) =>
            queue.push({
              module: target,
              pulse: instruction.pulse,
              sender: BROADCASTER,
            }),
          );
          break;
        case FLIPFLOP:
          if (instruction.pulse === LOW) {
            module.state = module.state === ON ? OFF : ON;
            module.targets.forEach((target) =>
              queue.push({
                module: target,
                pulse: module.state,
                sender: module.identifier,
              }),
            );
          }
          break;
        case CONJUNCTION:
          const index = module.inputs.findIndex(
            (input) => input.module === instruction.sender,
          );
          module.inputs[index].previousState = instruction.pulse;
          const allInputsHaveHighPulses = module.inputs.every(
            (input) => input.previousState === HIGH,
          );
          module.targets.forEach((target) => {
            queue.push({
              module: target,
              pulse: allInputsHaveHighPulses ? LOW : HIGH,
              sender: module.identifier,
            });
          });
      }
    }
  }
}

const answer = await day20a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
