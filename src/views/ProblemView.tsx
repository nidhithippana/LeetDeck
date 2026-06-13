import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  AlignLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ProblemPrompt from "../components/ProblemPrompt";
import CodeEditor, { type CodeEditorHandle } from "../components/CodeEditor";
import TestResults from "../components/TestResults";
import RatingPanel from "../components/RatingPanel";
import SolutionsPanel from "../components/SolutionsPanel";
import SolutionAnalysis from "../components/SolutionAnalysis";
import HintsPanel from "../components/HintsPanel";
import MarkFamiliarityPanel from "../components/MarkFamiliarityPanel";
import UserMenu from "../components/UserMenu";
import { runTests } from "../runner/runTests";
import { LANGUAGES, LANGUAGE_LABEL } from "../types";
import { usePageTitle } from "../lib/usePageTitle";
import type {
  CardState,
  Language,
  Problem,
  Rating,
  TestRunResult,
} from "../types";
import type { User } from "@supabase/supabase-js";

const draftKey = (problemId: string, lang: Language) =>
  `leetdeck.draft.${problemId}.${lang}`;

const LANG_PREF_KEY = "leetdeck.lang";

function loadDraft(
  problemId: string,
  lang: Language,
  fallback: string
): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(draftKey(problemId, lang)) ?? fallback;
}

function loadLangPref(): Language {
  if (typeof window === "undefined") return "javascript";
  const v = window.localStorage.getItem(LANG_PREF_KEY) as Language | null;
  return v && LANGUAGES.includes(v) ? v : "javascript";
}

type Props = {
  problem: Problem;
  /** 'new'/'review' come from the daily queue and show the rating panel.
   *  'practice' comes from the browse sidebar — free practice, no rating, no SRS impact. */
  kind: "new" | "review" | "practice";
  card: CardState | undefined;
  user: User;
  onBack: () => void;
  onRate: (rating: Rating) => Promise<void>;
  onSignOut: () => Promise<void>;
  onOpenSettings?: () => void;
  /** Called from MarkFamiliarityPanel in practice mode — updates SRS without
   *  counting toward today's session or streak. */
  onMark?: (rating: Rating) => Promise<void>;
};

export default function ProblemView({
  problem,
  kind,
  card,
  user,
  onBack,
  onRate,
  onSignOut,
  onOpenSettings,
  onMark,
}: Props) {
  const [language, setLanguage] = useState<Language>(() => loadLangPref());
  const langConfig = problem.languages[language];
  usePageTitle(problem.title);

  const [code, setCode] = useState(() =>
    kind === 'review' ? langConfig.starterCode : loadDraft(problem.id, language, langConfig.starterCode)
  );
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const editorRef = useRef<CodeEditorHandle>(null);

  const handleFormat = () => {
    void editorRef.current?.format();
  };

  const handleScrollUp = () => editorRef.current?.scrollUp();
  const handleScrollDown = () => editorRef.current?.scrollDown();

  // Reset code + result when language or problem changes.
  // Reviews always start from starter code so past solutions don't show through.
  useEffect(() => {
    setCode(kind === 'review' ? langConfig.starterCode : loadDraft(problem.id, language, langConfig.starterCode));
    setResult(null);
  }, [problem.id, language, langConfig.starterCode, kind]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (kind === 'review') return; // don't overwrite new/practice drafts
    window.localStorage.setItem(draftKey(problem.id, language), code);
  }, [code, problem.id, language, kind]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LANG_PREF_KEY, language);
  }, [language]);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    const r = await runTests(
      language,
      code,
      langConfig.functionName,
      problem.tests,
      problem.inputKinds,
      problem.outputKind,
      problem.isClassDesign ?? false,
      problem.classTests ?? []
    );
    setResult(r);
    setRunning(false);
  };

  const handleReset = () => {
    if (
      window.confirm("Reset to starter code? Your current draft will be lost.")
    ) {
      setCode(langConfig.starterCode);
      setResult(null);
    }
  };

  const allPassed = useMemo(
    () => Boolean(result?.ok && result.results.every((r) => r.pass)),
    [result]
  );

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} /> Today
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                kind === "new"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : kind === "review"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              {kind === "new"
                ? "New"
                : kind === "review"
                  ? "Review"
                  : "Practice"}
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {problem.title}
            </span>
          </div>
          <UserMenu
            user={user}
            onSignOut={onSignOut}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="w-1/2 overflow-y-auto border-r border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900">
          <ProblemPrompt problem={problem} />
          {kind === "practice" && onMark && (
            <div className="mt-6">
              <MarkFamiliarityPanel
                problemId={problem.id}
                card={card}
                onMark={onMark}
              />
            </div>
          )}
          <div className="mt-6">
            <HintsPanel problem={problem} language={language} code={code} />
          </div>
          {allPassed && (
            <div className="mt-6">
              <SolutionsPanel problem={problem} language={language} />
            </div>
          )}
        </section>

        <section className="flex w-1/2 flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Language"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_LABEL[l]}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScrollUp}
                className="flex items-center rounded-md px-1.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Scroll editor up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={handleScrollDown}
                className="flex items-center rounded-md px-1.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Scroll editor down"
              >
                <ChevronDown size={14} />
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={handleFormat}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Format code (⇧⌘F)"
              >
                <AlignLeft size={12} /> Format
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Reset to starter code"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={12} />
                {running
                  ? language === "python"
                    ? "Running (Python may take ~10s on first run)…"
                    : "Running…"
                  : "Run tests"}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 p-2">
            <CodeEditor
              ref={editorRef}
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>

          <div className="max-h-[55%] space-y-3 overflow-y-auto border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <TestResults result={result} running={running} />
            {allPassed && (
              <SolutionAnalysis
                problem={problem}
                language={language}
                code={code}
              />
            )}
            {allPassed && kind !== "practice" && (
              <RatingPanel problemId={problem.id} card={card} onRate={onRate} />
            )}
            {allPassed && kind === "practice" && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Practice mode — your daily SRS schedule is untouched. Solve this
                from the{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Today
                </strong>{" "}
                queue to rate and schedule the next review.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
