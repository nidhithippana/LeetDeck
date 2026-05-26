import type { Problem } from '../../types';

export const maxProductSubarray: Problem = {
  id: 'max-product-subarray',
  title: 'Maximum Product Subarray',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 30,

  prompt: `Given an integer array \`nums\`, find a contiguous subarray within the array (containing at least one number) which has the **largest product**, and return the product.

The test cases are generated so that the answer fits in a 32-bit integer.`,

  examples: [
    { input: 'nums = [2,3,-2,4]', output: '6', explanation: 'Subarray [2,3] has the largest product 6.' },
    { input: 'nums = [-2,0,-1]', output: '0', explanation: 'The answer is 0; subarrays don\'t skip zeros.' },
  ],

  constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],

  languages: {
    javascript: {
      functionName: 'maxProduct',
      starterCode: `function maxProduct(nums) {

}`,
    },
    python: {
      functionName: 'max_product',
      starterCode: `def max_product(nums):
    pass`,
    },
    typescript: {
      functionName: 'maxProduct',
      starterCode: `function maxProduct(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[2, 3, -2, 4]], expected: 6 },
    { input: [[-2, 0, -1]], expected: 0 },
    { input: [[-2, 3, -4]], expected: 24 },
    { input: [[0, 2]], expected: 2 },
    { input: [[-3]], expected: -3 },
    { input: [[2, -5, -2, -4, 3]], expected: 24 },
  ],

  solutions: [
    {
      name: 'Track Max and Min Ending Here',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Like Kadane's, but products: a big-negative running product can become a big-positive when multiplied by another negative. So at each step track both the **max** product ending here and the **min** product ending here. Swap them when the current number is negative (negating the array flips max↔min). Update the global best from the running max.`,
      code: {
        javascript: `function maxProduct(nums) {
  let maxEnd = nums[0], minEnd = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    if (n < 0) [maxEnd, minEnd] = [minEnd, maxEnd];
    maxEnd = Math.max(n, maxEnd * n);
    minEnd = Math.min(n, minEnd * n);
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`,
        python: `def max_product(nums):
    max_end = min_end = best = nums[0]
    for n in nums[1:]:
        if n < 0:
            max_end, min_end = min_end, max_end
        max_end = max(n, max_end * n)
        min_end = min(n, min_end * n)
        best = max(best, max_end)
    return best`,
        typescript: `function maxProduct(nums: number[]): number {
  let maxEnd = nums[0], minEnd = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    if (n < 0) [maxEnd, minEnd] = [minEnd, maxEnd];
    maxEnd = Math.max(n, maxEnd * n);
    minEnd = Math.min(n, minEnd * n);
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/',
  neetcodeUrl: 'https://neetcode.io/problems/maximum-product-subarray',
};
