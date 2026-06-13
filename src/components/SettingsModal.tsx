import { useEffect, useState } from 'react';
import { X, Sparkles, RotateCcw, Loader2, Mail, KeyRound, Eye, EyeOff, Layers } from 'lucide-react';
import type { Profile } from '../types';
import { getAIKey, saveAIKey } from '../lib/claudeReview';

type Props = {
  open: boolean;
  profile: Profile;
  sdNewPerDay: number;
  onSdNewPerDayChange: (n: number) => void;
  onClose: () => void;
  onSave: (updates: {
    newPerDay: number;
    reviewPerDay: number;
    reminderHour: number | null;
    timezone: string | null;
  }) => Promise<void>;
};

const NEW_MIN = 0;
const NEW_MAX = 10;
const REVIEW_MIN = 0;
const REVIEW_MAX = 20;
const SD_NEW_MIN = 0;
const SD_NEW_MAX = 30;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => {
  const ampm = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
  return { value: h, label: ampm };
});

function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export default function SettingsModal({ open, profile, sdNewPerDay, onSdNewPerDayChange, onClose, onSave }: Props) {
  const [newPerDay, setNewPerDay] = useState(profile.newPerDay);
  const [reviewPerDay, setReviewPerDay] = useState(profile.reviewPerDay);
  const [reminderEnabled, setReminderEnabled] = useState(profile.reminderHour !== null);
  const [reminderHour, setReminderHour] = useState(profile.reminderHour ?? 19); // default 7 PM
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => getAIKey());
  const [showKey, setShowKey] = useState(false);

  const browserTz = getBrowserTimezone();

  // Re-sync local state if the profile updates externally or the modal re-opens.
  useEffect(() => {
    if (!open) return;
    setNewPerDay(profile.newPerDay);
    setReviewPerDay(profile.reviewPerDay);
    setReminderEnabled(profile.reminderHour !== null);
    setReminderHour(profile.reminderHour ?? 19);
    setError(null);
  }, [open, profile.newPerDay, profile.reviewPerDay, profile.reminderHour]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const effectiveReminderHour = reminderEnabled ? reminderHour : null;
  const effectiveTimezone = reminderEnabled ? browserTz : profile.timezone;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    saveAIKey(apiKey);
    try {
      await onSave({
        newPerDay,
        reviewPerDay,
        reminderHour: effectiveReminderHour,
        timezone: effectiveTimezone,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-slate-950/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-6">
          {/* New per day */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="new-per-day"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <Sparkles size={14} className="text-indigo-500" />
                New problems per day
              </label>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-sm font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                {newPerDay}
              </span>
            </div>
            <input
              id="new-per-day"
              type="range"
              min={NEW_MIN}
              max={NEW_MAX}
              value={newPerDay}
              onChange={(e) => setNewPerDay(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{NEW_MIN}</span>
              <span>{NEW_MAX}</span>
            </div>
          </div>

          {/* Reviews per day */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="review-per-day"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <RotateCcw size={14} className="text-amber-500" />
                Reviews per day
              </label>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                {reviewPerDay}
              </span>
            </div>
            <input
              id="review-per-day"
              type="range"
              min={REVIEW_MIN}
              max={REVIEW_MAX}
              value={reviewPerDay}
              onChange={(e) => setReviewPerDay(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{REVIEW_MIN}</span>
              <span>{REVIEW_MAX}</span>
            </div>
          </div>

          {/* System Design new cards per day */}
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="sd-new-per-day"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <Layers size={14} className="text-violet-500" />
                New SD cards per day
              </label>
              <span className="rounded-md bg-violet-50 px-2 py-0.5 font-mono text-sm font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                {sdNewPerDay}
              </span>
            </div>
            <input
              id="sd-new-per-day"
              type="range"
              min={SD_NEW_MIN}
              max={SD_NEW_MAX}
              value={sdNewPerDay}
              onChange={(e) => onSdNewPerDayChange(parseInt(e.target.value, 10))}
              className="w-full accent-violet-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{SD_NEW_MIN}</span>
              <span>{SD_NEW_MAX}</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              New cards are introduced in topic order. Due reviews are always shown.
            </p>
          </div>

          {/* Reminder email */}
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Mail size={14} className="text-rose-500" />
                Daily email reminder
              </label>
              <button
                onClick={() => setReminderEnabled((v) => !v)}
                role="switch"
                aria-checked={reminderEnabled}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                  reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                    reminderEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                  style={{ transform: reminderEnabled ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
            {reminderEnabled ? (
              <>
                <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">
                  We'll email you at this time if you have cards waiting.
                </p>
                <select
                  value={reminderHour}
                  onChange={(e) => setReminderHour(parseInt(e.target.value, 10))}
                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {HOUR_OPTIONS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  Your timezone: <span className="font-mono">{browserTz}</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reminders are off. Toggle on to pick a time.
              </p>
            )}
          </div>

          {/* AI Review API Key */}
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <KeyRound size={14} className="text-violet-500" />
              AI Review (Google Gemini API key)
            </label>
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
              Used to evaluate your system design interview responses. Stored locally in your browser only.
            </p>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onBlur={() => saveAIKey(apiKey)}
                placeholder="AIzaSy..."
                className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                tabIndex={-1}
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {apiKey && (
              <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                Gemini key saved — used for Interview AI review.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Tip: 0 new + ~5 review is a good "maintenance" setting on busy days.
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
