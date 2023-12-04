<div align="center">
    <a href="https://adventofcode.com">
        <img src="public/logo.png" alt="Logo" width="80" height="80">
    </a>
    <h1>Advent of Code 2023</h1>
    <p><b><i>My solutions for Advent of Code 2023</i></b></p>
    <p><i>Now neatly organized!</i></p>

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![NX](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)](https://nx.dev)

</div>

## Created with ts-aoc-starter

For this year I chose to use a starter to organize the code.
I used [ts-aoc-starter](https://github.com/nrwl/ts-aoc-starter)

The repository is organized per day. Every day has a separate folder. The folder structure is outlined below.

```file-tree
ts-aoc-starter
├── puzzles
│   ├── day-1
│   │   ├── day-1-a.data.txt
│   │   ├── day-1-a.sample-data.txt
│   │   ├── day-1-a.ts
│   │   ├── day-1-b.data.txt
│   │   ├── day-1-b.sample-data.txt
│   │   └── day-1-b.ts
│   ├── day-2
│   ├── day-3
```

Sample input for the day is placed in the `day-[x]-[part].sample-data.txt`. Actual input is placed in `day-[x]-[part].data.txt`.
The NX template takes care of loading the proper data file.

> [!WARN]
> Because AOC input is copyrighted, you'll have to provide your own input. The input files are not provided in this repository.
> You'll have to create your own `day-[x]-[part].sample-data.txt` and `day-[x]-[part].data.txt` files.

The code can then be written in `day-[x]-[part].ts` files.

### Running a puzzle

To run a puzzle with sample data, one of the following commands can be run:

```bash
pnpm day-1-a:sample
```

or

```bash
nx day-1-a --data=sample
```

To run the solution against the actual data set, run the following command:

```bash
pnpm day-1-a
```

or

```bash
nx day-1-a
```
