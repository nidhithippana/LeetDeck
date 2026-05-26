import type { Problem } from '../../types';

export const connectedComponents: Problem = {
  id: 'connected-components',
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 67,

  prompt: `You have a graph of \`n\` nodes labeled from \`0\` to \`n - 1\`. You are given an integer \`n\` and an array \`edges\` where \`edges[i] = [a, b]\` indicates an undirected edge between nodes \`a\` and \`b\`.

Return the number of **connected components** in the graph.`,

  examples: [
    { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2' },
    { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
  ],

  constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000'],

  languages: {
    javascript: {
      functionName: 'countComponents',
      starterCode: `function countComponents(n, edges) {

}`,
    },
    python: {
      functionName: 'count_components',
      starterCode: `def count_components(n, edges):
    pass`,
    },
    typescript: {
      functionName: 'countComponents',
      starterCode: `function countComponents(n: number, edges: number[][]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
    { input: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
    { input: [4, []], expected: 4 },
    { input: [1, []], expected: 1 },
    { input: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3 },
  ],

  solutions: [
    {
      name: 'Union-Find',
      timeComplexity: 'O((n + e) · α(n))',
      spaceComplexity: 'O(n)',
      explanation: `Initialize each node as its own component (parent[i] = i). For each edge, **union** the two endpoints' components. Count the final number of distinct roots.

Path compression (\`find\`) and union-by-size keep operations near O(1) amortized — the α is the inverse Ackermann function, effectively constant.`,
      code: {
        javascript: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let components = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      components--;
    }
  }
  return components;
}`,
        python: `def count_components(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    components = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            components -= 1
    return components`,
        typescript: `function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let components = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      components--;
    }
  }
  return components;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
  neetcodeUrl: 'https://neetcode.io/problems/count-connected-components',
};
