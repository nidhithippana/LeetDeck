import type { ClassTestCase, InputKind, Language, TestCase, TestRunResult } from '../types';
import { runJavaScript } from './runJs';
import { runTypeScript } from './runTs';
import { runPython } from './runPython';

export { isPythonReady } from './runPython';

export function runTests(
  language: Language,
  code: string,
  functionName: string,
  tests: TestCase[],
  inputKinds: InputKind[] = [],
  outputKind: InputKind = 'primitive',
  isClassDesign = false,
  classTests: ClassTestCase[] = []
): Promise<TestRunResult> {
  switch (language) {
    case 'javascript':
      return runJavaScript(code, functionName, tests, inputKinds, outputKind, isClassDesign, classTests);
    case 'typescript':
      return runTypeScript(code, functionName, tests, inputKinds, outputKind, isClassDesign, classTests);
    case 'python':
      return runPython(code, functionName, tests, inputKinds, outputKind, isClassDesign, classTests);
  }
}
