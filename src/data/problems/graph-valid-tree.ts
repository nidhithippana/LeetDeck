import type { Problem } from '../../types';

export const graphValidTree: Problem = {
  id: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 66,

  prompt: `Given \`n\` nodes labeled from \`0\` to \`n - 1\` and a list of undirected \`edges\` (each edge is a pair \`[a, b]\`), determine whether these edges make up a **valid tree**.

A valid tree has:
1. Exactly \`n - 1\` edges
2. Is fully connected
3. Has no cycles`,

  examples: [
    { input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', output: 'true' },
    { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]', output: 'false', explanation: 'Contains a cycle [1,2,3,1].' },
  ],

  constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000', 'No duplicate edges, no self-loops.'],

  languages: {
    javascript: {
      functionName: 'validTree',
      starterCode: `function validTree(n, edges) {

}`,
    },
    python: {
      functionName: 'valid_tree',
      starterCode: `def valid_tree(n, edges):
    pass`,
    },
    typescript: {
      functionName: 'validTree',
      starterCode: `function validTree(n: number, edges: number[][]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true },
    { input: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expected: false },
    { input: [1, []], expected: true },
    { input: [2, []], expected: false },
    { input: [4, [[0, 1], [2, 3]]], expected: false },
  ],

  solutions: [
    {
      name: 'DFS with Parent Tracking',
      timeComplexity: 'O(n + e)',
      spaceComplexity: 'O(n + e)',
      explanation: `A tree on \`n\` nodes has **exactly \`n - 1\` edges**. If the edge count doesn't match, return false immediately. Otherwise, do a DFS from node 0 and confirm:
1. No cycles encountered (we revisit a non-parent node)
2. All \`n\` nodes are reached (fully connected)`,
      code: {
        javascript: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Set();
  const dfs = (node, parent) => {
    if (visited.has(node)) return false;
    visited.add(node);
    for (const next of graph[node]) {
      if (next === parent) continue;
      if (!dfs(next, node)) return false;
    }
    return true;
  };
  return dfs(0, -1) && visited.size === n;
}`,
        python: `def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)
    visited = set()
    def dfs(node, parent):
        if node in visited:
            return False
        visited.add(node)
        for nxt in graph[node]:
            if nxt == parent:
                continue
            if not dfs(nxt, node):
                return False
        return True
    return dfs(0, -1) and len(visited) == n`,
        typescript: `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Set<number>();
  const dfs = (node: number, parent: number): boolean => {
    if (visited.has(node)) return false;
    visited.add(node);
    for (const next of graph[node]) {
      if (next === parent) continue;
      if (!dfs(next, node)) return false;
    }
    return true;
  };
  return dfs(0, -1) && visited.size === n;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/valid-tree',
};
