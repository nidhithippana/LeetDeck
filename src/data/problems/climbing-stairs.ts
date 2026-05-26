import type { Problem } from '../../types';

export const climbingStairs: Problem = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  difficulty: 'Easy',
  topic: '1-D Dynamic Programming',
  order: 9,

  prompt: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can climb either \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,

  examples: [
    { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
    { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
    { input: 'n = 5', output: '8' },
  ],

  constraints: ['1 <= n <= 45'],

  languages: {
    javascript: {
      functionName: 'climbStairs',
      starterCode: `function climbStairs(n) {

}`,
    },
    python: {
      functionName: 'climb_stairs',
      starterCode: `def climb_stairs(n):
    pass`,
    },
    typescript: {
      functionName: 'climbStairs',
      starterCode: `function climbStairs(n: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [1], expected: 1 },
    { input: [2], expected: 2 },
    { input: [3], expected: 3 },
    { input: [5], expected: 8 },
    { input: [10], expected: 89 },
    { input: [20], expected: 10946 },
  ],

  solutions: [
    {
      name: 'DP Array',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Ways to reach step \`i\` = ways to reach \`i-1\` (then take 1 step) + ways to reach \`i-2\` (then take 2 steps). It's Fibonacci offset by one.`,
      code: {
        javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
        python: `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
        typescript: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  const dp = new Array<number>(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
      },
    },
    {
      name: 'Two Variables (O(1) space)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Same recurrence, but we only ever need the last two values. Slide them forward as a window of size 2.`,
      code: {
        javascript: `function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
        python: `def climb_stairs(n):
    a, b = 1, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
        typescript: `function climbStairs(n: number): number {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
  neetcodeUrl: 'https://neetcode.io/problems/climbing-stairs',
};
