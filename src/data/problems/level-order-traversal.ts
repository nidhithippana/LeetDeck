import type { Problem } from '../../types';

export const levelOrderTraversal: Problem = {
  id: 'level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  difficulty: 'Medium',
  topic: 'Trees',
  order: 39,

  prompt: `Given the \`root\` of a binary tree, return the **level order traversal** of its nodes' values — values grouped by level, from top to bottom, left to right within each level.`,

  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    { input: 'root = [1]', output: '[[1]]' },
    { input: 'root = []', output: '[]' },
  ],

  constraints: ['The number of nodes is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],

  languages: {
    javascript: {
      functionName: 'levelOrder',
      starterCode: `function levelOrder(root) {

}`,
    },
    python: {
      functionName: 'level_order',
      starterCode: `def level_order(root):
    pass`,
    },
    typescript: {
      functionName: 'levelOrder',
      starterCode: `function levelOrder(root: any): number[][] {
  return [];
}`,
    },
  },

  inputKinds: ['tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
    { input: [[1]], expected: [[1]] },
    { input: [[]], expected: [] },
    { input: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1], [2, 3], [4, 5, 6, 7]] },
    { input: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] },
  ],

  solutions: [
    {
      name: 'BFS with Per-Level Batches',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Standard breadth-first traversal: use a queue. At the start of each iteration, grab the current queue size — that's the number of nodes on the current level. Process exactly that many before moving on, capturing their values in a level-specific array.`,
      code: {
        javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
        python: `def level_order(root):
    if not root:
        return []
    from collections import deque
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
        typescript: `function levelOrder(root: any): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: any[] = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
  neetcodeUrl: 'https://neetcode.io/problems/level-order-traversal-of-binary-tree',
};
