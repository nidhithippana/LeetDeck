import type { Problem } from '../../types';

export const maxPathSum: Problem = {
  id: 'max-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  difficulty: 'Hard',
  topic: 'Trees',
  order: 60,

  prompt: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has a parent-child connection. A node can appear at most once in the sequence, and the path **does not need to pass through the root**.

The **path sum** is the sum of the node values in the path.

Given the \`root\` of a binary tree, return the **maximum path sum** of any non-empty path.`,

  examples: [
    { input: 'root = [1,2,3]', output: '6', explanation: '2 → 1 → 3.' },
    { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: '15 → 20 → 7.' },
  ],

  constraints: ['The number of nodes is in the range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],

  languages: {
    javascript: {
      functionName: 'maxPathSum',
      starterCode: `function maxPathSum(root) {

}`,
    },
    python: {
      functionName: 'max_path_sum',
      starterCode: `def max_path_sum(root):
    pass`,
    },
    typescript: {
      functionName: 'maxPathSum',
      starterCode: `function maxPathSum(root: any): number {
  return 0;
}`,
    },
  },

  inputKinds: ['tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[1, 2, 3]], expected: 6 },
    { input: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
    { input: [[-3]], expected: -3 },
    { input: [[2, -1]], expected: 2 },
    { input: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 },
  ],

  solutions: [
    {
      name: 'Post-order DFS with Gain-Through',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) recursion stack',
      explanation: `For each node, compute the **max gain** that can be extended **through** that node from one of its children (the path going up through it must use at most one child arm — otherwise it can't continue upward).

But the **best path including this node** can use **both** children (if positive). Track that separately as the running global max.

Negative gains get clamped to 0 — we'd rather not include that subtree at all.`,
      code: {
        javascript: `function maxPathSum(root) {
  let best = -Infinity;
  const gain = (node) => {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}`,
        python: `def max_path_sum(root):
    best = [float('-inf')]
    def gain(node):
        if not node:
            return 0
        left = max(0, gain(node.left))
        right = max(0, gain(node.right))
        best[0] = max(best[0], node.val + left + right)
        return node.val + max(left, right)
    gain(root)
    return best[0]`,
        typescript: `function maxPathSum(root: any): number {
  let best = -Infinity;
  const gain = (node: any): number => {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
  neetcodeUrl: 'https://neetcode.io/problems/binary-tree-maximum-path-sum',
};
