import type { Problem } from '../../types';

export const missingNumber: Problem = {
  id: 'missing-number',
  title: 'Missing Number',
  difficulty: 'Easy',
  topic: 'Bit Manipulation',
  order: 22,

  prompt: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

Solve it with \`O(1)\` extra space.`,

  examples: [
    { input: 'nums = [3,0,1]', output: '2', explanation: 'n = 3; the range is [0,3]. Missing: 2.' },
    { input: 'nums = [0,1]', output: '2', explanation: 'n = 2; the range is [0,2]. Missing: 2.' },
    { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' },
  ],

  constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers in nums are unique.'],

  languages: {
    javascript: {
      functionName: 'missingNumber',
      starterCode: `function missingNumber(nums) {

}`,
    },
    python: {
      functionName: 'missing_number',
      starterCode: `def missing_number(nums):
    pass`,
    },
    typescript: {
      functionName: 'missingNumber',
      starterCode: `function missingNumber(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[3, 0, 1]], expected: 2 },
    { input: [[0, 1]], expected: 2 },
    { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    { input: [[0]], expected: 1 },
    { input: [[1]], expected: 0 },
  ],

  solutions: [
    {
      name: 'XOR',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `XOR all values \`0..n\` together with all values in the array. Each present number cancels with its matching index; the missing number survives because nothing cancels it. Numerically robust — no overflow.`,
      code: {
        javascript: `function missingNumber(nums) {
  let xor = nums.length; // start with n so we cover the full [0..n] range
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
        python: `def missing_number(nums):
    xor = len(nums)
    for i, v in enumerate(nums):
        xor ^= i ^ v
    return xor`,
        typescript: `function missingNumber(nums: number[]): number {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
      },
    },
    {
      name: 'Sum Difference',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Expected sum is \`n(n+1)/2\`. Subtract the actual sum of the array. The difference is the missing number. Simpler to write but technically uses \`+\`/\`-\` (a bitwise variant uses XOR).`,
      code: {
        javascript: `function missingNumber(nums) {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  let actual = 0;
  for (const v of nums) actual += v;
  return expected - actual;
}`,
        python: `def missing_number(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)`,
        typescript: `function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  let actual = 0;
  for (const v of nums) actual += v;
  return expected - actual;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/missing-number/',
  neetcodeUrl: 'https://neetcode.io/problems/missing-number',
};
