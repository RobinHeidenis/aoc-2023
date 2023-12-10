import { readData } from '../../shared.js';
import chalk from 'chalk';

// YOINKED CODE (DOES WORK I THINK????)
// STOLEN FROM: https://github.com/delventhalz/advent-of-code-2023/blob/main/10-pipe-maze/2.js

type Coordinate = [x: number, y: number];
type Matrix = string[][];
type EachFunction = (
  tile: string,
  coordinate: Coordinate,
  matrix: Matrix,
) => void;

const PIPE_CONNECTIONS = {
  '|': [
    [0, 1],
    [0, -1],
  ],
  '-': [
    [1, 0],
    [-1, 0],
  ],
  L: [
    [0, -1],
    [1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  '7': [
    [0, 1],
    [-1, 0],
  ],
  F: [
    [0, 1],
    [1, 0],
  ],
} satisfies Record<string, Coordinate[]>;

export const eachMatrix = (matrix: Matrix, eachFn: EachFunction) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      eachFn(matrix[y][x], [x, y], matrix);
    }
  }
};

export const eachAdjacent = (
  matrix: Matrix,
  [x, y]: Coordinate,
  eachFn: EachFunction,
) => {
  callAtCoords(matrix, [x, y - 1], eachFn);
  callAtCoords(matrix, [x + 1, y], eachFn);
  callAtCoords(matrix, [x, y + 1], eachFn);
  callAtCoords(matrix, [x - 1, y], eachFn);
};

export const hasProp = (val: unknown, prop: string | number): boolean => {
  const { hasOwnProperty } = Object.prototype;
  if (val == null) {
    return false;
  }

  return hasOwnProperty.call(val, prop);
};

export const callAtCoords = (
  matrix: Matrix,
  coords: Coordinate,
  callFn: EachFunction,
) => {
  const [x, y] = coords;

  if (hasProp(matrix, y) && hasProp(matrix[y], x)) {
    callFn(matrix[y][x], coords, matrix);
  }
};

function last<TArray extends Array<unknown>>(array: TArray): TArray[number] {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

const isSameLocation = ([x1, y1]: Coordinate, [x2, y2]: Coordinate) => {
  return x1 === x2 && y1 === y2;
};

const sumCoords = ([x1, y1]: Coordinate, [x2, y2]: Coordinate) => {
  return [x1 + x2, y1 + y2];
};

// Get the connected coordinates to a particular tile
const getConnections = (map: Matrix, [x, y]: Coordinate) => {
  const tile = map[y][x] as keyof typeof PIPE_CONNECTIONS;
  const relativeConnections = PIPE_CONNECTIONS[tile];

  if (!relativeConnections) {
    return [];
  }

  return relativeConnections.map(
    (diff: Coordinate) => sumCoords([x, y], diff) as Coordinate,
  );
};

// Get the next connected coordinates in a part
const getNext = (map: Matrix, coords: Coordinate, lastCoords: Coordinate) => {
  return getConnections(map, coords).find(
    (conn) => !isSameLocation(conn, lastCoords),
  );
};

// Create a new map with additional rows and columns added between each existing
// row and column. Each new cell will either be a "x", indicating empty space,
// or be a "|" or "-" to indicate a connection with pipes from the original rows
// and columns.
const expandMap = (map: Matrix) => {
  // The original rows of the map with expanded cells between each item
  const expandedRows = [];

  for (let y = 0; y < map.length; y += 1) {
    expandedRows.push([]);

    for (let x = 1; x < map[y].length; x += 1) {
      const left = map[y][x - 1];
      const right = map[y][x];

      last(expandedRows).push(left);

      if (['-', 'F', 'L'].includes(left) && ['-', '7', 'J'].includes(right)) {
        last(expandedRows).push('-');
      } else {
        last(expandedRows).push('x');
      }
    }
    last(expandedRows).push(map[y][map[y].length - 1]);
  }

  // The fully expanded map, including new rows made entirely of expanded cells
  const expanded: string[][] = [];

  for (let y = 1; y < expandedRows.length; y += 1) {
    expanded.push(expandedRows[y - 1]);
    expanded.push([]);

    for (let x = 0; x < expandedRows[y].length; x += 1) {
      const top = expandedRows[y - 1][x];
      const bottom = expandedRows[y][x];

      if (['|', 'F', '7'].includes(top) && ['|', 'L', 'J'].includes(bottom)) {
        last(expanded).push('|');
      } else {
        last(expanded).push('x');
      }
    }
  }

  expanded.push(last(expandedRows));
  return expanded;
};

// Find the coordinates of a spot along the border that is empty
const findOutside = (map: Matrix) => {
  const lastCol = map[0].length - 1;
  const lastRow = map.length - 1;

  for (let x = 0; x <= lastCol; x += 1) {
    if (map[0][x] === '.' || map[0][x] === 'x') {
      return [x, 0];
    }
    if (map[lastRow][x] === '.' || map[lastRow][x] === 'x') {
      return [x, lastRow];
    }
  }

  for (let y = 0; y <= lastRow; y += 1) {
    if (map[y][0] === '.' || map[y][0] === 'x') {
      return [0, y];
    }
    if (map[y][lastCol] === '.' || map[y][lastCol] === 'x') {
      return [lastCol, y];
    }
  }
};

// Aimple "flood" algorithm to mark every tile connected to outside with "X"
const markOutside = (map: Matrix) => {
  const locations = [findOutside(map)];

  while (locations.length > 0) {
    const [x, y] = locations.pop();

    if (map[y][x] === '.' || map[y][x] == 'x') {
      map[y][x] = 'X';
      eachAdjacent(map, [x, y], (_, coords) => locations.push(coords));
    }
  }
};

export const findCoords = (
  matrix: Matrix,
  predicate: (tile: string, coordinate: Coordinate, matrix: Matrix) => boolean,
): Coordinate => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (predicate(matrix[y][x], [x, y], matrix)) {
        return [x, y];
      }
    }
  }

  return [-1, -1];
};

