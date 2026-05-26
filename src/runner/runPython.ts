import type { InputKind, TestCase, TestRunResult } from '../types';

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

const INIT_TIMEOUT_MS = 60_000;
const RUN_TIMEOUT_MS = 5000;

const PYTHON_WORKER_SOURCE = `
importScripts("${PYODIDE_INDEX_URL}pyodide.js");

let pyodide;
const ready = (async () => {
  pyodide = await loadPyodide({ indexURL: "${PYODIDE_INDEX_URL}" });

  // Inject TreeNode + ListNode classes and array<->node helpers so problems
  // can use them just like LeetCode's hidden definitions.
  pyodide.runPython([
    "from collections import deque",
    "",
    "class TreeNode:",
    "    def __init__(self, val=0, left=None, right=None):",
    "        self.val = val",
    "        self.left = left",
    "        self.right = right",
    "",
    "class ListNode:",
    "    def __init__(self, val=0, next=None):",
    "        self.val = val",
    "        self.next = next",
    "",
    "class GraphNode:",
    "    def __init__(self, val=0, neighbors=None):",
    "        self.val = val",
    "        self.neighbors = neighbors if neighbors is not None else []",
    "",
    "def __adj_list_to_graph(adj):",
    "    if not adj:",
    "        return None",
    "    nodes = [GraphNode(i + 1) for i in range(len(adj))]",
    "    for i, neigh in enumerate(adj):",
    "        nodes[i].neighbors = [nodes[v - 1] for v in neigh]",
    "    return nodes[0]",
    "",
    "def __graph_to_adj_list(root):",
    "    if not root:",
    "        return []",
    "    seen = {}",
    "    def collect(n):",
    "        if id(n) in seen:",
    "            return",
    "        seen[id(n)] = n",
    "        for m in n.neighbors:",
    "            collect(m)",
    "    collect(root)",
    "    nodes_sorted = sorted(seen.values(), key=lambda n: n.val)",
    "    return [sorted(m.val for m in n.neighbors) for n in nodes_sorted]",
    "",
    "def __array_to_tree(arr):",
    "    if not arr or arr[0] is None:",
    "        return None",
    "    root = TreeNode(arr[0])",
    "    q = deque([root])",
    "    i = 1",
    "    while q and i < len(arr):",
    "        node = q.popleft()",
    "        if i < len(arr) and arr[i] is not None:",
    "            node.left = TreeNode(arr[i])",
    "            q.append(node.left)",
    "        i += 1",
    "        if i < len(arr) and arr[i] is not None:",
    "            node.right = TreeNode(arr[i])",
    "            q.append(node.right)",
    "        i += 1",
    "    return root",
    "",
    "def __tree_to_array(root):",
    "    if not root:",
    "        return []",
    "    result = []",
    "    q = deque([root])",
    "    while q:",
    "        node = q.popleft()",
    "        if node is None:",
    "            result.append(None)",
    "        else:",
    "            result.append(node.val)",
    "            q.append(node.left)",
    "            q.append(node.right)",
    "    while result and result[-1] is None:",
    "        result.pop()",
    "    return result",
    "",
    "def __array_to_list(arr):",
    "    if not arr:",
    "        return None",
    "    head = ListNode(arr[0])",
    "    cur = head",
    "    for v in arr[1:]:",
    "        cur.next = ListNode(v)",
    "        cur = cur.next",
    "    return head",
    "",
    "def __array_to_list_with_cycle(spec):",
    "    if not spec or len(spec) == 0:",
    "        return None",
    "    arr = spec[0]",
    "    pos = spec[1] if len(spec) > 1 else -1",
    "    if not arr:",
    "        return None",
    "    head = ListNode(arr[0])",
    "    nodes = [head]",
    "    cur = head",
    "    for v in arr[1:]:",
    "        cur.next = ListNode(v)",
    "        cur = cur.next",
    "        nodes.append(cur)",
    "    if 0 <= pos < len(nodes):",
    "        cur.next = nodes[pos]",
    "    return head",
    "",
    "def __list_to_array(head):",
    "    result = []",
    "    while head:",
    "        result.append(head.val)",
    "        head = head.next",
    "    return result",
    "",
    "def __transform_input(v, kind):",
    "    if kind == 'tree': return __array_to_tree(v)",
    "    if kind == 'list': return __array_to_list(v)",
    "    if kind == 'list-with-cycle': return __array_to_list_with_cycle(v)",
    "    if kind == 'list-array': return [__array_to_list(x) for x in (v or [])]",
    "    if kind == 'graph': return __adj_list_to_graph(v)",
    "    return v",
    "",
    "def __transform_output(v, kind):",
    "    if kind == 'tree': return __tree_to_array(v)",
    "    if kind == 'list': return __list_to_array(v)",
    "    if kind == 'graph': return __graph_to_adj_list(v)",
    "    return v",
  ].join("\\n"));

  self.postMessage({ type: 'ready' });
})();

self.onmessage = async (e) => {
  if (e.data.type !== 'run') return;
  await ready;
  const { code, functionName, tests, inputKinds, outputKind, isClassDesign, classTests } = e.data;

  try {
    pyodide.runPython(code);
  } catch (err) {
    self.postMessage({
      type: 'done',
      payload: { ok: false, error: 'Python error: ' + (err.message || String(err)) },
    });
    return;
  }

  const fnExists = pyodide.runPython("'" + functionName + "' in dir()");
  if (!fnExists) {
    self.postMessage({
      type: 'done',
      payload: {
        ok: false,
        error: 'Could not find ' + ('isClassDesign' && isClassDesign ? 'class' : 'function') + ' "' + functionName + '". Define it at the top level.',
      },
    });
    return;
  }

  // Class-based test mode
  if (isClassDesign) {
    pyodide.runPython([
      "import json",
      "def __leetdeck_run_class(ops_json, args_json):",
      "    ops = json.loads(ops_json)",
      "    args_list = json.loads(args_json)",
      "    inst = " + functionName + "(*args_list[0])",
      "    out = [None]",
      "    for i in range(1, len(ops)):",
      "        method = getattr(inst, ops[i])",
      "        # Sentinel: __USE_PREV__ in args means feed the previous op's result",
      "        args = [out[i - 1] if a == '__USE_PREV__' else a for a in args_list[i]]",
      "        r = method(*args)",
      "        out.append(r)",
      "    return json.dumps(out, default=lambda o: list(o) if hasattr(o, '__iter__') else str(o))",
    ].join("\\n"));
    const runClass = pyodide.globals.get('__leetdeck_run_class');
    const cResults = classTests.map((t) => {
      const start = performance.now();
      try {
        const actualJson = runClass(JSON.stringify(t.ops), JSON.stringify(t.args));
        const actual = JSON.parse(actualJson);
        return {
          pass: undefined,
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
    runClass.destroy();
    self.postMessage({ type: 'done', payload: { ok: true, results: cResults } });
    return;
  }

  // Per-call helper that applies the input/output transforms and JSON-serializes.
  pyodide.runPython([
    "import json",
    "def __leetdeck_run(args_json, kinds_json, output_kind):",
    "    args = json.loads(args_json)",
    "    kinds = json.loads(kinds_json)",
    "    transformed = []",
    "    for i, v in enumerate(args):",
    "        k = kinds[i] if i < len(kinds) else 'primitive'",
    "        transformed.append(__transform_input(v, k))",
    "    result = " + functionName + "(*transformed)",
    "    if result is None and transformed and output_kind != 'primitive':",
    "        result = transformed[0]",
    "    result = __transform_output(result, output_kind)",
    "    return json.dumps(result, default=lambda o: list(o) if hasattr(o, '__iter__') else str(o))",
  ].join("\\n"));

  const runFn = pyodide.globals.get('__leetdeck_run');
  const kindsJson = JSON.stringify(inputKinds || []);
  const outputKindStr = outputKind || 'primitive';

  const results = tests.map((t) => {
    const start = performance.now();
    try {
      const actualJson = runFn(JSON.stringify(t.input), kindsJson, outputKindStr);
      const actual = JSON.parse(actualJson);
      return {
        pass: undefined,
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

  runFn.destroy();
  self.postMessage({ type: 'done', payload: { ok: true, results } });
};
`;

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === 'object') {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const ak = Object.keys(ao);
    const bk = Object.keys(bo);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!deepEqual(ao[k], bo[k])) return false;
    return true;
  }
  return false;
}

