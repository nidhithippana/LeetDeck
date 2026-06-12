import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { applyRating, formatInterval, newCard } from "../srs/sm2";
import type { Rating } from "../types";
import type { SdSrsState } from "../srs/useSdSrs";
import { SD_CARDS } from "../data/systemDesign";

// ─── Inline text renderer (bold + code) ─────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const tok = match[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong
          key={key++}
          className="font-semibold text-slate-900 dark:text-slate-100"
        >
          {tok.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderBack(text: string): React.ReactNode {
  const blocks = text.split("\n\n");
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const isList =
      lines.length > 1 &&
      lines.every((l) => l.startsWith("- ") || l.trim() === "");
    if (isList) {
      return (
        <ul key={i} className="list-disc space-y-1.5 pl-5">
          {lines
            .filter((l) => l.startsWith("- "))
            .map((l, j) => (
              <li
                key={j}
                className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                {renderInline(l.slice(2))}
              </li>
            ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
      >
        {renderInline(block)}
      </p>
    );
  });
}

// ─── Rating panel ────────────────────────────────────────────────────────────

const RATINGS: { value: Rating; label: string; cls: string }[] = [
  { value: "again", label: "Again", cls: "bg-rose-600 hover:bg-rose-700" },
  { value: "hard", label: "Hard", cls: "bg-amber-500 hover:bg-amber-600" },
  { value: "good", label: "Good", cls: "bg-emerald-600 hover:bg-emerald-700" },
  { value: "easy", label: "Easy", cls: "bg-sky-600 hover:bg-sky-700" },
];

// ─── Main view ───────────────────────────────────────────────────────────────

type Props = {
  queue: string[];
  sdSrs: SdSrsState;
  onBack: () => void;
  onDone: () => void;
};

export default function SystemDesignCardView({
  queue,
  sdSrs,
  onBack,
  onDone,
}: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cardId = queue[index];
  const sdCard = SD_CARDS.find((c) => c.id === cardId);

  if (!sdCard) {
    onDone();
    return null;
  }

  const currentCardState = sdSrs.cards[cardId] ?? newCard(cardId);

  const handleRate = (rating: Rating) => {
    sdSrs.rateCard(cardId, rating);
    if (index + 1 >= queue.length) {
      onDone();
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} /> System Design
          </button>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {sdCard.topic}
            </span>
            {!sdSrs.cards[cardId] && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                New
              </span>
            )}
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {index + 1} / {queue.length}
            </span>
          </div>
          <div className="w-24" />
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((index + 1) / queue.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Card area */}
      <main className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-2xl space-y-5">
          {/* Question */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {sdCard.topic}
            </div>
            <p className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {sdCard.front}
            </p>

            {!flipped ? (
              <button
                onClick={() => setFlipped(true)}
                className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Eye size={15} />
                Show Answer
              </button>
            ) : (
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                {renderBack(sdCard.back)}
              </div>
            )}
          </div>

          {/* Rating */}
          {flipped && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                How well did you know this?
              </div>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map((r) => {
                  const preview = applyRating(currentCardState, r.value);
                  return (
                    <button
                      key={r.value}
                      onClick={() => handleRate(r.value)}
                      className={`flex flex-col items-center rounded-lg px-3 py-2.5 text-white transition ${r.cls}`}
                    >
                      <span className="text-sm font-semibold">{r.label}</span>
                      <span className="text-[11px] opacity-90">
                        +{formatInterval(preview.intervalDays)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                <strong className="font-medium text-slate-600 dark:text-slate-400">
                  Again
                </strong>{" "}
                resets the card;{" "}
                <strong className="font-medium text-slate-600 dark:text-slate-400">
                  Easy
                </strong>{" "}
                schedules it furthest out.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
