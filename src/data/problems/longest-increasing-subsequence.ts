import type { Problem } from '../../types';

export const longestIncreasingSubsequence: Problem = {
  id: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 56,

  prompt: `Given an integer array \`nums\`, return the length of the **longest strictly increasing subsequence**.

A subsequence is derived from the array by deleting some or no elements without changing the order of the remaining ones.`,

  examples: [
    { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The LIS is [2,3,7,101], length 4.' },
    { input: 'nums = [0,1,0,3,2,3]', output: '4' },
    { input: 'nums = [7,7,7,7,7,7,7]', output: '1' },
  ],

  constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],

  languages: {
    javascript: {
      functionName: 'lengthOfLIS',
      starterCode: `function lengthOfLIS(nums) {

}`,
    },
    python: {
      functionName: 'length_of_lis',
      starterCode: `def length_of_lis(nums):
    pass`,
    },
    typescript: {
      functionName: 'lengthOfLIS',
      starterCode: `function lengthOfLIS(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
    { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
    { input: [[7, 7, 7, 7, 7, 7, 7]], expected: 1 },
    { input: [[1]], expected: 1 },
    { input: [[4, 10, 4, 3, 8, 9]], expected: 3 },
  ],

  solutions: [
    {
      name: 'O(n²) DP',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(n)',
      explanation: `\`dp[i]\` = length of LIS ending at index \`i\`. For each \`i\`, look at all earlier \`j\` where \`nums[j] < nums[i]\`; \`dp[i] = 1 + max(dp[j])\`. The answer is the max over all \`dp\`. Simple to write.`,
      code: {
        javascript: `function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
  }
  return Math.max(...dp);
}`,
        python: `def length_of_lis(nums):
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
        typescript: `function lengthOfLIS(nums: number[]): number {
  const dp = new Array<number>(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
  }
  return Math.max(...dp);
}`,
      },
    },
    {
      name: 'O(n log n) Patience Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: `Maintain a \`tails\` array where \`tails[i]\` is the smallest possible tail of an increasing subsequence of length \`i + 1\`. For each new num: binary-search for the leftmost \`tails[j] >= num\` and replace it (or append if num is bigger than everything). The length of \`tails\` is the answer.

The \`tails\` array isn't necessarily a valid LIS — but its length is correct.`,
      code: {
        javascript: `function lengthOfLIS(nums) {
  const tails = [];
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;
  }
  return tails.length;
}`,
        python: `def length_of_lis(nums):
    from bisect import bisect_left
    tails = []
    for n in nums:
        i = bisect_left(tails, n)
        if i == len(tails):
            tails.append(n)
        else:
            tails[i] = n
    return len(tails)`,
        typescript: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;
  }
  return tails.length;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-increasing-subsequence',
};
