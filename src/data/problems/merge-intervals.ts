import type { Problem } from '../../types';

export const mergeIntervals: Problem = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  difficulty: 'Medium',
  topic: 'Intervals',
  order: 33,

  prompt: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

The result should be sorted by start time.`,

  examples: [
    { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → [1,6].' },
    { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Touching counts as overlap.' },
  ],

  constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],

  languages: {
    javascript: {
      functionName: 'merge',
      starterCode: `function merge(intervals) {

}`,
    },
    python: {
      functionName: 'merge',
      starterCode: `def merge(intervals):
    pass`,
    },
    typescript: {
      functionName: 'merge',
      starterCode: `function merge(intervals: number[][]): number[][] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { input: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
    { input: [[[1, 4]]], expected: [[1, 4]] },
    { input: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    { input: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
  ],

  solutions: [
    {
      name: 'Sort + Sweep',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: `Sort by start time. Walk through; for each interval, either extend the last one in the result (if they overlap) or append it as a new entry. Touching is overlap (\`<=\`).`,
      code: {
        javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [s, e] = intervals[i];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      result.push([s, e]);
    }
  }
  return result;
}`,
        python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= result[-1][1]:
            result[-1][1] = max(result[-1][1], e)
        else:
            result.append([s, e])
    return result`,
        typescript: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [s, e] = intervals[i];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      result.push([s, e]);
    }
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
  neetcodeUrl: 'https://neetcode.io/problems/merge-intervals',
};
