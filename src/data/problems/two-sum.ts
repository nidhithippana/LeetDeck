import type { Problem } from '../../types';

export const twoSum: Problem = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  topic: 'Arrays & Hashing',
  order: 1,

  prompt: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice. The answer can be returned in any order.`,

  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9.' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]' },
  ],

  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    'Only one valid answer exists.',
  ],

  languages: {
    javascript: {
      functionName: 'twoSum',
      starterCode: `function twoSum(nums, target) {
  // Return [i, j] such that nums[i] + nums[j] === target
}`,
    },
    python: {
      functionName: 'two_sum',
      starterCode: `def two_sum(nums, target):
    # Return [i, j] such that nums[i] + nums[j] == target
    pass`,
    },
    typescript: {
      functionName: 'twoSum',
      starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Return [i, j] such that nums[i] + nums[j] === target
  return [];
}`,
    },
  },

  tests: [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1], unordered: true },
    { input: [[3, 2, 4], 6], expected: [1, 2], unordered: true },
    { input: [[3, 3], 6], expected: [0, 1], unordered: true },
    { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], unordered: true },
  ],

  solutions: [
    {
      name: 'Brute Force',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: `Check every pair. Simple and correct, but quadratic — too slow for large inputs.`,
      code: {
        javascript: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
}`,
        python: `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
      },
    },
    {
      name: 'Hash Map (one pass)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `As we walk the array, for each \`nums[i]\` we ask: have I already seen \`target - nums[i]\`? If yes, those two indices are the answer. We store \`{value → index}\` so the lookup is O(1).`,
      code: {
        javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
        python: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  neetcodeUrl: 'https://neetcode.io/problems/two-integer-sum',
};
