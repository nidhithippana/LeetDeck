import type { Problem } from '../../types';

export const topKFrequent: Problem = {
  id: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  order: 12,

  prompt: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

Your algorithm must run in better than \`O(n log n)\` time (i.e., better than sorting).`,

  examples: [
    { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
    { input: 'nums = [1], k = 1', output: '[1]' },
  ],

  constraints: [
    '1 <= nums.length <= 10^5',
    'k is in the range [1, the number of unique elements in nums].',
    'The answer is guaranteed to be unique.',
  ],

  languages: {
    javascript: {
      functionName: 'topKFrequent',
      starterCode: `function topKFrequent(nums, k) {

}`,
    },
    python: {
      functionName: 'top_k_frequent',
      starterCode: `def top_k_frequent(nums, k):
    pass`,
    },
    typescript: {
      functionName: 'topKFrequent',
      starterCode: `function topKFrequent(nums: number[], k: number): number[] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], unordered: true },
    { input: [[1], 1], expected: [1], unordered: true },
    { input: [[1, 2], 2], expected: [1, 2], unordered: true },
    { input: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2], unordered: true },
    { input: [[5, 5, 5, 5], 1], expected: [5], unordered: true },
  ],

  solutions: [
    {
      name: 'Bucket Sort',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Count frequencies, then place each value into a bucket indexed by its frequency. Walk buckets from highest to lowest to gather \`k\` results. Linear time — no sorting needed.`,
      code: {
        javascript: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) buckets[count].push(val);

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const v of buckets[i]) {
      result.push(v);
      if (result.length === k) break;
    }
  }
  return result;
}`,
        python: `def top_k_frequent(nums, k):
    from collections import Counter
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, count in freq.items():
        buckets[count].append(val)
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for v in buckets[i]:
            result.append(v)
            if len(result) == k:
                return result
    return result`,
        typescript: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) buckets[count].push(val);

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const v of buckets[i]) {
      result.push(v);
      if (result.length === k) break;
    }
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
  neetcodeUrl: 'https://neetcode.io/problems/top-k-elements-in-list',
};
