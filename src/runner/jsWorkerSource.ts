/**
 * Shared body of the JS test-runner Web Worker.
 *
 * Defines `TreeNode` and `ListNode` globally so problems requiring those
 * data structures can have user code that just calls `new TreeNode(...)` /
 * `head.next` etc. (matching the LeetCode convention).
 *
 * Used by both the JavaScript runner directly and the TypeScript runner
 * (sucrase strips TS types, then ships the resulting JS through this body).
 */
export const JS_WORKER_SOURCE = `
// ─── Data structure helpers (always present in user scope) ────────────────

class TreeNode {
  constructor(val, left, right) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

class GraphNode {
  constructor(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

// adjList[i] = neighbors of the (1-indexed) node with val (i+1). LeetCode convention.
function adjListToGraph(adjList) {
  if (!adjList || adjList.length === 0) return null;
  const nodes = adjList.map((_, i) => new GraphNode(i + 1));
  for (let i = 0; i < adjList.length; i++) {
    nodes[i].neighbors = adjList[i].map((v) => nodes[v - 1]);
  }
  return nodes[0];
}

function graphToAdjList(root) {
  if (!root) return [];
  const visited = new Set();
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    for (const n of node.neighbors) stack.push(n);
  }
  // Emit neighbors sorted by val, indexed by val (1-indexed).
  const sorted = [...visited].sort((a, b) => a.val - b.val);
  return sorted.map((n) => n.neighbors.map((x) => x.val).sort((a, b) => a - b));
}

function arrayToTree(arr) {
  if (!arr || arr.length === 0 || arr[0] == null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] != null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] != null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}

function arrayToList(arr) {
  if (!arr || arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return head;
}

function arrayToListWithCycle(spec) {
  // spec is [array, pos]; pos = -1 means no cycle
  if (!Array.isArray(spec) || spec.length === 0) return null;
  const arr = spec[0];
  const pos = spec.length > 1 ? spec[1] : -1;
  if (!arr || arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  const nodes = [head];
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
    nodes.push(cur);
  }
  if (pos >= 0 && pos < nodes.length) {
    cur.next = nodes[pos];
  }
  return head;
}

function listToArray(head) {
  const result = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

function transformInput(value, kind) {
  if (kind === 'tree') return arrayToTree(value);
  if (kind === 'list') return arrayToList(value);
  if (kind === 'list-with-cycle') return arrayToListWithCycle(value);
  if (kind === 'list-array') return (value || []).map(arrayToList);
  if (kind === 'graph') return adjListToGraph(value);
  return value;
}

function transformOutput(value, kind) {
  if (kind === 'tree') return treeToArray(value);
  if (kind === 'list') return listToArray(value);
  if (kind === 'graph') return graphToAdjList(value);
  return value;
}

// ─── Equality + normalization ─────────────────────────────────────────────

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === 'object') {
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

function normalize(v) {
  if (!Array.isArray(v)) return v;
  return v.map(normalize)
          .map(x => JSON.stringify(x))
          .sort()
          .map(s => JSON.parse(s));
}

// ─── Test driver ──────────────────────────────────────────────────────────

self.onmessage = (e) => {
  const { code, functionName, tests, inputKinds, outputKind, isClassDesign, classTests } = e.data;
  const kinds = inputKinds || [];

  let fn;
  try {
    fn = new Function(code + '\\n;return ' + functionName + ';')();
    if (typeof fn !== 'function') {
      self.postMessage({
        ok: false,
        error: 'Could not find ' + (isClassDesign ? 'class' : 'function') + ' "' + functionName + '". Define it at the top level.'
      });
      return;
    }
  } catch (err) {
    self.postMessage({
      ok: false,
      error: 'Compile error: ' + (err && err.message ? err.message : String(err))
    });
    return;
  }

  // Class-based test mode
  if (isClassDesign) {
    const Klass = fn;
    const results = classTests.map((t) => {
      const start = performance.now();
      try {
        const inst = new Klass(...(t.args[0] || []));
        const actual = [null]; // constructor "returns" null
        for (let i = 1; i < t.ops.length; i++) {
          const method = inst[t.ops[i]];
          if (typeof method !== 'function') {
            throw new Error('Class has no method "' + t.ops[i] + '"');
          }
          // Sentinel: __USE_PREV__ in args means "feed the previous op's result here"
          const args = (t.args[i] || []).map((a) => a === '__USE_PREV__' ? actual[i - 1] : a);
          const r = method.apply(inst, args);
          actual.push(r === undefined ? null : r);
        }
        // Sentinel: __SKIP__ in expected means "don't check this position"
        const pass = actual.length === t.expected.length &&
          actual.every((a, i) => t.expected[i] === '__SKIP__' || deepEqual(a, t.expected[i]));
        return {
          pass,
          input: [t.ops, t.args],
          expected: t.expected,
          actual: actual,
          durationMs: Math.round((performance.now() - start) * 100) / 100,
        };
      } catch (err) {
        return {
          pass: false,
          input: [t.ops, t.args],
          expected: t.expected,
          actual: null,
          error: err && err.message ? err.message : String(err),
          durationMs: Math.round((performance.now() - start) * 100) / 100,
        };
      }
    });
    self.postMessage({ ok: true, results });
    return;
  }

  const results = tests.map((t) => {
    const start = performance.now();
    try {
      const inputCopy = JSON.parse(JSON.stringify(t.input));
      const transformedArgs = inputCopy.map((v, i) =>
        transformInput(v, kinds[i] || 'primitive')
      );
      const rawActual = fn.apply(null, transformedArgs);
      // Support LeetCode's "modify in-place, void return" signature: when the user
      // returns undefined and the expected output is a non-primitive, take the
      // first input arg (post-transform) as the result.
      const effective = (rawActual === undefined && transformedArgs.length > 0 && outputKind && outputKind !== 'primitive')
        ? transformedArgs[0]
        : rawActual;
      const actual = transformOutput(effective, outputKind || 'primitive');
      const exp = t.unordered ? normalize(t.expected) : t.expected;
      const act = t.unordered ? normalize(actual) : actual;
      return {
        pass: deepEqual(act, exp),
        input: t.input,
        expected: t.expected,
        actual: actual,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
      };
    } catch (err) {
      return {
        pass: false,
        input: t.input,
        expected: t.expected,
        actual: null,
        error: err && err.message ? err.message : String(err),
        durationMs: Math.round((performance.now() - start) * 100) / 100,
      };
    }
  });

  self.postMessage({ ok: true, results });
};
`;
