import type { Problem } from '../../types';

export const wordSearchII: Problem = {
  id: 'word-search-ii',
  title: 'Word Search II',
  difficulty: 'Hard',
  topic: 'Tries',
  order: 75,

  prompt: `Given an \`m × n\` grid of characters \`board\` and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells (horizontal or vertical neighbors), and the **same letter cell may not be used more than once in a word**. The same word may not appear more than once in the result.`,

  examples: [
    {
      input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
      output: '["oath","eat"]',
    },
    { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' },
  ],

  constraints: ['m == board.length, n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10'],

  languages: {
    javascript: {
      functionName: 'findWords',
      starterCode: `function findWords(board, words) {

}`,
    },
    python: {
      functionName: 'find_words',
      starterCode: `def find_words(board, words):
    pass`,
    },
    typescript: {
      functionName: 'findWords',
      starterCode: `function findWords(board: string[][], words: string[]): string[] {
  return [];
}`,
    },
  },

  tests: [
    {
      input: [
        [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']],
        ['oath', 'pea', 'eat', 'rain'],
      ],
      expected: ['oath', 'eat'],
      unordered: true,
    },
    { input: [[['a', 'b'], ['c', 'd']], ['abcb']], expected: [], unordered: true },
    { input: [[['a']], ['a']], expected: ['a'], unordered: true },
    {
      input: [[['a', 'b'], ['a', 'a']], ['aba', 'baa', 'bab', 'aaab', 'aaa', 'aaaa', 'aaba']],
      expected: ['aba', 'baa', 'aaab', 'aaa', 'aaba'],
      unordered: true,
    },
  ],

  solutions: [
    {
      name: 'Trie + DFS',
      timeComplexity: 'O(m·n·4^L)',
      spaceComplexity: 'O(sum of word lengths)',
      explanation: `Insert every word into a trie. Then DFS from each cell, walking the trie in parallel — at each step you only continue down a path if the current letter is a child in the trie. When you hit a trie node marking the end of a word, record it.

The trie prunes drastically: as soon as no word starts with the current prefix you stop. Way faster than searching each word independently.`,
      code: {
        javascript: `function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const c of w) {
      if (!node[c]) node[c] = {};
      node = node[c];
    }
    node.$ = w;
  }
  const rows = board.length, cols = board[0].length;
  const result = new Set();
  const dfs = (r, c, node) => {
    const ch = board[r][c];
    const next = node[ch];
    if (!next) return;
    if (next.$) result.add(next.$);
    board[r][c] = '#';
    if (r > 0) dfs(r - 1, c, next);
    if (r < rows - 1) dfs(r + 1, c, next);
    if (c > 0) dfs(r, c - 1, next);
    if (c < cols - 1) dfs(r, c + 1, next);
    board[r][c] = ch;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dfs(r, c, root);
  }
  return [...result];
}`,
        python: `def find_words(board, words):
    root = {}
    for w in words:
        node = root
        for c in w:
            node = node.setdefault(c, {})
        node['$'] = w
    rows, cols = len(board), len(board[0])
    result = set()
    def dfs(r, c, node):
        ch = board[r][c]
        nxt = node.get(ch)
        if not nxt:
            return
        if '$' in nxt:
            result.add(nxt['$'])
        board[r][c] = '#'
        if r > 0: dfs(r - 1, c, nxt)
        if r < rows - 1: dfs(r + 1, c, nxt)
        if c > 0: dfs(r, c - 1, nxt)
        if c < cols - 1: dfs(r, c + 1, nxt)
        board[r][c] = ch
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return list(result)`,
        typescript: `function findWords(board: string[][], words: string[]): string[] {
  const root: any = {};
  for (const w of words) {
    let node = root;
    for (const c of w) {
      if (!node[c]) node[c] = {};
      node = node[c];
    }
    node.$ = w;
  }
  const rows = board.length, cols = board[0].length;
  const result = new Set<string>();
  const dfs = (r: number, c: number, node: any): void => {
    const ch = board[r][c];
    const next = node[ch];
    if (!next) return;
    if (next.$) result.add(next.$);
    board[r][c] = '#';
    if (r > 0) dfs(r - 1, c, next);
    if (r < rows - 1) dfs(r + 1, c, next);
    if (c > 0) dfs(r, c - 1, next);
    if (c < cols - 1) dfs(r, c + 1, next);
    board[r][c] = ch;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dfs(r, c, root);
  }
  return [...result];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/',
  neetcodeUrl: 'https://neetcode.io/problems/search-for-word-ii',
};
