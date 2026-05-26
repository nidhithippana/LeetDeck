/**
 * Copy this file to add a new problem.
 *
 * 1. Rename file: `problem-slug.ts`
 * 2. Rename export: `problemSlug`
 * 3. Fill in every field (JS + Python + TS)
 * 4. Add the import + entry in `src/data/problems.ts`
 *
 * Prompt formatting: a tiny markdown subset is supported
 *   **bold**, `code`, numbered lists (1. 2. 3.)
 *
 * Python convention: snake_case function names.
 * TypeScript: same name as JS, with type annotations.
 */
import type { Problem } from '../../types';

export const _template: Problem = {
  id: 'problem-slug',
  title: 'Problem Title',
  difficulty: 'Easy', // 'Easy' | 'Medium' | 'Hard'
  topic: 'Arrays & Hashing',
  order: 999,

  prompt: `Describe the problem in 1–3 short paragraphs.`,

  examples: [
    { input: 'nums = [...]', output: '...', explanation: 'optional' },
  ],

  constraints: ['1 <= nums.length <= 10^4'],

  languages: {
    javascript: {
      functionName: 'solve',
      starterCode: `function solve(nums) {

}`,
    },
    python: {
      functionName: 'solve',
      starterCode: `def solve(nums):
    pass`,
    },
    typescript: {
      functionName: 'solve',
      starterCode: `function solve(nums: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[1, 2, 3]], expected: 6 },
    // { input: [...], expected: [...], unordered: true }, // for order-insensitive results
  ],

  solutions: [
    {
      name: 'Optimal',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Plain-English walkthrough of the approach. Why it works.`,
      code: {
        javascript: `function solve(nums) {
  // canonical JS solution
}`,
        python: `def solve(nums):
    pass  # canonical Python solution`,
        typescript: `function solve(nums: number[]): number {
  return 0; // canonical TS solution
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/...',
  neetcodeUrl: 'https://neetcode.io/problems/...',
};
