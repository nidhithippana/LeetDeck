import type { Problem } from '../../types';

export const binarySearch: Problem = {
  id: 'binary-search',
  title: 'Binary Search',
  difficulty: 'Easy',
  topic: 'Binary Search',
  order: 8,

  prompt: `Given a **sorted** array of integers \`nums\` (ascending) and an integer \`target\`, return the index of \`target\` if it exists, or \`-1\` otherwise.

Your algorithm must run in \`O(log n)\` time.`,

  examples: [
    { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 is not in nums.' },
  ],

  constraints: [
    '1 <= nums.length <= 10^4',
    'All values in nums are unique.',
    'nums is sorted in ascending order.',
  ],

  languages: {
    javascript: {
      functionName: 'search',
      starterCode: `function search(nums, target) {

}`,
    },
    python: {
      functionName: 'search',
      starterCode: `def search(nums, target):
    pass`,
    },
    typescript: {
      functionName: 'search',
      starterCode: `function search(nums: number[], target: number): number {
  return -1;
}`,
    },
  },

  tests: [
    { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { input: [[5], 5], expected: 0 },
    { input: [[5], 3], expected: -1 },
    { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0 },
    { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10], expected: 9 },
  ],

  solutions: [
    {
      name: 'Iterative Binary Search',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: `Maintain a search window \`[lo, hi]\`. Check the middle; if it matches, return. Otherwise discard the half that can't contain \`target\` and repeat.`,
      code: {
        javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
        typescript: `function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
  neetcodeUrl: 'https://neetcode.io/problems/binary-search',
};
