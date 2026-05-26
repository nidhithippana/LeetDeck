import type { Problem } from '../../types';

export const sameTree: Problem = {
  id: 'same-tree',
  title: 'Same Tree',
  difficulty: 'Easy',
  topic: 'Trees',
  order: 36,

  prompt: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the **same** or not.

Two binary trees are considered the same if they are **structurally identical**, and the nodes have the same values.`,

  examples: [
    { input: 'p = [1,2,3], q = [1,2,3]', output: 'true' },
    { input: 'p = [1,2], q = [1,null,2]', output: 'false', explanation: 'Different structures.' },
    { input: 'p = [1,2,1], q = [1,1,2]', output: 'false' },
  ],

  constraints: ['The number of nodes in both trees is in the range [0, 100].', '-10^4 <= Node.val <= 10^4'],

  languages: {
    javascript: {
      functionName: 'isSameTree',
      starterCode: `function isSameTree(p, q) {

}`,
    },
    python: {
      functionName: 'is_same_tree',
      starterCode: `def is_same_tree(p, q):
    pass`,
    },
    typescript: {
      functionName: 'isSameTree',
      starterCode: `function isSameTree(p: any, q: any): boolean {
  return false;
}`,
    },
  },

  inputKinds: ['tree', 'tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[1, 2, 3], [1, 2, 3]], expected: true },
    { input: [[1, 2], [1, null, 2]], expected: false },
    { input: [[1, 2, 1], [1, 1, 2]], expected: false },
    { input: [[], []], expected: true },
    { input: [[1], []], expected: false },
    { input: [[1], [1]], expected: true },
  ],

  solutions: [
    {
      name: 'Recursive Structural Compare',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      explanation: `Three base cases: both null → equal; one null → not equal; values differ → not equal. Otherwise recurse on both children.`,
      code: {
        javascript: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        python: `def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    if p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
        typescript: `function isSameTree(p: any, q: any): boolean {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/same-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/same-binary-tree',
};
