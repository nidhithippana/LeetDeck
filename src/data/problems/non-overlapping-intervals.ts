import type { Problem } from '../../types';

export const nonOverlappingIntervals: Problem = {
  id: 'non-overlapping-intervals',
  title: 'Non-overlapping Intervals',
  difficulty: 'Medium',
  topic: 'Intervals',
  order: 63,

  prompt: `Given an array of intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the **minimum number of intervals** you need to remove to make the rest non-overlapping.`,

  examples: [
    { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: 'Remove [1,3] and the rest are non-overlapping.' },
    { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' },
    { input: 'intervals = [[1,2],[2,3]]', output: '0' },
  ],

  constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2'],

  languages: {
    javascript: {
      functionName: 'eraseOverlapIntervals',
      starterCode: `function eraseOverlapIntervals(intervals) {

}`,
    },
    python: {
      functionName: 'erase_overlap_intervals',
      starterCode: `def erase_overlap_intervals(intervals):
    pass`,
    },
    typescript: {
      functionName: 'eraseOverlapIntervals',
      starterCode: `function eraseOverlapIntervals(intervals: number[][]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
    { input: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
    { input: [[[1, 2], [2, 3]]], expected: 0 },
    { input: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 },
    { input: [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]], expected: 2 },
  ],

  solutions: [
    {
      name: 'Greedy by End Time',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      explanation: `Sort by **end time**. Greedily keep the interval with the smallest end (so it leaves the most room for future ones). Walk through; any interval whose start is before the previous kept interval's end must be removed.

The "sort by end" insight is what makes greedy optimal here — sorting by start doesn't work.`,
      code: {
        javascript: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) {
      prevEnd = e;
    } else {
      count++;
    }
  }
  return count;
}`,
        python: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    prev_end = float('-inf')
    for s, e in intervals:
        if s >= prev_end:
            prev_end = e
        else:
            count += 1
    return count`,
        typescript: `function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) {
      prevEnd = e;
    } else {
      count++;
    }
  }
  return count;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/',
  neetcodeUrl: 'https://neetcode.io/problems/non-overlapping-intervals',
};
