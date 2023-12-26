import { readData } from '../../shared.ts';
import chalk from 'chalk';

const findGroups = (
  vertexCount: number,
  edges: [number, number][],
  desiredCuts: number,
) => {
  for (let i = 0; i < edges.length; ++i) {
    const idx = Math.floor(Math.random() * (i + 1));
    [edges[i], edges[idx]] = [edges[idx], edges[i]];
  }

  const groupParents = [-1];
  const vertexGroups = new Uint16Array(vertexCount);
  const groupPromotions = [-1];

  const findParent = (v: number) => {
    // Find the parent of a group
    if (vertexGroups[v] === 0) {
      return -1;
    }

    let group = vertexGroups[v];
    while (group !== groupParents[group]) {
      group = groupParents[group];
    }

    return group;
  };

  const isUnion = (v1: number, v2: number) => {
    if (!vertexGroups[v1] && !vertexGroups[v2]) {
      // Union operation implementation for new groups
      const group = groupParents.length;
      groupParents.push(group);
      groupPromotions.push(1);
      vertexGroups[v1] = group;
      vertexGroups[v2] = group;
    } else if (!vertexGroups[v1]) {
      // Union operation implementation when v1 is not in a group
      const g = (vertexGroups[v2] = findParent(v2));
      ++groupPromotions[g];
      vertexGroups[v1] = g;
    } else if (!vertexGroups[v2]) {
      // Union operation implementation when v2 is not in a group
      const g = (vertexGroups[v1] = findParent(v1));
      ++groupPromotions[g];
      vertexGroups[v2] = g;
    } else {
      // Union operation implementation for merging existing groups
      let g1 = findParent(v1);
      let g2 = findParent(v2);

      if (g1 !== g2) {
        if (groupPromotions[g1] > groupPromotions[g2]) {
          [g2, g1] = [g1, g2];
        }

        groupPromotions[g2] += groupPromotions[g1] + 1;
        groupParents[g1] = g2;
        vertexGroups[v1] = g2;
        vertexGroups[v2] = g2;
      } else {
        return false;
      }
    }

    return true;
  };

  let edgeIdx = 0;
  while (vertexCount > 2) {
    const [v1, v2] = edges[edgeIdx++];

    if (isUnion(v1, v2)) {
      --vertexCount;
    }
  }

  let removedEdges = 0;
  for (const [v1, v2] of edges) {
    if (
      (vertexGroups[v1] = findParent(v1)) !==
      (vertexGroups[v2] = findParent(v2))
    ) {
      ++removedEdges;
    }
  }

  return removedEdges === desiredCuts ? vertexGroups : null;
};

export async function day25a(dataPath?: string) {
  const data = await readData(dataPath);
  const edges: [number, number][] = [];
  const vToId = new Map<string, number>();

  for (const line of data) {
    const [identifier, connectionsString] = line.split(': ');

    if (!vToId.has(identifier)) {
      vToId.set(identifier, vToId.size);
    }

    for (const connection of connectionsString.split(' ')) {
      if (!vToId.has(connection)) {
        vToId.set(connection, vToId.size);
      }

      edges.push([vToId.get(identifier), vToId.get(connection)]);
    }
  }

  while (true) {
    const groups = findGroups(vToId.size, edges, 3);

    if (groups !== null) {
      const group1Count = groups.filter((x) => x === groups[0]).length;
      return group1Count * (vToId.size - group1Count);
    }
  }
}

const answer = await day25a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
