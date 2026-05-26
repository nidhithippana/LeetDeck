import type { Problem } from '../../types';

export const houseRobberII: Problem = {
  id: 'house-robber-ii',
  title: 'House Robber II',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 27,

  prompt: `You are a professional robber planning to rob houses along a street. The houses at this place are **arranged in a circle** — the first house is adjacent to the last one. Adjacent houses have connected security, so robbing two adjacent houses alerts the police.

Given an integer array \`nums\` representing the money at each house, return the maximum amount you can rob without alerting the police.`,

  examples: [
    { input: 'nums = [2,3,2]', output: '3', explanation: "Can't rob houses 0 and 2 (adjacent in the circle). Best is to rob house 1." },
    { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob houses 0 and 2.' },
    { input: 'nums = [1,2,3]', output: '3' },
  ],

  constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],

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
    { input: [[2, 3, 2]], expected: 3 },
    { input: [[1, 2, 3, 1]], expected: 4 },
    { input: [[1, 2, 3]], expected: 3 },
    { input: [[1]], expected: 1 },
    { input: [[1, 2]], expected: 2 },
    { input: [[200, 3, 140, 20, 10]], expected: 340 },
  ],

  solutions: [
    {
      name: 'Two Linear Passes',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `The first and last houses are adjacent, so you can't rob both. Run the regular House Robber algorithm twice: once on \`nums[0..n-2]\` (excluding the last), once on \`nums[1..n-1]\` (excluding the first). The answer is the max of the two.

Edge case: arrays of length 1 should just return that single value.`,
      code: {
        javascript: `function rob(nums) {
  if (nums.length === 1) return nums[0];

  const robLinear = (arr) => {
    let prev2 = 0, prev1 = 0;
    for (const n of arr) {
      const cur = Math.max(prev1, prev2 + n);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  };

  return Math.max(
    robLinear(nums.slice(0, -1)),
    robLinear(nums.slice(1))
  );
}`,
        python: `def rob(nums):
    if len(nums) == 1:
        return nums[0]

    def rob_linear(arr):
        prev2 = prev1 = 0
        for n in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + n)
        return prev1

    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`,
        typescript: `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];

  const robLinear = (arr: number[]): number => {
    let prev2 = 0, prev1 = 0;
    for (const n of arr) {
      const cur = Math.max(prev1, prev2 + n);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  };

  return Math.max(
    robLinear(nums.slice(0, -1)),
    robLinear(nums.slice(1))
  );
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/',
  neetcodeUrl: 'https://neetcode.io/problems/house-robber-ii',
};
