import type { Problem } from '../../types';

export const numberOfIslands: Problem = {
  id: 'number-of-islands',
  title: 'Number of Islands',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 47,

  prompt: `Given an \`m × n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the **number of islands**.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.`,

  examples: [
    {
      input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
      output: '1',
    },
    {
      input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
      output: '3',
    },
  ],

  constraints: ['m == grid.length, n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1".'],

  languages: {
    javascript: {
      functionName: 'numIslands',
      starterCode: `function numIslands(grid) {

}`,
    },
    python: {
      functionName: 'num_islands',
      starterCode: `def num_islands(grid):
    pass`,
    },
    typescript: {
      functionName: 'numIslands',
      starterCode: `function numIslands(grid: string[][]): number {
  return 0;
}`,
    },
  },

  tests: [
    {
      input: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]],
      expected: 1,
    },
    {
      input: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]],
      expected: 3,
    },
    { input: [[['1']]], expected: 1 },
    { input: [[['0']]], expected: 0 },
    {
      input: [[['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]],
      expected: 5,
    },
  ],

  solutions: [
    {
      name: 'DFS Flood Fill',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n) worst-case for the call stack',
      explanation: `Walk every cell. When you find a \`'1'\`, that's a new island — bump the counter and flood-fill from that cell (DFS), marking every connected \`'1'\` as visited (we mutate to \`'0'\`). Each cell is visited at most once total.`,
      code: {
        javascript: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
        python: `def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
        typescript: `function numIslands(grid: string[][]): number {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const dfs = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
  neetcodeUrl: 'https://neetcode.io/problems/count-number-of-islands',
};
