import type { Problem } from '../../types';

export const meetingRooms: Problem = {
  id: 'meeting-rooms',
  title: 'Meeting Rooms',
  difficulty: 'Easy',
  topic: 'Intervals',
  order: 64,

  prompt: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return \`true\` if a person could attend **all** meetings (no overlaps), otherwise \`false\`.

A meeting that ends exactly when another starts is **not** an overlap.`,

  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false' },
    { input: 'intervals = [[7,10],[2,4]]', output: 'true' },
  ],

  constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2'],

  languages: {
    javascript: {
      functionName: 'canAttendMeetings',
      starterCode: `function canAttendMeetings(intervals) {

}`,
    },
    python: {
      functionName: 'can_attend_meetings',
      starterCode: `def can_attend_meetings(intervals):
    pass`,
    },
    typescript: {
      functionName: 'canAttendMeetings',
      starterCode: `function canAttendMeetings(intervals: number[][]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: [[[0, 30], [5, 10], [15, 20]]], expected: false },
    { input: [[[7, 10], [2, 4]]], expected: true },
    { input: [[]], expected: true },
    { input: [[[5, 10]]], expected: true },
    { input: [[[1, 5], [5, 10]]], expected: true },
    { input: [[[1, 5], [4, 10]]], expected: false },
  ],

  solutions: [
    {
      name: 'Sort + Sweep',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      explanation: `Sort by start time. For each adjacent pair, check if the next meeting starts **before** the current one ends. If yes, overlap → return false. Otherwise the schedule is clean.`,
      code: {
        javascript: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
        python: `def can_attend_meetings(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True`,
        typescript: `function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/',
  neetcodeUrl: 'https://neetcode.io/problems/meeting-schedule',
};
