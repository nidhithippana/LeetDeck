import type { ClassTestCase, InputKind, TestCase, TestRunResult } from '../types';
import { JS_WORKER_SOURCE } from './jsWorkerSource';

const TIMEOUT_MS = 3000;

export function runJavaScript(
  code: string,
  functionName: string,
  tests: TestCase[],
  inputKinds: InputKind[] = [],
  outputKind: InputKind = 'primitive',
  isClassDesign = false,
  classTests: ClassTestCase[] = []
): Promise<TestRunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([JS_WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    let done = false;

    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    const timeout = window.setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      resolve({
        ok: false,
        error: `Execution timed out after ${TIMEOUT_MS}ms (infinite loop or expensive code?).`,
      });
    }, TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<TestRunResult>) => {
      if (done) return;
      done = true;
      window.clearTimeout(timeout);
      cleanup();
      resolve(e.data);
    };

    worker.onerror = (e) => {
      if (done) return;
      done = true;
      window.clearTimeout(timeout);
      cleanup();
      resolve({ ok: false, error: e.message || 'Worker error' });
    };

    worker.postMessage({
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
