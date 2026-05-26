import type { Problem } from '../../types';

export const meetingRoomsII: Problem = {
  id: 'meeting-rooms-ii',
  title: 'Meeting Rooms II',
  difficulty: 'Medium',
  topic: 'Intervals',
  order: 65,

  prompt: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the **minimum number of conference rooms** required to hold all meetings.

A meeting that ends exactly when another starts can share the same room (they don't conflict).`,

  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2' },
    { input: 'intervals = [[7,10],[2,4]]', output: '1' },
  ],

  constraints: ['1 <= intervals.length <= 10^4'],

  languages: {
    javascript: {
      functionName: 'minMeetingRooms',
      starterCode: `function minMeetingRooms(intervals) {

}`,
    },
    python: {
      functionName: 'min_meeting_rooms',
      starterCode: `def min_meeting_rooms(intervals):
    pass`,
    },
    typescript: {
      functionName: 'minMeetingRooms',
      starterCode: `function minMeetingRooms(intervals: number[][]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
    { input: [[[7, 10], [2, 4]]], expected: 1 },
    { input: [[]], expected: 0 },
    { input: [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]], expected: 4 },
    { input: [[[1, 5], [5, 10]]], expected: 1 },
  ],

  solutions: [
    {
      name: 'Two Sorted Arrays (Chronological Sweep)',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: `Separate start times and end times, sort each. Walk through starts; for each one, if the next start is **after** the earliest end, that room is freed up — advance the end pointer. Otherwise we need a new room. The peak number of rooms in use is the answer.`,
      code: {
        javascript: `function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  let rooms = 0, endIdx = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endIdx]) rooms++;
    else endIdx++;
  }
  return rooms;
}`,
        python: `def min_meeting_rooms(intervals):
    if not intervals:
        return 0
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    rooms = end_idx = 0
    for s in starts:
        if s < ends[end_idx]:
            rooms += 1
        else:
            end_idx += 1
    return rooms`,
        typescript: `function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  let rooms = 0, endIdx = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endIdx]) rooms++;
    else endIdx++;
  }
  return rooms;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/',
  neetcodeUrl: 'https://neetcode.io/problems/meeting-schedule-ii',
};
