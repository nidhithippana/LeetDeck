import type { Problem } from '../../types';

export const containsDuplicate: Problem = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  topic: 'Arrays & Hashing',
  order: 2,

  prompt: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,

  examples: [
    { input: 'nums = [1,2,3,1]', output: 'true' },
    { input: 'nums = [1,2,3,4]', output: 'false' },
    { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
  ],

  constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],

  languages: {
    javascript: {
      functionName: 'containsDuplicate',
      starterCode: `function containsDuplicate(nums) {

}`,
    },
    python: {
      functionName: 'contains_duplicate',
      starterCode: `def contains_duplicate(nums):
    pass`,
    },
    typescript: {
      functionName: 'containsDuplicate',
      starterCode: `function containsDuplicate(nums: number[]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: [[1, 2, 3, 1]], expected: true },
    { input: [[1, 2, 3, 4]], expected: false },
    { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    { input: [[]], expected: false },
    { input: [[7]], expected: false },
  ],

  solutions: [
    {
      name: 'Set',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `A set only stores unique values. If turning the array into a set shrinks it, there was a duplicate.`,
      code: {
        javascript: `function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}`,
        python: `def contains_duplicate(nums):
    return len(set(nums)) != len(nums)`,
        typescript: `function containsDuplicate(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}`,
      },
    },
    {
      name: 'Hash Set (early exit)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Same idea but exits the moment we find a duplicate. Faster in practice on inputs where duplicates appear early.`,
      code: {
        javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
        python: `def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False`,
        typescript: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
  neetcodeUrl: 'https://neetcode.io/problems/duplicate-integer',
};
