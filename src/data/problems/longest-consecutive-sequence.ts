import type { Problem } from '../../types';

export const longestConsecutiveSequence: Problem = {
  id: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  order: 13,

  prompt: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.`,

  examples: [
    { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive sequence is [1, 2, 3, 4].' },
    { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
  ],

  constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],

  languages: {
    javascript: {
      functionName: 'longestConsecutive',
      starterCode: `function longestConsecutive(nums) {

}`,
    },
    python: {
      functionName: 'longest_consecutive',
      starterCode: `def longest_consecutive(nums):
    pass`,
    },
    typescript: {
      functionName: 'longestConsecutive',
      starterCode: `function longestConsecutive(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
    { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    { input: [[]], expected: 0 },
    { input: [[1]], expected: 1 },
    { input: [[1, 2, 0, 1]], expected: 3 },
    { input: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7 },
  ],

  solutions: [
    {
      name: 'Hash Set with Sequence Starts',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Put all numbers in a set. A number \`n\` is a "start of a sequence" iff \`n-1\` is not in the set. For each start, walk forward as far as possible. Each number is visited at most twice (once as a start check, once during a walk), so it's O(n) total.`,
      code: {
        javascript: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue; // not a sequence start
    let cur = n, len = 1;
    while (set.has(cur + 1)) { cur++; len++; }
    if (len > best) best = len;
  }
  return best;
}`,
        python: `def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for n in s:
        if n - 1 in s:
            continue
        cur, length = n, 1
        while cur + 1 in s:
            cur += 1
            length += 1
        best = max(best, length)
    return best`,
        typescript: `function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue;
    let cur = n, len = 1;
    while (set.has(cur + 1)) { cur++; len++; }
    if (len > best) best = len;
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-consecutive-sequence',
};
