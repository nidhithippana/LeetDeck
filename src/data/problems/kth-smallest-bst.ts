import type { Problem } from '../../types';

export const kthSmallestBst: Problem = {
  id: 'kth-smallest-bst',
  title: 'Kth Smallest Element in a BST',
  difficulty: 'Medium',
  topic: 'Trees',
  order: 41,

  prompt: `Given the \`root\` of a **binary search tree** and an integer \`k\`, return the \`k\`-th smallest value (1-indexed) of all the values of the nodes in the tree.`,

  examples: [
    { input: 'root = [3,1,4,null,2], k = 1', output: '1' },
    { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3' },
  ],

  constraints: ['The number of nodes is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],

  languages: {
    javascript: {
      functionName: 'kthSmallest',
      starterCode: `function kthSmallest(root, k) {

}`,
    },
    python: {
      functionName: 'kth_smallest',
      starterCode: `def kth_smallest(root, k):
    pass`,
    },
    typescript: {
      functionName: 'kthSmallest',
      starterCode: `function kthSmallest(root: any, k: number): number {
  return 0;
}`,
    },
  },

  inputKinds: ['tree', 'primitive'],
  outputKind: 'primitive',

  tests: [
    { input: [[3, 1, 4, null, 2], 1], expected: 1 },
    { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
    { input: [[1], 1], expected: 1 },
    { input: [[3, 1, 4, null, 2], 4], expected: 4 },
    { input: [[5, 3, 6, 2, 4, null, null, 1], 6], expected: 6 },
  ],

  solutions: [
    {
      name: 'In-order Traversal (Iterative)',
      timeComplexity: 'O(h + k)',
      spaceComplexity: 'O(h)',
      explanation: `In a BST, an **in-order** traversal visits nodes in ascending order. Walk in-order with an explicit stack, counting nodes as you visit them. When you reach the \`k\`-th, return its value. No need to traverse the whole tree.`,
      code: {
        javascript: `function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    k--;
    if (k === 0) return node.val;
    node = node.right;
  }
}`,
        python: `def kth_smallest(root, k):
    stack = []
    node = root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right`,
        typescript: `function kthSmallest(root: any, k: number): number {
  const stack: any[] = [];
  let node = root;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    k--;
    if (k === 0) return node.val;
    node = node.right;
  }
  return -1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
  neetcodeUrl: 'https://neetcode.io/problems/kth-smallest-integer-in-bst',
};
