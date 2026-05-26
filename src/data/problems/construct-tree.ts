import type { Problem } from '../../types';

export const constructTree: Problem = {
  id: 'construct-tree',
  title: 'Construct Binary Tree from Preorder and Inorder',
  difficulty: 'Medium',
  topic: 'Trees',
  order: 61,

  prompt: `Given two integer arrays \`preorder\` and \`inorder\` where \`preorder\` is the preorder traversal of a binary tree and \`inorder\` is the inorder traversal of the same tree, construct and return the **binary tree**.

All values are unique.`,

  examples: [
    { input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]' },
    { input: 'preorder = [-1], inorder = [-1]', output: '[-1]' },
  ],

  constraints: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length', '-3000 <= Node.val <= 3000', 'All values are unique.'],

  languages: {
    javascript: {
      functionName: 'buildTree',
      starterCode: `function buildTree(preorder, inorder) {

}`,
    },
    python: {
      functionName: 'build_tree',
      starterCode: `def build_tree(preorder, inorder):
    pass`,
    },
    typescript: {
      functionName: 'buildTree',
      starterCode: `function buildTree(preorder: number[], inorder: number[]): any {
  return null;
}`,
    },
  },

  inputKinds: ['primitive', 'primitive'],
  outputKind: 'tree',

  tests: [
    { input: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
    { input: [[-1], [-1]], expected: [-1] },
    { input: [[1, 2, 3], [2, 1, 3]], expected: [1, 2, 3] },
    { input: [[1, 2], [2, 1]], expected: [1, 2] },
  ],

  solutions: [
    {
      name: 'Recursive with Inorder Map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `The first element of \`preorder\` is always the **root**. Find it in \`inorder\` — everything to its left is the left subtree, everything to its right is the right subtree. Recurse with adjusted ranges.

Speed it up by pre-building a value→index map for \`inorder\` so root lookup is O(1).`,
      code: {
        javascript: `function buildTree(preorder, inorder) {
  const inorderIdx = new Map();
  inorder.forEach((v, i) => inorderIdx.set(v, i));
  let preIdx = 0;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const rootVal = preorder[preIdx++];
    const root = new TreeNode(rootVal);
    const mid = inorderIdx.get(rootVal);
    root.left = build(lo, mid - 1);
    root.right = build(mid + 1, hi);
    return root;
  };
  return build(0, inorder.length - 1);
}`,
        python: `def build_tree(preorder, inorder):
    inorder_idx = {v: i for i, v in enumerate(inorder)}
    pre_iter = iter(preorder)
    def build(lo, hi):
        if lo > hi:
            return None
        root_val = next(pre_iter)
        root = TreeNode(root_val)
        mid = inorder_idx[root_val]
        root.left = build(lo, mid - 1)
        root.right = build(mid + 1, hi)
        return root
    return build(0, len(inorder) - 1)`,
        typescript: `function buildTree(preorder: number[], inorder: number[]): any {
  const inorderIdx = new Map<number, number>();
  inorder.forEach((v, i) => inorderIdx.set(v, i));
  let preIdx = 0;
  const TN = (globalThis as any).TreeNode;
  const build = (lo: number, hi: number): any => {
    if (lo > hi) return null;
    const rootVal = preorder[preIdx++];
    const root = new TN(rootVal);
    const mid = inorderIdx.get(rootVal)!;
    root.left = build(lo, mid - 1);
    root.right = build(mid + 1, hi);
    return root;
  };
  return build(0, inorder.length - 1);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  neetcodeUrl: 'https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal',
};
