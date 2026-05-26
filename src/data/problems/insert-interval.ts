import type { Problem } from '../../types';

export const insertInterval: Problem = {
  id: 'insert-interval',
  title: 'Insert Interval',
  difficulty: 'Medium',
  topic: 'Intervals',
  order: 32,

  prompt: `You are given an array of **non-overlapping** intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and end of the \`i\`-th interval, and \`intervals\` is sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\`.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.`,

  examples: [
    { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
    { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]', explanation: '[4,8] overlaps with [3,5], [6,7], [8,10] — merge all four.' },
  ],

  constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', 'intervals is sorted by start.'],

  languages: {
    javascript: {
      functionName: 'insert',
      starterCode: `function insert(intervals, newInterval) {

}`,
    },
    python: {
      functionName: 'insert',
      starterCode: `def insert(intervals, new_interval):
    pass`,
    },
    typescript: {
      functionName: 'insert',
      starterCode: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
    {
      input: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
      expected: [[1, 2], [3, 10], [12, 16]],
    },
    { input: [[], [5, 7]], expected: [[5, 7]] },
    { input: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
    { input: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]] },
    { input: [[[1, 5]], [0, 0]], expected: [[0, 0], [1, 5]] },
  ],

  solutions: [
    {
      name: 'Three-Phase Sweep',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Walk left to right in three phases:
1. **Before** — intervals strictly to the left of \`newInterval\` (no overlap). Copy them as-is.
2. **Overlapping** — intervals that touch \`newInterval\`. Expand \`newInterval\` to cover their range, then push the merged result.
3. **After** — intervals strictly to the right. Copy as-is.

Single linear pass, no sorting needed since the input is already sorted.`,
      code: {
        javascript: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0, n = intervals.length;
  // before
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  // merge
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  // after
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}`,
        python: `def insert(intervals, new_interval):
    result = []
    i, n = 0, len(intervals)
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval = [
            min(new_interval[0], intervals[i][0]),
            max(new_interval[1], intervals[i][1]),
        ]
        i += 1
    result.append(new_interval)
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
        typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/insert-interval/',
  neetcodeUrl: 'https://neetcode.io/problems/insert-new-interval',
};
