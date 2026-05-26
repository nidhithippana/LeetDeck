import type { Problem } from '../../types';

export const rotateImage: Problem = {
  id: 'rotate-image',
  title: 'Rotate Image',
  difficulty: 'Medium',
  topic: 'Math & Geometry',
  order: 53,

  prompt: `You are given an \`n × n\` 2D \`matrix\` representing an image. Rotate the image by **90 degrees (clockwise)**.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **Do not** allocate another 2D matrix and do the rotation.

(For our test runner: return the matrix at the end after the in-place rotation.)`,

  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
    { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
  ],

  constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20'],

  languages: {
    javascript: {
      functionName: 'rotate',
      starterCode: `function rotate(matrix) {

}`,
    },
    python: {
      functionName: 'rotate',
      starterCode: `def rotate(matrix):
    pass`,
    },
    typescript: {
      functionName: 'rotate',
      starterCode: `function rotate(matrix: number[][]): number[][] {
  return matrix;
}`,
    },
  },

  tests: [
    { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
    {
      input: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
      expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
    },
    { input: [[[1]]], expected: [[1]] },
    { input: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
  ],

  solutions: [
    {
      name: 'Transpose + Reverse Rows',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: `Two simple in-place passes:
1. **Transpose** the matrix (swap matrix[i][j] with matrix[j][i] for i < j).
2. **Reverse** each row.

The composition is a 90° clockwise rotation. Way cleaner than computing rotated coordinates directly.`,
      code: {
        javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
  return matrix;
}`,
        python: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
    return matrix`,
        typescript: `function rotate(matrix: number[][]): number[][] {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
  return matrix;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
  neetcodeUrl: 'https://neetcode.io/problems/rotate-matrix',
};
