import type { Problem } from '../../types';

export const maximumSubarray: Problem = {
  id: 'maximum-subarray',
  title: 'Maximum Subarray',
  difficulty: 'Medium',
  topic: 'Greedy',
  order: 10,

  prompt: `Given an integer array \`nums\`, find the contiguous subarray with the **largest sum**, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,

  examples: [
    { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6.' },
    { input: 'nums = [1]', output: '1' },
    { input: 'nums = [5,4,-1,7,8]', output: '23' },
  ],

  constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],

  languages: {
    javascript: {
      functionName: 'maxSubArray',
      starterCode: `function maxSubArray(nums) {

}`,
    },
    python: {
      functionName: 'max_sub_array',
      starterCode: `def max_sub_array(nums):
    pass`,
    },
    typescript: {
      functionName: 'maxSubArray',
      starterCode: `function maxSubArray(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
    { input: [[1]], expected: 1 },
    { input: [[5, 4, -1, 7, 8]], expected: 23 },
    { input: [[-1]], expected: -1 },
    { input: [[-2, -1]], expected: -1 },
  ],

  solutions: [
    {
      name: "Kadane's Algorithm",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `At each index, the best subarray ending here is either *just this element* (start fresh) or *extend the previous best by this element*. Whichever is bigger. Track the overall max across all "ending here" values.`,
      code: {
        javascript: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
        python: `def max_sub_array(nums):
    cur = best = nums[0]
    for n in nums[1:]:
        cur = max(n, cur + n)
        best = max(best, cur)
    return best`,
        typescript: `function maxSubArray(nums: number[]): number {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
  neetcodeUrl: 'https://neetcode.io/problems/maximum-subarray',
};
