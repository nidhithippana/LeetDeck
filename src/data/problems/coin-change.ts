import type { Problem } from '../../types';

export const coinChange: Problem = {
  id: 'coin-change',
  title: 'Coin Change',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 25,

  prompt: `You are given an integer array \`coins\` representing coins of different denominations, and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an **infinite number** of each kind of coin.`,

  examples: [
    { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
    { input: 'coins = [2], amount = 3', output: '-1' },
    { input: 'coins = [1], amount = 0', output: '0' },
  ],

  constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],

  languages: {
    javascript: {
      functionName: 'coinChange',
      starterCode: `function coinChange(coins, amount) {

}`,
    },
    python: {
      functionName: 'coin_change',
      starterCode: `def coin_change(coins, amount):
    pass`,
    },
    typescript: {
      functionName: 'coinChange',
      starterCode: `function coinChange(coins: number[], amount: number): number {
  return -1;
}`,
    },
  },

  tests: [
    { input: [[1, 2, 5], 11], expected: 3 },
    { input: [[2], 3], expected: -1 },
    { input: [[1], 0], expected: 0 },
    { input: [[1], 1], expected: 1 },
    { input: [[1, 3, 4, 5], 7], expected: 2 },
    { input: [[186, 419, 83, 408], 6249], expected: 20 },
  ],

  solutions: [
    {
      name: 'Bottom-up DP',
      timeComplexity: 'O(amount · n)',
      spaceComplexity: 'O(amount)',
      explanation: `\`dp[a]\` = fewest coins needed to make amount \`a\`. For each amount, try every coin: \`dp[a] = min(dp[a - coin] + 1)\` across all coins where \`coin <= a\`. Initialize to a sentinel (\`amount + 1\`) so we can detect impossibility.`,
      code: {
        javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
        python: `def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] > amount else dp[amount]`,
        typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
  neetcodeUrl: 'https://neetcode.io/problems/coin-change',
};
