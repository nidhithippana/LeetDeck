import type { Problem } from '../../types';

export const combinationSum: Problem = {
  id: 'combination-sum',
  title: 'Combination Sum',
  difficulty: 'Medium',
  topic: 'Backtracking',
  order: 55,

  prompt: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`.

The **same number may be chosen unlimited times**. Two combinations are unique if the frequency of any of the chosen numbers is different.

Return the combinations in any order.`,

  examples: [
    { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
    { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
    { input: 'candidates = [2], target = 1', output: '[]' },
  ],

  constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', '1 <= target <= 40'],

  languages: {
    javascript: {
      functionName: 'combinationSum',
      starterCode: `function combinationSum(candidates, target) {

}`,
    },
    python: {
      functionName: 'combination_sum',
      starterCode: `def combination_sum(candidates, target):
    pass`,
    },
    typescript: {
      functionName: 'combinationSum',
      starterCode: `function combinationSum(candidates: number[], target: number): number[][] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]], unordered: true },
    { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], unordered: true },
    { input: [[2], 1], expected: [], unordered: true },
    { input: [[1], 2], expected: [[1, 1]], unordered: true },
    { input: [[2, 3, 5], 10], expected: [[2, 2, 2, 2, 2], [2, 2, 3, 3], [2, 3, 5], [5, 5]], unordered: true },
  ],

  solutions: [
    {
      name: 'Backtracking with Index',
      timeComplexity: 'O(2^t)',
      spaceComplexity: 'O(t) recursion depth',
      explanation: `Standard backtracking. For each index \`i\`, the choice is: either skip \`candidates[i]\` and move to \`i + 1\`, or take it (subtract from target) and stay at \`i\` (since we can reuse). When target hits 0, record a copy of the current combination. Skip past index when target drops below 0.

Passing the start index forward (instead of always trying all candidates) is what prevents duplicate combinations.`,
      code: {
        javascript: `function combinationSum(candidates, target) {
  const result = [];
  const dfs = (i, current, remaining) => {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    if (i >= candidates.length || remaining < 0) return;
    // Take candidates[i]
    current.push(candidates[i]);
    dfs(i, current, remaining - candidates[i]);
    current.pop();
    // Skip
    dfs(i + 1, current, remaining);
  };
  dfs(0, [], target);
  return result;
}`,
        python: `def combination_sum(candidates, target):
    result = []
    def dfs(i, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        if i >= len(candidates) or remaining < 0:
            return
        current.append(candidates[i])
        dfs(i, current, remaining - candidates[i])
        current.pop()
        dfs(i + 1, current, remaining)
    dfs(0, [], target)
    return result`,
        typescript: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const dfs = (i: number, current: number[], remaining: number): void => {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    if (i >= candidates.length || remaining < 0) return;
    current.push(candidates[i]);
    dfs(i, current, remaining - candidates[i]);
    current.pop();
    dfs(i + 1, current, remaining);
  };
  dfs(0, [], target);
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
  neetcodeUrl: 'https://neetcode.io/problems/combination-target-sum',
};
