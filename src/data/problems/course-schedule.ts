import type { Problem } from '../../types';

export const courseSchedule: Problem = {
  id: 'course-schedule',
  title: 'Course Schedule',
  difficulty: 'Medium',
  topic: 'Graphs',
  order: 49,

  prompt: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a, b]\` indicates that you **must take course b first** if you want to take course a.

Return \`true\` if you can finish all courses; otherwise return \`false\`.

(Equivalent to: detect whether the prerequisite graph has any cycles.)`,

  examples: [
    { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take 0 first, then 1.' },
    { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Cycle.' },
  ],

  constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'All pairs are unique.'],

  languages: {
    javascript: {
      functionName: 'canFinish',
      starterCode: `function canFinish(numCourses, prerequisites) {

}`,
    },
    python: {
      functionName: 'can_finish',
      starterCode: `def can_finish(num_courses, prerequisites):
    pass`,
    },
    typescript: {
      functionName: 'canFinish',
      starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: [2, [[1, 0]]], expected: true },
    { input: [2, [[1, 0], [0, 1]]], expected: false },
    { input: [1, []], expected: true },
    { input: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
    { input: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
    { input: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], expected: true },
  ],

  solutions: [
    {
      name: 'Topological Sort (Kahn\'s Algorithm)',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      explanation: `Build a graph and an in-degree count. Start with all courses that have in-degree 0 (no prerequisites). Process them, decrementing in-degree for their dependents; any dependent that hits 0 joins the queue. If we eventually process all \`numCourses\` courses, there's no cycle.`,
      code: {
        javascript: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    indeg[a]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let processed = 0;
  while (queue.length) {
    const c = queue.shift();
    processed++;
    for (const next of graph[c]) {
      if (--indeg[next] === 0) queue.push(next);
    }
  }
  return processed === numCourses;
}`,
        python: `def can_finish(num_courses, prerequisites):
    from collections import deque
    graph = [[] for _ in range(num_courses)]
    indeg = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a)
        indeg[a] += 1
    queue = deque(i for i in range(num_courses) if indeg[i] == 0)
    processed = 0
    while queue:
        c = queue.popleft()
        processed += 1
        for nxt in graph[c]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                queue.append(nxt)
    return processed == num_courses`,
        typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const indeg = new Array<number>(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    indeg[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let processed = 0;
  while (queue.length) {
    const c = queue.shift()!;
    processed++;
    for (const next of graph[c]) {
      if (--indeg[next] === 0) queue.push(next);
    }
  }
  return processed === numCourses;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
  neetcodeUrl: 'https://neetcode.io/problems/course-schedule',
};
