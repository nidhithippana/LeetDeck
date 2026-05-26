import type { Problem } from '../../types';

export const invertBinaryTree: Problem = {
  id: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  difficulty: 'Easy',
  topic: 'Trees',
  order: 37,

  prompt: `Given the \`root\` of a binary tree, **invert** the tree (mirror it left-to-right), and return its root.`,

  examples: [
    { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
    { input: 'root = [2,1,3]', output: '[2,3,1]' },
    { input: 'root = []', output: '[]' },
  ],

  constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],

  languages: {
    javascript: {
      functionName: 'invertTree',
      starterCode: `function invertTree(root) {

}`,
    },
    python: {
      functionName: 'invert_tree',
      starterCode: `def invert_tree(root):
    pass`,
    },
    typescript: {
      functionName: 'invertTree',
      starterCode: `function invertTree(root: any): any {
  return null;
}`,
    },
  },

  inputKinds: ['tree'],
  outputKind: 'tree',

  tests: [
    { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
    { input: [[2, 1, 3]], expected: [2, 3, 1] },
    { input: [[]], expected: [] },
    { input: [[1]], expected: [1] },
    { input: [[1, 2]], expected: [1, null, 2] },
  ],

  solutions: [
    {
      name: 'Recursive Swap',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      explanation: `For each node: swap its children, then recurse into both. The whole tree is mirrored when you're done. Can also be done iteratively with a queue/stack, but recursion is the shortest correct version.`,
      code: {
        javascript: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
        python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invert_tree(root.left)
    invert_tree(root.right)
    return root`,
        typescript: `function invertTree(root: any): any {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/invert-a-binary-tree',
};
