import type { Problem } from '../../types';

export const pacificAtlantic: Problem = {
  id: 'pacific-atlantic',
  title: 'Pacific Atlantic Water Flow',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 50,

  prompt: `There is an \`m × n\` rectangular island that borders both the **Pacific Ocean** (top and left edges) and the **Atlantic Ocean** (bottom and right edges). You are given an \`m × n\` integer matrix \`heights\` where \`heights[r][c]\` is the height above sea level of the cell at coordinate \`(r, c)\`.

Rain water can flow from a cell to a neighboring cell (up, down, left, right) if the neighbor's height is **less than or equal** to the current cell's height. Water can flow off the island from any edge cell into the adjacent ocean.

Return a list of grid coordinates \`[r, c]\` where rainwater can flow to **both** oceans.

The order of the result doesn't matter.`,

  examples: [
    {
      input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
    },
    { input: 'heights = [[1]]', output: '[[0,0]]', explanation: 'A single cell touches both oceans.' },
  ],

  constraints: ['1 <= m, n <= 200', '0 <= heights[r][c] <= 10^5'],

  languages: {
    javascript: {
      functionName: 'pacificAtlantic',
      starterCode: `function pacificAtlantic(heights) {

}`,
    },
    python: {
      functionName: 'pacific_atlantic',
      starterCode: `def pacific_atlantic(heights):
    pass`,
    },
    typescript: {
      functionName: 'pacificAtlantic',
      starterCode: `function pacificAtlantic(heights: number[][]): number[][] {
  return [];
}`,
    },
  },

  tests: [
    {
      input: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]],
      expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
      unordered: true,
    },
    { input: [[[1]]], expected: [[0, 0]], unordered: true },
    {
      input: [[[2, 1], [1, 2]]],
      expected: [[0, 0], [0, 1], [1, 0], [1, 1]],
      unordered: true,
    },
  ],

  solutions: [
    {
      name: 'Reverse Flow: DFS from each ocean',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      explanation: `Instead of starting from each cell and asking "can it reach both oceans?", start from each ocean and DFS **backwards** — only moving to neighbors with height **≥** the current height. This gives you two sets: cells reachable from the Pacific, cells reachable from the Atlantic. The answer is their intersection.`,
      code: {
        javascript: `function pacificAtlantic(heights) {
  if (!heights.length || !heights[0].length) return [];
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atl = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dfs = (r, c, ocean, prevHeight) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (ocean[r][c]) return;
    if (heights[r][c] < prevHeight) return;
    ocean[r][c] = true;
    dfs(r + 1, c, ocean, heights[r][c]);
    dfs(r - 1, c, ocean, heights[r][c]);
    dfs(r, c + 1, ocean, heights[r][c]);
    dfs(r, c - 1, ocean, heights[r][c]);
  };
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(rows - 1, c, atl, heights[rows - 1][c]);
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, cols - 1, atl, heights[r][cols - 1]);
  }
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) result.push([r, c]);
    }
  }
  return result;
}`,
        python: `def pacific_atlantic(heights):
    if not heights or not heights[0]:
        return []
    rows, cols = len(heights), len(heights[0])
    pac = [[False] * cols for _ in range(rows)]
    atl = [[False] * cols for _ in range(rows)]
    def dfs(r, c, ocean, prev_h):
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return
        if ocean[r][c]:
            return
        if heights[r][c] < prev_h:
            return
        ocean[r][c] = True
        dfs(r + 1, c, ocean, heights[r][c])
        dfs(r - 1, c, ocean, heights[r][c])
        dfs(r, c + 1, ocean, heights[r][c])
        dfs(r, c - 1, ocean, heights[r][c])
    for c in range(cols):
        dfs(0, c, pac, heights[0][c])
        dfs(rows - 1, c, atl, heights[rows - 1][c])
    for r in range(rows):
        dfs(r, 0, pac, heights[r][0])
        dfs(r, cols - 1, atl, heights[r][cols - 1])
    return [[r, c] for r in range(rows) for c in range(cols) if pac[r][c] and atl[r][c]]`,
        typescript: `function pacificAtlantic(heights: number[][]): number[][] {
  if (!heights.length || !heights[0].length) return [];
  const rows = heights.length, cols = heights[0].length;
  const pac: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atl: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dfs = (r: number, c: number, ocean: boolean[][], prevHeight: number): void => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (ocean[r][c]) return;
    if (heights[r][c] < prevHeight) return;
    ocean[r][c] = true;
    dfs(r + 1, c, ocean, heights[r][c]);
    dfs(r - 1, c, ocean, heights[r][c]);
    dfs(r, c + 1, ocean, heights[r][c]);
    dfs(r, c - 1, ocean, heights[r][c]);
  };
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(rows - 1, c, atl, heights[rows - 1][c]);
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, cols - 1, atl, heights[r][cols - 1]);
  }
  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) result.push([r, c]);
    }
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
  neetcodeUrl: 'https://neetcode.io/problems/pacific-atlantic-water-flow',
};
