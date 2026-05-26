import type { Problem } from '../../types';

export const validateBst: Problem = {
  id: 'validate-bst',
  title: 'Validate Binary Search Tree',
  difficulty: 'Medium',
  topic: 'Trees',
  order: 40,

  prompt: `Given the \`root\` of a binary tree, determine if it is a valid **binary search tree** (BST).

A valid BST is defined as follows:
1. The **left subtree** of a node contains only nodes with keys **strictly less** than the node's key.
2. The **right subtree** of a node contains only nodes with keys **strictly greater** than the node's key.
3. Both the left and right subtrees must also be binary search trees.`,

  examples: [
    { input: 'root = [2,1,3]', output: 'true' },
    { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The 3 is in the right subtree of 5 but is less than 5.' },
  ],

  constraints: ['The number of nodes is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],

  languages: {
    javascript: {
      functionName: 'isValidBST',
      starterCode: `function isValidBST(root) {

}`,
    },
    python: {
      functionName: 'is_valid_bst',
      starterCode: `def is_valid_bst(root):
    pass`,
    },
    typescript: {
      functionName: 'isValidBST',
      starterCode: `function isValidBST(root: any): boolean {
  return false;
}`,
    },
  },

  inputKinds: ['tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[2, 1, 3]], expected: true },
    { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
    { input: [[1]], expected: true },
    { input: [[10, 5, 15, null, null, 6, 20]], expected: false },
    { input: [[2, 2, 2]], expected: false },
    { input: [[5, 4, 6, null, null, 3, 7]], expected: false },
  ],

  solutions: [
    {
      name: 'Recursive Min/Max Bounds',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      explanation: `Each node must satisfy a strict \`(min, max)\` range. Pass the bounds down recursively: when you go left, the new max is the parent's value; when you go right, the new min is the parent's value. Any violation → not a BST.

A naive "check just the immediate children" version is wrong — a deep descendant can violate the BST property without its immediate parent doing so.`,
      code: {
        javascript: `function isValidBST(root) {
  const check = (node, min, max) => {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return check(node.left, min, node.val) && check(node.right, node.val, max);
  };
  return check(root, -Infinity, Infinity);
}`,
        python: `def is_valid_bst(root):
    def check(node, lo, hi):
        if not node:
            return True
        if node.val <= lo or node.val >= hi:
            return False
        return check(node.left, lo, node.val) and check(node.right, node.val, hi)
    return check(root, float('-inf'), float('inf'))`,
        typescript: `function isValidBST(root: any): boolean {
  const check = (node: any, min: number, max: number): boolean => {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return check(node.left, min, node.val) && check(node.right, node.val, max);
  };
  return check(root, -Infinity, Infinity);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/valid-binary-search-tree',
};
