import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Search,
  X,
  PanelLeftClose,
  Code2,
  Layers,
  BookOpen,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import LeetDeckLogo from "./LeetDeckLogo";
import { TOPIC_ORDER, topicIndex } from "../data/topics";
import { PROBLEMS } from "../data/problems";
import type { Difficulty, Problem } from "../types";
import type { SrsData } from "../srs/useSrsState";
import { isDue, todayISO } from "../srs/sm2";
import type { SDTopicStat } from "../srs/useSdSrs";

export type AppSection = "leetcode" | "system-design";

type ProblemStatus = "unseen" | "due" | "scheduled" | "done-today";

function statusFor(p: Problem, data: SrsData): ProblemStatus {
  const today = todayISO();
  const doneToday =
    data.todaySession.newCompleted.includes(p.id) ||
    data.todaySession.reviewCompleted.includes(p.id);
  if (doneToday) return "done-today";
  const card = data.cards[p.id];
  if (!card) return "unseen";
  if (isDue(card, today)) return "due";
  return "scheduled";
}

const diffLetter: Record<Difficulty, string> = {
  Easy: "E",
  Medium: "M",
  Hard: "H",
};
const diffColor: Record<Difficulty, string> = {
  Easy: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  Medium: "text-amber-700 bg-amber-50 ring-amber-200",
  Hard: "text-rose-700 bg-rose-50 ring-rose-200",
};

function StatusIcon({ status }: { status: ProblemStatus }) {
  if (status === "done-today")
    return (
      <CheckCircle2
        size={14}
        className="text-emerald-500"
        aria-label="Done today"
      />
    );
  if (status === "due")
    return (
      <Clock size={14} className="text-amber-600" aria-label="Due today" />
    );
  if (status === "scheduled")
    return (
      <Calendar size={14} className="text-sky-600" aria-label="Scheduled" />
    );
  return <Circle size={12} className="text-slate-300" aria-label="Unseen" />;
}

const COLLAPSED_KEY = "leetdeck.browse.collapsedTopics";

function loadCollapsed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(COLLAPSED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveCollapsed(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...set]));
}

type Props = {
  data: SrsData;
  activeProblemId: string | null;
  onOpenProblem: (problemId: string) => void;
  onGoHome: () => void;
  onCollapse: () => void;
  // Section switching
  section: AppSection;
  onSectionChange: (s: AppSection) => void;
  // System Design
  sdDueCount: number;
  sdTopicStats: SDTopicStat[];
  onGoSDHome: () => void;
  onStartSDReview: () => void;
  onGoSDInterview: () => void;
};

