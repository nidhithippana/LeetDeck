import type { Problem } from '../../types';

export const lcaBst: Problem = {
  id: 'lca-bst',
  title: 'Lowest Common Ancestor of a BST',
  difficulty: 'Medium',
  topic: 'Trees',
  order: 62,

  prompt: `Given a binary search tree (BST), find the **lowest common ancestor** (LCA) of two given values \`p\` and \`q\`.

The LCA is defined as: the lowest node in the tree that has both \`p\` and \`q\` as descendants (a node can be a descendant of itself).

> **Adapted from LeetCode:** the original problem takes \`TreeNode\` pointers and returns a \`TreeNode\` pointer. Since our test runner serializes via JSON, this version takes the **values** \`p\` and \`q\` directly, and you return the **value** of the LCA node.`,

  examples: [
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' },
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', output: '2', explanation: 'A node can be a descendant of itself.' },
  ],

  constraints: ['All values are unique.', 'p and q are guaranteed to exist in the BST.'],

  languages: {
    javascript: {
      functionName: 'lowestCommonAncestor',
      starterCode: `function lowestCommonAncestor(root, p, q) {

}`,
    },
    python: {
      functionName: 'lowest_common_ancestor',
      starterCode: `def lowest_common_ancestor(root, p, q):
    pass`,
    },
    typescript: {
      functionName: 'lowestCommonAncestor',
      starterCode: `function lowestCommonAncestor(root: any, p: number, q: number): number {
  return 0;
}`,
    },
  },

  inputKinds: ['tree', 'primitive', 'primitive'],
  outputKind: 'primitive',

  tests: [
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
    { input: [[2, 1], 2, 1], expected: 2 },
    { input: [[5, 3, 6, 2, 4, null, null, 1], 1, 4], expected: 3 },
  ],

  solutions: [
    {
      name: 'Walk Down Using BST Property',
      timeComplexity: 'O(h)',
      spaceComplexity: 'O(1) iterative / O(h) recursive',
      explanation: `In a BST, the LCA of \`p\` and \`q\` is the **first node where \`p\` and \`q\` are on different sides** (or one of them equals the node).

- If both \`p\` and \`q\` are **less** than \`root.val\` → recurse/iterate into the **left** subtree.
- If both are **greater** → go right.
- Otherwise, the current node is the LCA.`,
      code: {
        javascript: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p < node.val && q < node.val) node = node.left;
    else if (p > node.val && q > node.val) node = node.right;
    else return node.val;
  }
}`,
        python: `def lowest_common_ancestor(root, p, q):
    node = root
    while node:
        if p < node.val and q < node.val:
            node = node.left
        elif p > node.val and q > node.val:
            node = node.right
        else:
            return node.val`,
        typescript: `function lowestCommonAncestor(root: any, p: number, q: number): number {
  let node = root;
  while (node) {
    if (p < node.val && q < node.val) node = node.left;
    else if (p > node.val && q > node.val) node = node.right;
    else return node.val;
  }
  return -1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree',
};
