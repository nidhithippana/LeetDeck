import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { selectAll, indentSelection, indentMore, indentLess } from '@codemirror/commands';
import type { Language } from '../types';

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
};

/** Imperative handle exposed via ref — lets parents trigger format programmatically. */
export type CodeEditorHandle = {
  /** Re-indents the entire document using the active language's indentation rules. */
  format: () => void;
};

function languageExtension(lang: Language): Extension {
  if (lang === 'python') return python();
  if (lang === 'typescript') return javascript({ typescript: true });
  return javascript();
}

const fillHeightTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px' },
  '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  '.cm-content': { padding: '10px 0' },
  '.cm-gutters': { backgroundColor: '#0b1224', borderRight: '1px solid rgba(148, 163, 184, 0.15)' },
  '&.cm-focused': { outline: 'none' },
});

/**
 * Format the entire document using the active language's indent rules.
 * Works because `selectAll` then `indentSelection` re-applies the language's
 * indentation strategy to every line.
 */
function formatDocument(view: EditorView): boolean {
  selectAll(view);
  indentSelection(view);
  // Collapse the selection back to the original cursor — selecting-all is
  // visually disruptive, and the user just wanted clean indentation.
  view.dispatch({ selection: { anchor: view.state.selection.main.from } });
  return true;
}

const formatKeymap = keymap.of([
  // VS Code-style: Cmd+Shift+F on Mac, Ctrl+Shift+F on Win/Linux
  { key: 'Mod-Shift-f', preventDefault: true, run: formatDocument },
  // Also bind Tab / Shift+Tab to indent/dedent the current selection
  // (CodeMirror's defaults already do this, but being explicit guards
  // against future basicSetup changes.)
  { key: 'Tab', run: indentMore },
  { key: 'Shift-Tab', run: indentLess },
]);

const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor(
  { value, onChange, language },
  ref
) {
  const cmRef = useRef<ReactCodeMirrorRef | null>(null);

  const extensions = useMemo<Extension[]>(
    () => [languageExtension(language), fillHeightTheme, formatKeymap],
    [language]
  );

  useImperativeHandle(
    ref,
    () => ({
      format: () => {
        const view = cmRef.current?.view;
        if (view) formatDocument(view);
      },
    }),
    []
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-slate-700 bg-[#282c34]">
      <CodeMirror
        ref={cmRef}
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        height="100%"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          highlightSelectionMatches: true,
          foldGutter: false,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          history: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          rectangularSelection: true,
          tabSize: 2,
        }}
      />
    </div>
  );
});

export default CodeEditor;
