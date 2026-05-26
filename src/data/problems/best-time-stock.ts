import type { Problem } from '../../types';

export const bestTimeStock: Problem = {
  id: 'best-time-stock',
  title: 'Best Time to Buy and Sell Stock',
  difficulty: 'Easy',
  topic: 'Sliding Window',
  order: 7,

  prompt: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on day \`i\`.

You want to maximize your profit by choosing **a single day to buy** one stock and choosing **a different day in the future to sell** it.

Return the maximum profit you can achieve. If you cannot achieve any profit, return \`0\`.`,

  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 5.' },
    { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Prices only fall — never profitable to transact.' },
  ],

  constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],

  languages: {
    javascript: {
      functionName: 'maxProfit',
      starterCode: `function maxProfit(prices) {

}`,
    },
    python: {
      functionName: 'max_profit',
      starterCode: `def max_profit(prices):
    pass`,
    },
    typescript: {
      functionName: 'maxProfit',
      starterCode: `function maxProfit(prices: number[]): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { input: [[7, 6, 4, 3, 1]], expected: 0 },
    { input: [[1, 2]], expected: 1 },
    { input: [[2, 4, 1]], expected: 2 },
    { input: [[3, 2, 6, 5, 0, 3]], expected: 4 },
  ],

  solutions: [
    {
      name: 'Min So Far',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Walk left-to-right. Track the lowest price seen so far. At each day, the best profit if you sell today is \`today - minSoFar\`. Keep the max of those across the array.`,
      code: {
        javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > best) best = p - minPrice;
  }
  return best;
}`,
        python: `def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > best:
            best = p - min_price
    return best`,
        typescript: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > best) best = p - minPrice;
  }
  return best;
}`,
      },
    },
    {
      name: 'Two Pointers (Sliding Window)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Same logic framed as buy/sell pointers. When the sell pointer finds a price lower than buy, jump buy forward to it (no point holding a worse position).`,
      code: {
        javascript: `function maxProfit(prices) {
  let l = 0, best = 0;
  for (let r = 1; r < prices.length; r++) {
    if (prices[r] < prices[l]) l = r;
    else best = Math.max(best, prices[r] - prices[l]);
  }
  return best;
}`,
        python: `def max_profit(prices):
    l, best = 0, 0
    for r in range(1, len(prices)):
        if prices[r] < prices[l]:
            l = r
        else:
            best = max(best, prices[r] - prices[l])
    return best`,
        typescript: `function maxProfit(prices: number[]): number {
  let l = 0, best = 0;
  for (let r = 1; r < prices.length; r++) {
    if (prices[r] < prices[l]) l = r;
    else best = Math.max(best, prices[r] - prices[l]);
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  neetcodeUrl: 'https://neetcode.io/problems/buy-and-sell-crypto',
};