function normalize(v: unknown): unknown {
  if (!Array.isArray(v)) return v;
  return v
    .map(normalize)
    .map((x) => JSON.stringify(x))
    .sort()
    .map((s) => JSON.parse(s));
}

let workerInstance: Worker | null = null;
let workerReady: Promise<Worker> | null = null;

function getWorker(): Promise<Worker> {
  if (workerInstance) return Promise.resolve(workerInstance);
  if (workerReady) return workerReady;

  workerReady = new Promise((resolve, reject) => {
    const blob = new Blob([PYTHON_WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const w = new Worker(url);
    URL.revokeObjectURL(url);

    const initTimeout = window.setTimeout(() => {
      w.terminate();
      workerInstance = null;
      workerReady = null;
      reject(new Error(`Pyodide failed to initialize within ${INIT_TIMEOUT_MS}ms`));
    }, INIT_TIMEOUT_MS);

    w.onmessage = (e: MessageEvent) => {
      if (e.data?.type === 'ready') {
        window.clearTimeout(initTimeout);
        workerInstance = w;
        resolve(w);
      }
    };

    w.onerror = (e) => {
      window.clearTimeout(initTimeout);
      workerInstance = null;
      workerReady = null;
      reject(new Error(e.message || 'Python worker error'));
    };
  });

  return workerReady;
}

export async function runPython(
  code: string,
  functionName: string,
  tests: TestCase[],
  inputKinds: InputKind[] = [],
  outputKind: InputKind = 'primitive',
  isClassDesign = false,
  classTests: import('../types').ClassTestCase[] = []
): Promise<TestRunResult> {
  let worker: Worker;
  try {
    worker = await getWorker();
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return new Promise((resolve) => {
    let done = false;

    const timeout = window.setTimeout(() => {
      if (done) return;
      done = true;
      worker.terminate();
      workerInstance = null;
      workerReady = null;
      resolve({
        ok: false,
        error: `Python execution timed out after ${RUN_TIMEOUT_MS}ms.`,
      });
    }, RUN_TIMEOUT_MS);

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'done' || done) return;
      done = true;
      window.clearTimeout(timeout);
      worker.removeEventListener('message', handleMessage);

      const payload = e.data.payload as TestRunResult;
      if (!payload.ok) {
        resolve(payload);
        return;
      }

      const compared = payload.results.map((r, i) => {
        if (r.error) return r;
        if (isClassDesign) {
          const t = classTests[i];
          const actualArr = r.actual as unknown[];
          const expectedArr = t.expected;
          const pass =
            Array.isArray(actualArr) &&
            actualArr.length === expectedArr.length &&
            actualArr.every((a, j) => expectedArr[j] === '__SKIP__' || deepEqual(a, expectedArr[j]));
          return { ...r, pass };
        }
        const t = tests[i];
        const exp = t.unordered ? normalize(t.expected) : t.expected;
        const act = t.unordered ? normalize(r.actual) : r.actual;
        return { ...r, pass: deepEqual(act, exp) };
      });
      resolve({ ok: true, results: compared });
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({
      type: 'run',
      code,
      functionName,
      tests,
      inputKinds,
      outputKind,
      isClassDesign,
      classTests,
    });
  });
}

export function isPythonReady(): boolean {
  return workerInstance !== null;
}
