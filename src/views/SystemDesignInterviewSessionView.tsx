import { useRef, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Star,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import Whiteboard, { type WhiteboardHandle } from '../components/Whiteboard';
import { reviewDesign, getAIKey, type ReviewFeedback } from '../lib/claudeReview';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { usePageTitle } from '../lib/usePageTitle';

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : score >= 6
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold ${color}`}>
      <Star size={14} />
      <span className="text-sm">{score} / 10</span>
    </div>
  );
}

function FeedbackSection({
  icon,
  title,
  items,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${color}`}>
        {icon}
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className={`mt-0.5 shrink-0 ${color}`}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SystemDesignInterviewSessionView({
  questionId,
  onBack,
  onOpenSettings,
  onMarkCompleted,
}: {
  questionId: string;
  onBack: () => void;
  onOpenSettings?: () => void;
  onMarkCompleted: (score: number) => void;
}) {
  const question = INTERVIEW_QUESTIONS.find((q) => q.id === questionId);
  const whiteboardRef = useRef<WhiteboardHandle>(null);

  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promptCollapsed, setPromptCollapsed] = useState(false);

  usePageTitle(question ? `Interview: ${question.title}` : 'Interview');

  if (!question) {
    onBack();
    return null;
  }

  const hasKey = !!getAIKey();

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const wb = whiteboardRef.current;
      const imageDataUrl =
        wb && !wb.isEmpty() ? wb.getImageDataUrl() : null;

      const result = await reviewDesign({
        questionTitle: question.title,
        questionPrompt: question.prompt,
        textResponse: text,
        imageDataUrl,
      });
      setFeedback(result);
      setPromptCollapsed(true);
      if (result.score > 0) onMarkCompleted(result.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedback(null);
    setError(null);
    setPromptCollapsed(false);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} /> Interview
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {question.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                question.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : question.difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
              }`}
            >
              {question.difficulty}
            </span>
            <span className="hidden text-sm font-semibold text-slate-800 dark:text-slate-200 sm:block">
              {question.title}
            </span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left panel — Question + Feedback */}
        <div className="flex w-5/12 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {/* Question prompt */}
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <button
              onClick={() => setPromptCollapsed((v) => !v)}
              className="mb-3 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400"
            >
              <span>Question</span>
              {promptCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            {!promptCollapsed && (
              <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300">
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {question.title}
                </h2>
                {question.prompt.split('\n\n').map((block, i) => {
                  const lines = block.split('\n');
                  const isList = lines.every(
                    (l) => l.startsWith('- ') || l.startsWith('**')
                  );
                  if (block.startsWith('**') && block.endsWith('**')) {
                    return (
                      <p key={i} className="mt-3 mb-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {block.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (isList && lines.some((l) => l.startsWith('- '))) {
                    return (
                      <ul key={i} className="mb-2 list-disc space-y-1 pl-4">
                        {lines
                          .filter((l) => l.startsWith('- '))
                          .map((l, j) => (
                            <li key={j} className="text-sm leading-relaxed">
                              {l.slice(2)}
                            </li>
                          ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="mb-2 text-sm leading-relaxed">
                      {block}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  <Sparkles size={13} /> AI Feedback
                </div>
                {feedback.score > 0 && <ScoreBadge score={feedback.score} />}
              </div>

              {feedback.summary && (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {feedback.summary}
                </p>
              )}

              <FeedbackSection
                icon={<CheckCircle2 size={12} />}
                title="Strengths"
                items={feedback.strengths}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <FeedbackSection
                icon={<XCircle size={12} />}
                title="Gaps"
                items={feedback.gaps}
                color="text-rose-600 dark:text-rose-400"
              />
              <FeedbackSection
                icon={<Lightbulb size={12} />}
                title="Suggestions"
                items={feedback.suggestions}
                color="text-amber-600 dark:text-amber-400"
              />

              <button
                onClick={handleReset}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Try Again
              </button>
            </div>
          )}

          {!feedback && !hasKey && (
            <div className="p-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    <strong className="font-semibold">No API key set.</strong> Add your Anthropic API key in{' '}
                    <button
                      onClick={onOpenSettings}
                      className="underline underline-offset-2 hover:no-underline"
                    >
                      Settings → AI Review
                    </button>{' '}
                    to get AI feedback on your designs.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Text response + Whiteboard */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Written response */}
          <div className="shrink-0 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Written Response
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Walk through your design: clarify requirements, describe the high-level architecture, discuss key components, and call out trade-offs and failure modes..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
              rows={5}
            />
          </div>

          {/* Whiteboard */}
          <div className="min-h-0 flex-1">
            <Whiteboard ref={whiteboardRef} />
          </div>

          {/* Submit bar */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            {error && (
              <div className="mb-2 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <div className="flex items-center gap-3">
              <p className="flex-1 text-xs text-slate-400 dark:text-slate-500">
                {feedback
                  ? 'Review complete. Try again to re-submit.'
                  : 'Write your response and draw a diagram, then submit for AI review.'}
              </p>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!text.trim() && !!whiteboardRef.current?.isEmpty())}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Reviewing…
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Submit for AI Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