export const coordsOf = (matrix: Matrix, item: string) => {
  return findCoords(matrix, (val) => val === item);
};

function main(data: Matrix) {
  const start = coordsOf(data, 'S');
  const startConnections = [];

  // Find the two tiles which connect to the start
  eachAdjacent(data, start, (tile, coords) => {
    const [connA, connB] = getConnections(data, coords);

    const isConnectedToStart =
      (connA && isSameLocation(start, connA)) ||
      (connB && isSameLocation(start, connB));

    if (isConnectedToStart) {
      startConnections.push(coords);
    }
  });

  // Walk the loop and mark each section of pipe as an "X" on our map
  const map = data.map((line) => [...line]);
  let [loc] = startConnections;
  let last = start;

  while (data[loc[1]][loc[0]] !== 'S') {
    map[loc[1]][loc[0]] = 'X';
    const next = getNext(data, loc, last);
    last = loc;
    loc = next;
  }

  map[start[1]][start[0]] = 'X';

  // Mark everything that is not in our pipe with a "."
  eachMatrix(map, (tile, [x, y]) => {
    if (tile !== 'X') {
      map[y][x] = '.';
    }
  });

  // Put the original pipe tiles back
  eachMatrix(map, (tile, [x, y]) => {
    if (tile === 'X') {
      map[y][x] = data[y][x];
    }
  });

  // Replace "S" with correct pipe
  const startPipe = Object.entries(PIPE_CONNECTIONS)
    .map(([pipe, connections]) => {
      return [pipe, connections.map((diff) => sumCoords(diff, start))] as [
        string,
        Coordinate[],
      ];
    })
    .filter(([_, locations]) => {
      return locations.every((loc) =>
        startConnections.some((conn) => isSameLocation(loc, conn)),
      );
    })
    .map(([pipe]) => pipe)[0];

  map[start[1]][start[0]] = startPipe;

  // Expand the map and then mark all outside tiles
  const expanded = expandMap(map);
  markOutside(expanded);

  // Count the remaining "." tiles, which will correspond to spots in the
  // original matrix which were inside the pipe maze
  let count = 0;

  eachMatrix(expanded, (tile) => {
    if (tile === '.') {
      count += 1;
    }
  });

  return count;
}

// @ts-expect-error I do not know why so I'm gonna leave it like this
console.log(main(await readData()));

