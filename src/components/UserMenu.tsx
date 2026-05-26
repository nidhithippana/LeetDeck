import { useEffect, useRef, useState } from 'react';
import { LogOut, User as UserIcon, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useTheme } from '../lib/useTheme';

type Props = {
  user: User;
  onSignOut: () => Promise<void>;
  /** Optional — when provided, a "Settings" entry appears in the menu. */
  onOpenSettings?: () => void;
};

function avatarUrl(user: User): string | null {
  return (user.user_metadata?.avatar_url as string) ?? null;
}

function displayName(user: User): string {
  return (
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email ||
    'User'
  );
}

export default function UserMenu({ user, onSignOut, onOpenSettings }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const avatar = avatarUrl(user);
  const name = displayName(user);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="User menu"
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            <UserIcon size={14} />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</div>
            {user.email && (
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
            )}
          </div>
          {onOpenSettings && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenSettings();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <SettingsIcon size={14} />
              Daily targets
            </button>
          )}
          <button
            onClick={() => {
              toggle();
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="inline-flex items-center gap-2">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {theme}
            </span>
          </button>
          <button
            onClick={async () => {
              setOpen(false);
              await onSignOut();
            }}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
