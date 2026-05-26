import type { Problem } from '../../types';

export const maxDepthBinaryTree: Problem = {
  id: 'max-depth-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  difficulty: 'Easy',
  topic: 'Trees',
  order: 35,

  prompt: `Given the \`root\` of a binary tree, return its **maximum depth**.

A binary tree's maximum depth is the number of nodes along the longest path from the root down to the farthest leaf node.

A \`TreeNode\` class is provided in your environment with \`val\`, \`left\`, and \`right\` fields.`,

  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
    { input: 'root = [1,null,2]', output: '2' },
    { input: 'root = []', output: '0' },
  ],

  constraints: ['The number of nodes is in the range [0, 10^4].', '-100 <= Node.val <= 100'],

  languages: {
    javascript: {
      functionName: 'maxDepth',
      starterCode: `function maxDepth(root) {

}`,
    },
    python: {
      functionName: 'max_depth',
      starterCode: `def max_depth(root):
    pass`,
    },
    typescript: {
      functionName: 'maxDepth',
      starterCode: `function maxDepth(root: any): number {
  return 0;
}`,
    },
  },

  inputKinds: ['tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
    { input: [[1, null, 2]], expected: 2 },
    { input: [[]], expected: 0 },
    { input: [[1]], expected: 1 },
    { input: [[1, 2, null, 3, null, 4, null, 5]], expected: 5 },
  ],

  solutions: [
    {
      name: 'Recursive DFS',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) for recursion stack (h = tree height)',
      explanation: `The depth of a subtree is \`1 + max(depth(left), depth(right))\`. Base case: an empty subtree has depth 0. Pure structural recursion — one of the cleanest tree problems.`,
      code: {
        javascript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        typescript: `function maxDepth(root: any): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/depth-of-binary-tree',
};
