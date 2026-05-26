import type { Problem } from '../../types';

export const houseRobber: Problem = {
  id: 'house-robber',
  title: 'House Robber',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 24,

  prompt: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that **adjacent houses have connected security systems** — if you rob two adjacent houses on the same night, the police will be alerted.

Given an integer array \`nums\` representing the amount of money at each house, return the **maximum amount of money** you can rob tonight without alerting the police.`,

  examples: [
    { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob houses 0 (1) and 2 (3): 1 + 3 = 4.' },
    { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses 0, 2, 4: 2 + 9 + 1 = 12.' },
  ],

  constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],

  languages: {
    javascript: {
      functionName: 'rob',
      starterCode: `function rob(nums) {

}`,
    },
    python: {
      functionName: 'rob',
      starterCode: `def rob(nums):
    pass`,
    },
    typescript: {
      functionName: 'rob',
      starterCode: `function rob(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[1, 2, 3, 1]], expected: 4 },
    { input: [[2, 7, 9, 3, 1]], expected: 12 },
    { input: [[]], expected: 0 },
    { input: [[5]], expected: 5 },
    { input: [[5, 1, 1, 5]], expected: 10 },
    { input: [[2, 1, 1, 2]], expected: 4 },
  ],

  solutions: [
    {
      name: 'Rolling Two Variables',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `For each house \`i\`, the best you can do is either:
1. **Skip** it → keep the previous best.
2. **Rob** it → add to the best you had **two houses ago**.

So \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`. You only need the last two values, so use two variables.`,
      code: {
        javascript: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
        python: `def rob(nums):
    prev2 = prev1 = 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1`,
        typescript: `function rob(nums: number[]): number {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
  neetcodeUrl: 'https://neetcode.io/problems/house-robber',
};
