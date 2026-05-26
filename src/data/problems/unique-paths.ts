import type { Problem } from '../../types';

export const uniquePaths: Problem = {
  id: 'unique-paths',
  title: 'Unique Paths',
  difficulty: 'Medium',
  topic: '2-D Dynamic Programming',
  order: 29,

  prompt: `There is a robot on an \`m × n\` grid. The robot is initially located at the top-left corner. It tries to reach the bottom-right corner.

The robot can only move either **down** or **right** at any point in time.

Return the number of possible unique paths the robot can take to reach the bottom-right corner.`,

  examples: [
    { input: 'm = 3, n = 7', output: '28' },
    { input: 'm = 3, n = 2', output: '3', explanation: 'Down→Down→Right · Down→Right→Down · Right→Down→Down.' },
  ],

  constraints: ['1 <= m, n <= 100', 'The answer is guaranteed to be at most 2 × 10^9.'],

  languages: {
    javascript: {
      functionName: 'uniquePaths',
      starterCode: `function uniquePaths(m, n) {

}`,
    },
    python: {
      functionName: 'unique_paths',
      starterCode: `def unique_paths(m, n):
    pass`,
    },
    typescript: {
      functionName: 'uniquePaths',
      starterCode: `function uniquePaths(m: number, n: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [3, 7], expected: 28 },
    { input: [3, 2], expected: 3 },
    { input: [1, 1], expected: 1 },
    { input: [1, 10], expected: 1 },
    { input: [7, 3], expected: 28 },
    { input: [10, 10], expected: 48620 },
  ],

  solutions: [
    {
      name: '1D Rolling DP',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(n)',
      explanation: `Each cell's count = cell above + cell to the left. Walk row by row, and you only need the previous row's values. So keep a single 1D array of size \`n\` and update in place: \`dp[j] = dp[j] + dp[j-1]\` (the dp[j] on the right is from the previous row, dp[j-1] is the just-updated cell to the left).`,
      code: {
        javascript: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
        python: `def unique_paths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] = dp[j] + dp[j - 1]
    return dp[n - 1]`,
        typescript: `function uniquePaths(m: number, n: number): number {
  const dp = new Array<number>(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
      },
    },
    {
      name: 'Combinatorics',
      timeComplexity: 'O(min(m, n))',
      spaceComplexity: 'O(1)',
      explanation: `Any path takes exactly \`(m-1) + (n-1)\` moves. We just choose which \`(m-1)\` of those are "down". So the answer is \`C(m+n-2, m-1)\`. Compute iteratively to avoid factorial overflow.`,
      code: {
        javascript: `function uniquePaths(m, n) {
  // C(m+n-2, min(m-1, n-1))
  const a = m + n - 2;
  const b = Math.min(m - 1, n - 1);
  let result = 1;
  for (let i = 0; i < b; i++) {
    result = result * (a - i) / (i + 1);
  }
  return Math.round(result);
}`,
        python: `def unique_paths(m, n):
    from math import comb
    return comb(m + n - 2, m - 1)`,
        typescript: `function uniquePaths(m: number, n: number): number {
  const a = m + n - 2;
  const b = Math.min(m - 1, n - 1);
  let result = 1;
  for (let i = 0; i < b; i++) {
    result = result * (a - i) / (i + 1);
  }
  return Math.round(result);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
  neetcodeUrl: 'https://neetcode.io/problems/count-paths',
};
