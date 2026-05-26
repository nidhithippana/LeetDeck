import type { Problem } from '../../types';

export const subtreeOfAnother: Problem = {
  id: 'subtree-of-another',
  title: 'Subtree of Another Tree',
  difficulty: 'Easy',
  topic: 'Trees',
  order: 38,

  prompt: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if there is a subtree of \`root\` with the same structure and node values as \`subRoot\`, and \`false\` otherwise.

A subtree of a binary tree \`tree\` is a tree that consists of a node in \`tree\` and **all of this node's descendants**.`,

  examples: [
    { input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true' },
    { input: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]', output: 'false', explanation: 'The 4 subtree in root has an extra 0 below 1.' },
  ],

  constraints: ['The number of nodes in root is in [1, 2000].', 'The number of nodes in subRoot is in [1, 1000].'],

  languages: {
    javascript: {
      functionName: 'isSubtree',
      starterCode: `function isSubtree(root, subRoot) {

}`,
    },
    python: {
      functionName: 'is_subtree',
      starterCode: `def is_subtree(root, sub_root):
    pass`,
    },
    typescript: {
      functionName: 'isSubtree',
      starterCode: `function isSubtree(root: any, subRoot: any): boolean {
  return false;
}`,
    },
  },

  inputKinds: ['tree', 'tree'],
  outputKind: 'primitive',

  tests: [
    { input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true },
    {
      input: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]],
      expected: false,
    },
    { input: [[1, 1], [1]], expected: true },
    { input: [[3, 4, 5, 1, null, 2], [3, 1, 2]], expected: false },
    { input: [[1], [1]], expected: true },
  ],

  solutions: [
    {
      name: 'Recursive Same-Tree Check',
      timeComplexity: 'O(n · m)',
      spaceComplexity: 'O(h)',
      explanation: `For every node in the larger tree, check whether the subtree rooted there is identical to \`subRoot\` (using the same-tree pattern). If yes anywhere, return true.

There's a faster O(n + m) solution using KMP on the serialized trees, but this one is the cleanest and what most interviewers expect.`,
      code: {
        javascript: `function isSubtree(root, subRoot) {
  if (!root) return !subRoot;
  if (sameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function sameTree(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.val !== b.val) return false;
  return sameTree(a.left, b.left) && sameTree(a.right, b.right);
}`,
        python: `def is_subtree(root, sub_root):
    if not root:
        return not sub_root
    if same_tree(root, sub_root):
        return True
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)

def same_tree(a, b):
    if not a and not b:
        return True
    if not a or not b:
        return False
    if a.val != b.val:
        return False
    return same_tree(a.left, b.left) and same_tree(a.right, b.right)`,
        typescript: `function isSubtree(root: any, subRoot: any): boolean {
  if (!root) return !subRoot;
  if (sameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function sameTree(a: any, b: any): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.val !== b.val) return false;
  return sameTree(a.left, b.left) && sameTree(a.right, b.right);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/subtree-of-a-binary-tree',
};
