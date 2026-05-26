import type { ClassTestCase, InputKind, TestCase, TestRunResult } from '../types';
import { runJavaScript } from './runJs';

export async function runTypeScript(
  code: string,
  functionName: string,
  tests: TestCase[],
  inputKinds: InputKind[] = [],
  outputKind: InputKind = 'primitive',
  isClassDesign = false,
  classTests: ClassTestCase[] = []
): Promise<TestRunResult> {
  let jsCode: string;
  try {
    const { transform } = await import('sucrase');
    jsCode = transform(code, { transforms: ['typescript'] }).code;
  } catch (err) {
    return {
      ok: false,
      error:
        'TypeScript compile error: ' +
        (err instanceof Error ? err.message : String(err)),
    };
  }
  return runJavaScript(jsCode, functionName, tests, inputKinds, outputKind, isClassDesign, classTests);
}
