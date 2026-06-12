import { useState } from 'react';
import { ArrowLeft, ChevronRight, Layers, CheckCircle2, Shuffle, RotateCcw } from 'lucide-react';
import LeetDeckLogo from '../components/LeetDeckLogo';
import UserMenu from '../components/UserMenu';
import type { User } from '@supabase/supabase-js';
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_CATEGORIES,
  type InterviewQuestion,
} from '../data/interviewQuestions';
import type { InterviewRecord } from '../srs/useInterviewHistory';
import { usePageTitle } from '../lib/usePageTitle';

const DIFF_COLORS = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

function ScoreChip({ score }: { score: number }) {
  const cls =
    score >= 8
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : score >= 6
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cls}`}>
      {score}/10
    </span>
  );
}

function QuestionCard({
  question,
  record,
  onStart,
}: {
  question: InterviewQuestion;
  record: InterviewRecord | undefined;
  onStart: () => void;
}) {
  const done = !!record;
  return (
    <div
      className={`group flex items-center gap-4 rounded-lg border bg-white px-4 py-3.5 transition hover:shadow-sm dark:bg-slate-900 ${
        done
          ? 'border-slate-200 dark:border-slate-800'
          : 'border-slate-200 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-indigo-800'
      }`}
    >
      {/* Completion indicator */}
      <div className="shrink-0">
        {done ? (
          <CheckCircle2 size={16} className="text-emerald-500" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              done
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {question.title}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${DIFF_COLORS[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
          {done && record.score > 0 && <ScoreChip score={record.score} />}
          {done && record.attempts > 1 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              ×{record.attempts}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {question.category}
        </div>
      </div>

      <button
        onClick={onStart}
        className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition ${
          done
            ? 'bg-slate-400 opacity-0 hover:bg-slate-500 group-hover:opacity-100 dark:bg-slate-600'
            : 'bg-indigo-600 opacity-0 hover:bg-indigo-700 group-hover:opacity-100'
        }`}
      >
        {done ? (
          <>
            <RotateCcw size={11} /> Retry
          </>
        ) : (
          <>
            Practice <ChevronRight size={12} />
          </>
        )}
      </button>
    </div>
  );
}

export default function SystemDesignInterviewView({
  user,
  onBack,
  onStartSession,
  onSignOut,
  onOpenSettings,
  history,
}: {
  user: User;
  onBack: () => void;
  onStartSession: (questionId: string) => void;
  onSignOut: () => Promise<void>;
  onOpenSettings?: () => void;
  history: Record<string, InterviewRecord>;
}) {
  usePageTitle('System Design Interview');

  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [category, setCategory] = useState<string>('All');
  const [showDone, setShowDone] = useState(true);

  const DIFFICULTIES: Difficulty[] = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = ['All', ...INTERVIEW_CATEGORIES];

  const completedIds = new Set(Object.keys(history));
  const totalDone = INTERVIEW_QUESTIONS.filter((q) => completedIds.has(q.id)).length;
  const totalQuestions = INTERVIEW_QUESTIONS.length;

  const pickRandom = (diff: 'Easy' | 'Medium' | 'Hard') => {
    const pool = INTERVIEW_QUESTIONS.filter(
      (q) => q.difficulty === diff && !completedIds.has(q.id)
    );
    const from = pool.length > 0 ? pool : INTERVIEW_QUESTIONS.filter((q) => q.difficulty === diff);
    const picked = from[Math.floor(Math.random() * from.length)];
    if (picked) onStartSession(picked.id);
  };

  const diffStats = (['Easy', 'Medium', 'Hard'] as const).map((d) => {
    const all = INTERVIEW_QUESTIONS.filter((q) => q.difficulty === d);
    const done = all.filter((q) => completedIds.has(q.id)).length;
    const remaining = all.length - done;
    return { d, total: all.length, done, remaining };
  });

  const filtered = INTERVIEW_QUESTIONS.filter((q) => {
    if (difficulty !== 'All' && q.difficulty !== difficulty) return false;
    if (category !== 'All' && q.category !== category) return false;
    if (!showDone && completedIds.has(q.id)) return false;
    return true;
  });

  // Incomplete first, then completed
  const sorted = [
    ...filtered.filter((q) => !completedIds.has(q.id)),
    ...filtered.filter((q) => completedIds.has(q.id)),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <LeetDeckLogo size={22} withWordmark />
            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              Interview
            </span>
          </div>
          <UserMenu user={user} onSignOut={onSignOut} onOpenSettings={onOpenSettings} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        {/* Back + Title */}
        <div>
          <button
            onClick={onBack}
            className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={14} /> System Design
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Layers size={13} /> Interview Practice
          </div>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Design Questions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Write your approach and draw a diagram. Claude evaluates your design and gives structured feedback.
          </p>
        </div>

        {/* Progress bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Your Progress
            </span>
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {totalDone} / {totalQuestions} completed
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{ width: `${(totalDone / totalQuestions) * 100}%` }}
            />
          </div>
          {totalDone === totalQuestions && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              All questions completed! You can always retry for a better score.
            </p>
          )}
        </div>

        {/* Pick for me */}
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-900/40 dark:bg-violet-950/30">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Shuffle size={13} /> Pick a random question
          </div>
          <div className="grid grid-cols-3 gap-3">
            {diffStats.map(({ d, remaining, total }) => (
              <button
                key={d}
                onClick={() => pickRandom(d)}
                className={`flex flex-col items-center rounded-xl py-4 px-3 font-semibold text-white transition active:scale-95 ${
                  d === 'Easy'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : d === 'Medium'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                <span className="text-base font-bold">{d}</span>
                <span className="mt-0.5 text-[11px] opacity-90">
                  {remaining > 0
                    ? `${remaining} new · ${total} total`
                    : `${total} total · all done`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Browse filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  difficulty === d
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
            <div className="mx-1 self-center text-slate-300 dark:text-slate-700">|</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {totalDone > 0 && (
              <button
                onClick={() => setShowDone((v) => !v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  !showDone
                    ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {showDone ? 'Hide completed' : 'Show completed'}
              </button>
            )}
          </div>
        </div>

        {/* Question list */}
        <section className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {sorted.length} question{sorted.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2">
            {sorted.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                record={history[q.id]}
                onStart={() => onStartSession(q.id)}
              />
            ))}
          </div>
          {sorted.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white py-10 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {!showDone && totalDone > 0
                  ? 'All matching questions completed. Toggle "Show completed" to see them.'
                  : 'No questions match these filters.'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
