import type { Problem } from '../../types';

export const spiralMatrix: Problem = {
  id: 'spiral-matrix',
  title: 'Spiral Matrix',
  difficulty: 'Medium',
  topic: 'Math & Geometry',
  order: 52,

  prompt: `Given an \`m × n\` \`matrix\`, return all elements of the matrix in **spiral order**.

The spiral starts at the top-left corner, goes right across the top, then down the right side, then left across the bottom, then up the left side, then inward, and so on.`,

  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
    { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
  ],

  constraints: ['1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],

  languages: {
    javascript: {
      functionName: 'spiralOrder',
      starterCode: `function spiralOrder(matrix) {

}`,
    },
    python: {
      functionName: 'spiral_order',
      starterCode: `def spiral_order(matrix):
    pass`,
    },
    typescript: {
      functionName: 'spiralOrder',
      starterCode: `function spiralOrder(matrix: number[][]): number[] {
  return [];
}`,
    },
  },

  tests: [
    { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
    { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
    { input: [[[1]]], expected: [1] },
    { input: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3] },
    { input: [[[1, 2, 3]]], expected: [1, 2, 3] },
  ],

  solutions: [
    {
      name: 'Shrinking Boundaries',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(1)',
      explanation: `Maintain four boundaries: \`top\`, \`bottom\`, \`left\`, \`right\`. Walk: top row left→right, right column top→bottom, bottom row right→left, left column bottom→top. Shrink the boundary inward after each side. Check that you haven't crossed before doing the second-pair walks (handles single-row/column edge cases).`,
      code: {
        javascript: `function spiralOrder(matrix) {
  const result = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}`,
        python: `def spiral_order(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    return result`,
        typescript: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
  neetcodeUrl: 'https://neetcode.io/problems/spiral-matrix',
};
