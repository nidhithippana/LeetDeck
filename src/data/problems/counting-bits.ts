import type { Problem } from '../../types';

export const countingBits: Problem = {
  id: 'counting-bits',
  title: 'Counting Bits',
  difficulty: 'Easy',
  topic: 'Bit Manipulation',
  order: 21,

  prompt: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the number of \`1\`'s in the binary representation of \`i\`.

Solve it in a single pass in \`O(n)\` time without using a built-in popcount.`,

  examples: [
    { input: 'n = 2', output: '[0,1,1]', explanation: '0 → 0, 1 → 1, 2 → 10 → 1.' },
    { input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: '0,1,10,11,100,101.' },
  ],

  constraints: ['0 <= n <= 10^5'],

  languages: {
    javascript: {
      functionName: 'countBits',
      starterCode: `function countBits(n) {

}`,
    },
    python: {
      functionName: 'count_bits',
      starterCode: `def count_bits(n):
    pass`,
    },
    typescript: {
      functionName: 'countBits',
      starterCode: `function countBits(n: number): number[] {
  return [];
}`,
    },
  },

  tests: [
    { input: [2], expected: [0, 1, 1] },
    { input: [5], expected: [0, 1, 1, 2, 1, 2] },
    { input: [0], expected: [0] },
    { input: [1], expected: [0, 1] },
    { input: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
  ],

  solutions: [
    {
      name: 'DP with i >> 1',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n) for the output (O(1) extra)',
      explanation: `Key insight: the bit count of \`i\` equals the bit count of \`i >> 1\` (i.e., \`i\` with the low bit dropped) plus 1 if the low bit is set. So \`dp[i] = dp[i >> 1] + (i & 1)\`. Each value computed in O(1) from a smaller one.`,
      code: {
        javascript: `function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
        python: `def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
        typescript: `function countBits(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/counting-bits/',
  neetcodeUrl: 'https://neetcode.io/problems/counting-bits',
};
