import type { Problem } from '../../types';

export const findMinRotated: Problem = {
  id: 'find-min-rotated',
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'Medium',
  topic: 'Binary Search',
  order: 31,

  prompt: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between 1 and \`n\` times (e.g. \`[0,1,2,4,5,6,7]\` could become \`[4,5,6,7,0,1,2]\`).

Given the sorted rotated array \`nums\` of **distinct** elements, return the **minimum element**. You must write an algorithm that runs in \`O(log n)\` time.`,

  examples: [
    { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'Originally [1,2,3,4,5], rotated 3 times.' },
    { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
    { input: 'nums = [11,13,15,17]', output: '11', explanation: 'Rotated 4 times — back to sorted order.' },
  ],

  constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All values are unique.'],

  languages: {
    javascript: {
      functionName: 'findMin',
      starterCode: `function findMin(nums) {

}`,
    },
    python: {
      functionName: 'find_min',
      starterCode: `def find_min(nums):
    pass`,
    },
    typescript: {
      functionName: 'findMin',
      starterCode: `function findMin(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[3, 4, 5, 1, 2]], expected: 1 },
    { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
    { input: [[11, 13, 15, 17]], expected: 11 },
    { input: [[2, 1]], expected: 1 },
    { input: [[5]], expected: 5 },
    { input: [[5, 1, 2, 3, 4]], expected: 1 },
  ],

  solutions: [
    {
      name: 'Binary Search vs Right Edge',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: `Compare \`nums[mid]\` to \`nums[hi]\`:
- If \`nums[mid] > nums[hi]\`, the min is in the right half (move \`lo = mid + 1\`).
- Otherwise the min is at \`mid\` or to its left (move \`hi = mid\`).

When the window collapses (\`lo == hi\`), that's the minimum. We compare to the right edge (not the left) so the not-rotated case still works correctly.`,
      code: {
        javascript: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
        python: `def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
        typescript: `function findMin(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  neetcodeUrl: 'https://neetcode.io/problems/find-minimum-in-rotated-sorted-array',
};
