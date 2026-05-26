import type { Problem } from '../../types';

export const containerWithMostWater: Problem = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  difficulty: 'Medium',
  topic: 'Two Pointers',
  order: 14,

  prompt: `Given an integer array \`height\` of length \`n\`, find two lines that together with the x-axis form a container that holds the most water.

Return the maximum amount of water a container can store.

Notice: you may not slant the container.`,

  examples: [
    { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The lines at index 1 (height 8) and 8 (height 7) form a container of width 7 and bounded height 7 → area 49.' },
    { input: 'height = [1,1]', output: '1' },
  ],

  constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],

  languages: {
    javascript: {
      functionName: 'maxArea',
      starterCode: `function maxArea(height) {

}`,
    },
    python: {
      functionName: 'max_area',
      starterCode: `def max_area(height):
    pass`,
    },
    typescript: {
      functionName: 'maxArea',
      starterCode: `function maxArea(height: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
    { input: [[1, 1]], expected: 1 },
    { input: [[4, 3, 2, 1, 4]], expected: 16 },
    { input: [[1, 2, 1]], expected: 2 },
    { input: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
  ],

  solutions: [
    {
      name: 'Two Pointers',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Start with the widest possible container (l=0, r=n-1). Move whichever pointer has the shorter line inward — the only chance of finding a larger area is by raising the shorter wall, since width is decreasing. Track the max area seen.`,
      code: {
        javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const area = (r - l) * Math.min(height[l], height[r]);
    if (area > best) best = area;
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`,
        python: `def max_area(height):
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        area = (r - l) * min(height[l], height[r])
        if area > best:
            best = area
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best`,
        typescript: `function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const area = (r - l) * Math.min(height[l], height[r]);
    if (area > best) best = area;
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
  neetcodeUrl: 'https://neetcode.io/problems/max-water-container',
};