export default function BrowseSidebar({
  data,
  activeProblemId,
  onOpenProblem,
  onGoHome,
  onCollapse,
  section,
  onSectionChange,
  sdDueCount,
  sdTopicStats,
  onGoSDHome,
  onStartSDReview,
  onGoSDInterview,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() =>
    loadCollapsed()
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    saveCollapsed(collapsed);
  }, [collapsed]);

  const toggleTopic = (topic: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  // Group problems by topic in NeetCode-roadmap order (matches the daily-queue ordering).
  // Topics not in TOPIC_ORDER fall to the end alphabetically — shouldn't happen in v1.
  const groupedByTopic = useMemo(() => {
    const groups = new Map<string, Problem[]>();
    for (const p of PROBLEMS) {
      if (!groups.has(p.topic)) groups.set(p.topic, []);
      groups.get(p.topic)!.push(p);
    }
    return [...groups.entries()].sort(
      ([a], [b]) => topicIndex(a) - topicIndex(b)
    );
  }, []);

  // Per-topic completion counts: a problem counts as "touched" once it's in the user's deck
  // (i.e., they've rated it at least once OR marked familiarity in browse mode).
  const completionByTopic = useMemo(() => {
    const counts: Record<string, { done: number; total: number }> = {};
    for (const [topic, problems] of groupedByTopic) {
      const done = problems.filter((p) => {
        const card = data.cards[p.id];
        return card && card.totalReviews > 0;
      }).length;
      counts[topic] = { done, total: problems.length };
    }
    return counts;
  }, [groupedByTopic, data.cards]);
  // Silence unused-var lint when TOPIC_ORDER isn't referenced elsewhere; we import for clarity.
  void TOPIC_ORDER;

  // Filter by query
  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groupedByTopic;
    return groupedByTopic
      .map(
        ([topic, problems]) =>
          [
            topic,
            problems.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.topic.toLowerCase().includes(q)
            ),
          ] as [string, Problem[]]
      )
      .filter(([, problems]) => problems.length > 0);
  }, [groupedByTopic, query]);

  const totalDone = useMemo(
    () => Object.values(data.cards).filter((c) => c.totalReviews > 0).length,
    [data.cards]
  );

  return (
    <aside
      className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      aria-label="Browse problems"
    >
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={section === "leetcode" ? onGoHome : onGoSDHome}
            className="flex items-center transition hover:opacity-80"
            title="Back to Today"
          >
            <LeetDeckLogo size={22} withWordmark />
          </button>
          <button
            onClick={onCollapse}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="mt-2.5 flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          <button
            onClick={() => onSectionChange("leetcode")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
              section === "leetcode"
                ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Code2 size={12} /> LeetCode
          </button>
          <button
            onClick={() => onSectionChange("system-design")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
              section === "system-design"
                ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Layers size={12} /> System Design
          </button>
        </div>

        {section === "leetcode" && (
          <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {totalDone} / {PROBLEMS.length} touched
          </div>
        )}
        {section === "system-design" && (
          <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {sdDueCount > 0
              ? `${sdDueCount} card${sdDueCount !== 1 ? "s" : ""} due today`
              : "All caught up today"}
          </div>
        )}
      </div>

      {section === "leetcode" && (
        <div className="border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems"
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-7 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── System Design sidebar content ── */}
      {section === "system-design" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-2 border-b border-slate-200 p-3 dark:border-slate-800">
            {sdDueCount > 0 && (
              <button
                onClick={onStartSDReview}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                <BookOpen size={13} />
                Review {sdDueCount} card{sdDueCount !== 1 ? "s" : ""}
              </button>
            )}
            <button
              onClick={onGoSDInterview}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-950/50"
            >
              <MessageSquare size={13} />
              Interview Practice
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {sdTopicStats.map((stat) => {
              const allDone = stat.due === 0;
              return (
                <div key={stat.topic} className="mb-1 rounded-md px-2 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {stat.topic}
                    </span>
                    <div className="flex items-center gap-2">
                      {stat.due > 0 && (
                        <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                          {stat.due}
                        </span>
                      )}
                      {allDone && (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      )}
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {stat.touched}/{stat.total}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        stat.touched === stat.total
                          ? "bg-emerald-500"
                          : "bg-indigo-400"
                      }`}
                      style={{ width: `${(stat.touched / stat.total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <RotateCcw size={10} /> SM-2 spaced repetition
            </span>
          </div>
        </div>
      )}

      {/* ── LeetCode sidebar content ── */}
      {section === "leetcode" && (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {visibleGroups.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No problems match "{query}"
              </div>
            )}
            {visibleGroups.map(([topic, problems]) => {
              const isCollapsed = collapsed.has(topic) && !query;
              const counts = completionByTopic[topic] ?? {
                done: 0,
                total: problems.length,
              };
              const pct =
                counts.total > 0 ? (counts.done / counts.total) * 100 : 0;
              const isComplete =
                counts.done > 0 && counts.done === counts.total;
              return (
                <div key={topic} className="mb-1">
                  <button
                    onClick={() => toggleTopic(topic)}
                    className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    aria-expanded={!isCollapsed}
                  >
                    {isCollapsed ? (
                      <ChevronRight
                        size={12}
                        className="shrink-0 text-slate-400 dark:text-slate-500"
                      />
                    ) : (
                      <ChevronDown
                        size={12}
                        className="shrink-0 text-slate-400 dark:text-slate-500"
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-700 dark:text-slate-200">
                      {topic}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {counts.done} / {counts.total}
                    </span>
                    <div
                      className="h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                      aria-label={`${counts.done} of ${counts.total} touched`}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete
                            ? "bg-emerald-500"
                            : "bg-emerald-400/80 dark:bg-emerald-500/80"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                  {!isCollapsed && (
                    <ul className="space-y-0.5 pl-1 pt-0.5">
                      {problems.map((p) => {
                        const status = statusFor(p, data);
                        const isActive = p.id === activeProblemId;
                        return (
                          <li key={p.id}>
                            <button
                              onClick={() => onOpenProblem(p.id)}
                              className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                                isActive
                                  ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200"
                                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <span className="w-3.5 shrink-0">
                                <StatusIcon status={status} />
                              </span>
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold ring-1 ring-inset ${diffColor[p.difficulty]}`}
                                title={p.difficulty}
                              >
                                {diffLetter[p.difficulty]}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                {p.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-500" /> done
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={10} className="text-amber-600" /> due
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={10} className="text-sky-600" /> scheduled
              </span>
              <span className="inline-flex items-center gap-1">
                <Circle
                  size={9}
                  className="text-slate-300 dark:text-slate-600"
                />{" "}
                unseen
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
