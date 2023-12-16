import { readData } from '../../shared.ts';
import chalk from 'chalk';

const HORIZONTAL_SPLITTER = '-';
const VERTICAL_SPLITTER = '|';
const FORWARD_MIRROR = '/';
const BACKWARD_MIRROR = '\\';
const EMPTY_TILE = '.';

type Position = [x: number, y: number];
type Direction = { label: string; direction: Position };

const NORTH: Direction = { label: 'north', direction: [0, -1] };
const EAST: Direction = { label: 'east', direction: [1, 0] };
const SOUTH: Direction = { label: 'south', direction: [0, 1] };
const WEST: Direction = { label: 'west', direction: [-1, 0] };

const forwardMirrorDirectionMap: Record<string, Direction> = {
  north: EAST,
  east: NORTH,
  south: WEST,
  west: SOUTH,
};

const backwardMirrorDirectionMap: Record<string, Direction> = {
  north: WEST,
  east: SOUTH,
  south: EAST,
  west: NORTH,
};

const takeStep = (
  currentPosition: Position,
  direction: Direction,
  matrix: string[][],
  energizedTiles: Direction[][][],
) => {
  const [currentX, currentY] = currentPosition;
  const [directionX, directionY] = direction.direction;

  if (
    currentX < 0 ||
    currentX > matrix[0].length - 1 ||
    currentY < 0 ||
    currentY > matrix.length - 1
  )
    return false;

  const currentOperation = matrix[currentY][currentX];
  if (!currentOperation) return false;

  if (energizedTiles[currentY][currentX] === undefined)
    energizedTiles[currentY][currentX] = [];
  if (
    energizedTiles[currentY][currentX].find(
      (value) => value.label === direction.label,
    )
  )
    return false;

  energizedTiles[currentY][currentX].push(direction);

  switch (currentOperation) {
    case EMPTY_TILE:
      return takeStep(
        [currentX + directionX, currentY + directionY],
        direction,
        matrix,
        energizedTiles,
      );

    case FORWARD_MIRROR: // /
      const newForwardDirection = forwardMirrorDirectionMap[direction.label];
      const {
        direction: [newForwardDirectionX, newForwardDirectionY],
      } = newForwardDirection;
      return takeStep(
        [currentX + newForwardDirectionX, currentY + newForwardDirectionY],
        newForwardDirection,
        matrix,
        energizedTiles,
      );

    case BACKWARD_MIRROR: // \
      const newBackwardDirection = backwardMirrorDirectionMap[direction.label];
      const {
        direction: [newBackwardDirectionX, newBackwardDirectionY],
      } = newBackwardDirection;
      return takeStep(
        [currentX + newBackwardDirectionX, currentY + newBackwardDirectionY],
        newBackwardDirection,
        matrix,
        energizedTiles,
      );

    case HORIZONTAL_SPLITTER:
      if (direction.label === EAST.label || direction.label === WEST.label)
        return takeStep(
          [currentX + directionX, currentY + directionY],
          direction,
          matrix,
          energizedTiles,
        );
      const left = takeStep(
        [currentX + WEST.direction[0], currentY + WEST.direction[1]],
        WEST,
        matrix,
        energizedTiles,
      );
      const right = takeStep(
        [currentX + EAST.direction[0], currentY + EAST.direction[1]],
        EAST,
        matrix,
        energizedTiles,
      );
      return left && right;

    case VERTICAL_SPLITTER:
      if (direction.label === NORTH.label || direction.label === SOUTH.label)
        return takeStep(
          [currentX + directionX, currentY + directionY],
          direction,
          matrix,
          energizedTiles,
        );
      const up = takeStep(
        [currentX + NORTH.direction[0], currentY + NORTH.direction[1]],
        NORTH,
        matrix,
        energizedTiles,
      );
      const down = takeStep(
        [currentX + SOUTH.direction[0], currentY + SOUTH.direction[1]],
        SOUTH,
        matrix,
        energizedTiles,
      );
      return up && down;
  }
};

export async function day16a(dataPath?: string) {
  const data = (await readData(dataPath)).map((l) =>
    l.replaceAll('\r', '').split(''),
  );
  const energizedTiles: Direction[][][] = Array.from(
    { length: data.length },
    () => Array.from({ length: data[0].length - 1 }, () => []),
  );

  takeStep([0, 0], EAST, data, energizedTiles);

  return energizedTiles.reduce(
    (prev, curr) =>
      prev +
      curr.reduce((prev, curr) => (curr.length > 0 ? prev + 1 : prev), 0),
    0,
  );
}

const answer = await day16a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
