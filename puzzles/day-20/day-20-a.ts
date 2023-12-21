import { readData } from '../../shared.ts';
import chalk from 'chalk';

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
        moduleMap.set(targetModule.identifier, {
          ...targetModule,
          inputs: [
            ...targetModule.inputs,
            { module: module.identifier, previousState: OFF },
          ],
        });
    });
  });

  return moduleMap;
};

const runOnce = (queue: Queue, moduleMap: Map<string, Module>) => {
  let highPulses = 0;
  let lowPulses = 0;

  queue.push({ module: BROADCASTER, pulse: LOW, sender: 'button' });

  while (queue.length > 0) {
    const instruction = queue.shift();
    const module = moduleMap.get(instruction.module);

    if (instruction.pulse === HIGH) highPulses++;
    else lowPulses++;

    if (!module) continue;

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
        module.inputs[index] = {
          ...module.inputs[index],
          previousState: instruction.pulse,
        };
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

  return [highPulses, lowPulses];
};

export async function day20a(dataPath?: string) {
  const data = await readData(dataPath);
  const moduleMap = initModuleMap(data);
  let highPulses = 0;
  let lowPulses = 0;

  const queue: Queue = [];

  for (let i = 0; i < 1000; i++) {
    const [highPulsesFromRun, lowPulsesFromRun] = runOnce(queue, moduleMap);
    highPulses += highPulsesFromRun;
    lowPulses += lowPulsesFromRun;
  }

  return highPulses * lowPulses;
}

const answer = await day20a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
