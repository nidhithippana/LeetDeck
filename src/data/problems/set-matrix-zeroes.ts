import type { Problem } from '../../types';

export const setMatrixZeroes: Problem = {
  id: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  difficulty: 'Medium',
  topic: 'Math & Geometry',
  order: 51,

  prompt: `Given an \`m × n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`. You must do it **in place**.

Follow up: try to do it in \`O(1)\` extra space (besides the input).`,

  examples: [
    { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' },
    { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' },
  ],

  constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200'],

  languages: {
    javascript: {
      functionName: 'setZeroes',
      starterCode: `function setZeroes(matrix) {
  // Modify in place
}`,
    },
    python: {
      functionName: 'set_zeroes',
      starterCode: `def set_zeroes(matrix):
    # Modify in place
    pass`,
    },
    typescript: {
      functionName: 'setZeroes',
      starterCode: `function setZeroes(matrix: number[][]): void {
  // Modify in place
}`,
    },
  },

  // The runner's in-place fallback isn't 2D-array aware; ask the user to
  // return the matrix at the end. (Solutions do this.)
  tests: [
    { input: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
    { input: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    { input: [[[1]]], expected: [[1]] },
    { input: [[[0]]], expected: [[0]] },
    { input: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
  ],

  solutions: [
    {
      name: 'In-place using first row + column as markers',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(1)',
      explanation: `Use the first row and first column themselves to record which rows/columns should be zeroed. Two booleans remember whether the original first row or first column had any zeros (so we can zero them last without losing the marker bits).`,
      code: {
        javascript: `function setZeroes(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  for (let c = 0; c < cols; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstRowZero) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`,
        python: `def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if first_row_zero:
        for c in range(cols):
            matrix[0][c] = 0
    if first_col_zero:
        for r in range(rows):
            matrix[r][0] = 0
    return matrix`,
        typescript: `function setZeroes(matrix: number[][]): number[][] {
  const rows = matrix.length, cols = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  for (let c = 0; c < cols; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstRowZero) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/',
  neetcodeUrl: 'https://neetcode.io/problems/set-zeroes-in-matrix',
};
