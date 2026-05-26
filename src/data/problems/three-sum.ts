import type { Problem } from '../../types';

export const threeSum: Problem = {
  id: 'three-sum',
  title: '3Sum',
  difficulty: 'Medium',
  topic: 'Two Pointers',
  order: 15,

  prompt: `Given an integer array \`nums\`, return all unique triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets. Each triplet should be returned sorted in ascending order. The order of triplets in the outer list doesn't matter.`,

  examples: [
    { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
    { input: 'nums = [0,1,1]', output: '[]', explanation: 'No three sum to 0.' },
    { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
  ],

  constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],

  languages: {
    javascript: {
      functionName: 'threeSum',
      starterCode: `function threeSum(nums) {

}`,
    },
    python: {
      functionName: 'three_sum',
      starterCode: `def three_sum(nums):
    pass`,
    },
    typescript: {
      functionName: 'threeSum',
      starterCode: `function threeSum(nums: number[]): number[][] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], unordered: true },
    { input: [[0, 1, 1]], expected: [], unordered: true },
    { input: [[0, 0, 0]], expected: [[0, 0, 0]], unordered: true },
    { input: [[]], expected: [], unordered: true },
    { input: [[-2, 0, 0, 2, 2]], expected: [[-2, 0, 2]], unordered: true },
    { input: [[1, 2, -2, -1]], expected: [], unordered: true },
  ],

  solutions: [
    {
      name: 'Sort + Two Pointers',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: `Sort first. For each index \`i\`, run a two-pointer scan on the rest of the array looking for pairs that sum to \`-nums[i]\`. Skip duplicates at every level (the \`i\` pivot, and both pointers after a match) to avoid duplicate triplets.`,
      code: {
        javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      }
    }
  }
  return result;
}`,
        python: `def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                result.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                while l < r and nums[r] == nums[r - 1]:
                    r -= 1
                l += 1
                r -= 1
    return result`,
        typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      }
    }
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/3sum/',
  neetcodeUrl: 'https://neetcode.io/problems/three-integer-sum',
};
