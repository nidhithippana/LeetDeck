import type { Problem } from '../../types';

export const productExceptSelf: Problem = {
  id: 'product-except-self',
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  order: 4,

  prompt: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is the product of all the elements of \`nums\` **except** \`nums[i]\`.

You must write an algorithm that runs in \`O(n)\` time **without using the division operation**.`,

  examples: [
    { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
    { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
  ],

  constraints: [
    '2 <= nums.length <= 10^5',
    '-30 <= nums[i] <= 30',
    'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
  ],

  languages: {
    javascript: {
      functionName: 'productExceptSelf',
      starterCode: `function productExceptSelf(nums) {

}`,
    },
    python: {
      functionName: 'product_except_self',
      starterCode: `def product_except_self(nums):
    pass`,
    },
    typescript: {
      functionName: 'productExceptSelf',
      starterCode: `function productExceptSelf(nums: number[]): number[] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
    { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    { input: [[2, 3]], expected: [3, 2] },
    { input: [[5, 5, 5]], expected: [25, 25, 25] },
  ],

  solutions: [
    {
      name: 'Prefix + Suffix Products',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `For each index \`i\`, the answer is "product of everything to the left" × "product of everything to the right". Build both arrays in two linear passes, then multiply.`,
      code: {
        javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const prefix = new Array(n).fill(1);
  const suffix = new Array(n).fill(1);
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
  return prefix.map((p, i) => p * suffix[i]);
}`,
        python: `def product_except_self(nums):
    n = len(nums)
    prefix = [1] * n
    suffix = [1] * n
    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]
    return [p * s for p, s in zip(prefix, suffix)]`,
        typescript: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const prefix = new Array<number>(n).fill(1);
  const suffix = new Array<number>(n).fill(1);
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
  return prefix.map((p, i) => p * suffix[i]);
}`,
      },
    },
    {
      name: 'O(1) Extra Space',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Reuse the output array. First pass fills it with prefix products; second pass multiplies in suffix products on the fly. The output itself doesn't count toward space complexity.`,
      code: {
        javascript: `function productExceptSelf(nums) {
  const res = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
        python: `def product_except_self(nums):
    res = [1] * len(nums)
    prefix = 1
    for i in range(len(nums)):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
        typescript: `function productExceptSelf(nums: number[]): number[] {
  const res = new Array<number>(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
  neetcodeUrl: 'https://neetcode.io/problems/products-of-array-discluding-self',
};
