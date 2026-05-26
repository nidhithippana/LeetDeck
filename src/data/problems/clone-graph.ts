import type { Problem } from '../../types';

export const cloneGraph: Problem = {
  id: 'clone-graph',
  title: 'Clone Graph',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 48,

  prompt: `Given a reference of a node in a **connected undirected graph**, return a deep copy (clone) of the graph.

Each node in the graph has a value (\`val\`) and a list of its neighbors (\`neighbors\`). A \`GraphNode\` class is provided in your environment.

**Test format:** input is an adjacency list where \`adjList[i]\` is the list of neighbor values for the node with \`val = i + 1\`. Your function receives the head node; return your cloned head node.`,

  examples: [
    { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]', explanation: 'A 4-node cycle 1-2-3-4-1.' },
    { input: 'adjList = [[]]', output: '[[]]', explanation: 'A single isolated node with no neighbors.' },
    { input: 'adjList = []', output: '[]', explanation: 'Empty graph — null input.' },
  ],

  constraints: ['The graph is connected.', 'Number of nodes is in [0, 100].', '1 <= Node.val <= 100'],

  languages: {
    javascript: {
      functionName: 'cloneGraph',
      starterCode: `function cloneGraph(node) {

}`,
    },
    python: {
      functionName: 'clone_graph',
      starterCode: `def clone_graph(node):
    pass`,
    },
    typescript: {
      functionName: 'cloneGraph',
      starterCode: `function cloneGraph(node: any): any {
  return null;
}`,
    },
  },

  inputKinds: ['graph'],
  outputKind: 'graph',

  tests: [
    { input: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
    { input: [[[]]], expected: [[]] },
    { input: [[]], expected: [] },
    { input: [[[2], [1]]], expected: [[2], [1]] },
  ],

  solutions: [
    {
      name: 'DFS with Hash Map',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      explanation: `Walk the graph DFS, keeping a map from **original node → cloned node**. For each original you visit, create its clone (if not already cloned), then recurse on each neighbor and push the cloned neighbor into the clone's neighbor list.

The hash map is what prevents infinite loops on cycles — if you've already cloned a node, return its existing clone.`,
      code: {
        javascript: `function cloneGraph(node) {
  if (!node) return null;
  const cloned = new Map();
  const dfs = (orig) => {
    if (cloned.has(orig)) return cloned.get(orig);
    const copy = new GraphNode(orig.val);
    cloned.set(orig, copy);
    for (const n of orig.neighbors) copy.neighbors.push(dfs(n));
    return copy;
  };
  return dfs(node);
}`,
        python: `def clone_graph(node):
    if not node:
        return None
    cloned = {}
    def dfs(orig):
        if id(orig) in cloned:
            return cloned[id(orig)]
        copy = GraphNode(orig.val)
        cloned[id(orig)] = copy
        for n in orig.neighbors:
            copy.neighbors.append(dfs(n))
        return copy
    return dfs(node)`,
        typescript: `function cloneGraph(node: any): any {
  if (!node) return null;
  const cloned = new Map<any, any>();
  const GN = (globalThis as any).GraphNode;
  const dfs = (orig: any): any => {
    if (cloned.has(orig)) return cloned.get(orig);
    const copy = new GN(orig.val);
    cloned.set(orig, copy);
    for (const n of orig.neighbors) copy.neighbors.push(dfs(n));
    return copy;
  };
  return dfs(node);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/clone-graph/',
  neetcodeUrl: 'https://neetcode.io/problems/clone-graph',
};
