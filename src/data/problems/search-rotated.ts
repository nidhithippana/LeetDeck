import type { Problem } from '../../types';

export const searchRotated: Problem = {
  id: 'search-rotated',
  title: 'Search in Rotated Sorted Array',
  difficulty: 'Medium',
  topic: 'Binary Search',
  order: 18,

  prompt: `There is an integer array \`nums\` sorted in ascending order (with distinct values). Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` (e.g. \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`).

Given the array \`nums\` after the rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

Your algorithm must run in \`O(log n)\` time.`,

  examples: [
    { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
    { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
    { input: 'nums = [1], target = 0', output: '-1' },
  ],

  constraints: [
    '1 <= nums.length <= 5000',
    '-10^4 <= nums[i] <= 10^4',
    'All values are unique.',
    'nums is guaranteed to be rotated at some pivot.',
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
    { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
    { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { input: [[1], 0], expected: -1 },
    { input: [[1], 1], expected: 0 },
    { input: [[1, 3], 3], expected: 1 },
    { input: [[3, 1], 1], expected: 1 },
    { input: [[5, 1, 3], 5], expected: 0 },
    { input: [[1, 2, 3, 4, 5], 4], expected: 3 },
  ],

  solutions: [
    {
      name: 'Modified Binary Search',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: `At each step, one of the two halves around \`mid\` is guaranteed to be **sorted**. Figure out which (compare \`nums[lo]\` to \`nums[mid]\`). If \`target\` is in that sorted half's range, search there; otherwise search the other half. Classic binary-search refinement.`,
      code: {
        javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // Left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
        python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
        typescript: `function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  neetcodeUrl: 'https://neetcode.io/problems/find-target-in-rotated-sorted-array',
};
