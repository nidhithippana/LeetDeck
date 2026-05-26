import type { Problem } from '../../types';

export const jumpGame: Problem = {
  id: 'jump-game',
  title: 'Jump Game',
  difficulty: 'Medium',
  topic: 'Greedy',
  order: 28,

  prompt: `You are given an integer array \`nums\`. You are initially positioned at the array's **first index**, and each element in the array represents your **maximum jump length** at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,

  examples: [
    { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from 0 to 1, then 3 steps to the last index.' },
    { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'You will always arrive at index 3 with max jump 0, never reaching the last.' },
  ],

  constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],

  languages: {
    javascript: {
      functionName: 'canJump',
      starterCode: `function canJump(nums) {

}`,
    },
    python: {
      functionName: 'can_jump',
      starterCode: `def can_jump(nums):
    pass`,
    },
    typescript: {
      functionName: 'canJump',
      starterCode: `function canJump(nums: number[]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: [[2, 3, 1, 1, 4]], expected: true },
    { input: [[3, 2, 1, 0, 4]], expected: false },
    { input: [[0]], expected: true },
    { input: [[1]], expected: true },
    { input: [[2, 0, 0]], expected: true },
    { input: [[1, 0, 1, 0]], expected: false },
    { input: [[2, 5, 0, 0]], expected: true },
  ],

  solutions: [
    {
      name: 'Greedy Forward Pass',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Track the **furthest index reachable so far**. For each index \`i\`, if \`i\` exceeds that furthest, we're stuck — return false. Otherwise update the furthest using \`i + nums[i]\`. If the furthest ever reaches the last index, return true.

This is the classic forward-greedy approach — no DP table needed.`,
      code: {
        javascript: `function canJump(nums) {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false;
    if (i + nums[i] > furthest) furthest = i + nums[i];
    if (furthest >= nums.length - 1) return true;
  }
  return true;
}`,
        python: `def can_jump(nums):
    furthest = 0
    for i, n in enumerate(nums):
        if i > furthest:
            return False
        furthest = max(furthest, i + n)
        if furthest >= len(nums) - 1:
            return True
    return True`,
        typescript: `function canJump(nums: number[]): boolean {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false;
    if (i + nums[i] > furthest) furthest = i + nums[i];
    if (furthest >= nums.length - 1) return true;
  }
  return true;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
  neetcodeUrl: 'https://neetcode.io/problems/jump-game',
};
