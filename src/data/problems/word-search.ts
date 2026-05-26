import type { Problem } from '../../types';

export const wordSearch: Problem = {
  id: 'word-search',
  title: 'Word Search',
  difficulty: 'Medium',
  topic: 'Backtracking',
  order: 54,

  prompt: `Given an \`m × n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. **The same letter cell may not be used more than once.**`,

  examples: [
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true' },
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
  ],

  constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of lowercase and uppercase English letters.'],

  languages: {
    javascript: {
      functionName: 'exist',
      starterCode: `function exist(board, word) {

}`,
    },
    python: {
      functionName: 'exist',
      starterCode: `def exist(board, word):
    pass`,
    },
    typescript: {
      functionName: 'exist',
      starterCode: `function exist(board: string[][], word: string): boolean {
  return false;
}`,
    },
  },

  tests: [
    {
      input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'],
      expected: true,
    },
    {
      input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'],
      expected: true,
    },
    {
      input: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'],
      expected: false,
    },
    { input: [[['a']], 'a'], expected: true },
    { input: [[['a']], 'b'], expected: false },
  ],

  solutions: [
    {
      name: 'DFS Backtracking',
      timeComplexity: 'O(m·n·4^L) where L = word length',
      spaceComplexity: 'O(L) recursion depth',
      explanation: `For each cell that matches \`word[0]\`, do DFS. At each step: if we've matched the whole word, return true. Otherwise mark the cell as visited (mutate to a placeholder), recurse into the 4 neighbors with index + 1, and restore the cell on backtrack.

Mutating-then-restoring avoids needing a separate visited set, saving allocations.`,
      code: {
        javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[i]) return false;
    board[r][c] = '#';
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = word[i];
    return found;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
        python: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False
        board[r][c] = '#'
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)
                 or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        board[r][c] = word[i]
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`,
        typescript: `function exist(board: string[][], word: string): boolean {
  const rows = board.length, cols = board[0].length;
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[i]) return false;
    board[r][c] = '#';
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = word[i];
    return found;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/word-search/',
  neetcodeUrl: 'https://neetcode.io/problems/search-for-word',
};