// MY CODE: (DOES NOT WORK!!!!!)
const pipes = {
  F: 'F',
  '7': '7',
  L: 'L',
  J: 'J',
  '-': '-',
  '|': '|',
  S: 'S',
  '.': '.',
} as const;

const directions = {
  above: { x: 0, y: -1 },
  below: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
} as const;

const { above, below, left, right } = directions;

const allowedNextPipes: Record<
  keyof typeof pipes,
  {
    direction: (typeof directions)[keyof typeof directions];
    disallowed: (keyof typeof pipes)[];
  }[]
> = {
  F: [
    { direction: right, disallowed: [pipes.F, pipes.L, pipes['|']] },
    { direction: below, disallowed: [pipes.F, pipes['7'], pipes['-']] },
  ],
  '7': [
    { direction: left, disallowed: [pipes['7'], pipes.J, pipes['|']] },
    { direction: below, disallowed: [pipes['7'], pipes.F, pipes['-']] },
  ],
  L: [
    { direction: right, disallowed: [pipes.L, pipes.F, pipes['|']] },
    { direction: above, disallowed: [pipes.L, pipes.J, pipes['-']] },
  ],
  J: [
    { direction: left, disallowed: [pipes.J, pipes['7'], pipes['|']] },
    { direction: above, disallowed: [pipes.J, pipes['L'], pipes['-']] },
  ],
  '-': [
    { direction: right, disallowed: [pipes['|'], pipes.F, pipes.L] },
    { direction: left, disallowed: [pipes['|'], pipes.J, pipes['7']] },
  ],
  '|': [
    { direction: above, disallowed: [pipes['-'], pipes.L, pipes.J] },
    { direction: below, disallowed: [pipes['-'], pipes.F, pipes['7']] },
  ],
  S: [
    { direction: above, disallowed: [pipes['.']] },
    { direction: below, disallowed: [pipes['.']] },
    { direction: left, disallowed: [pipes['.']] },
    { direction: right, disallowed: [pipes['.']] },
  ],
  '.': [],
};

export async function day10b(dataPath?: string) {
  const data = (await readData(dataPath)).map((l) => l.split(''));

  let startX: number;
  let startY: number;

  let mainLoop = data.map((line) => line.map((_) => '.'));

  startY = data.findIndex((l) => {
    const SIndex = l.findIndex((u) => u === 'S');
    if (SIndex === -1) return false;
    startX = SIndex;
    return true;
  });

  let done = false;
  let currentX = startX;
  let currentY = startY;
  let previousDirection = { x: startX, y: startY };
  let steps = 0;
  while (!done) {
    const pipe = data[currentY][currentX] as keyof typeof pipes;
    const checkDirections = allowedNextPipes[pipe];
    steps++;
    mainLoop[currentY][currentX] = pipe;
    for (const dir of checkDirections) {
      const {
        direction: { x, y },
        disallowed,
      } = dir;
      if (x === previousDirection.x && y === previousDirection.y) continue;
      const pipeAtLocation = data[currentY + y]?.[
        currentX + x
      ] as keyof typeof pipes;
      if (
        pipeAtLocation === undefined ||
        disallowed.includes(pipeAtLocation) ||
        pipeAtLocation === '.'
      )
        continue;
      if (pipeAtLocation === 'S') {
        done = true;
        continue;
      }
      currentY = currentY + y;
      currentX = currentX + x;
      previousDirection = { x: x === 0 ? 0 : -x, y: y === 0 ? 0 : -y };
      break;
    }
  }

  console.table(mainLoop);

  let insideLoop = false;
  let count = 0;
  for (let y = 0; y < mainLoop.length; y++) {
    const line = mainLoop[y];
    for (let x = 0; x < line.length; x++) {
      if (mainLoop[y][x] === '|') insideLoop = !insideLoop;
      if (mainLoop[y][x] === 'F' || mainLoop[y][x] === 'L') insideLoop = true;
      if (mainLoop[y][x] === 'J' || mainLoop[y][x] === '7') insideLoop = false;
      if (mainLoop[y][x] === '.' && insideLoop) count++;
    }
  }
  return count;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
