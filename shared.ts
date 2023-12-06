import { readFile } from 'fs/promises';

export async function readData(
  path: string,
  notSplit: false,
): Promise<string[]>;
export async function readData(path: string, notSplit: true): Promise<string>;
export async function readData(
  path?: string,
  notSplit?: boolean,
): Promise<string[]>;
export async function readData(
  path?: string,
  notSplit?: boolean,
): Promise<string | string[]> {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString();
  if (notSplit) return data;

  return data.split('\n');
}
