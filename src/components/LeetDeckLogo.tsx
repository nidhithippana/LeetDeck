/**
 * LeetDeck brand mark.
 *
 *  - Icon: two stacked rounded cards, top one slid up, with a neon-green
 *    `=>` ligature centered on the top card. Self-contained dark badge that
 *    reads on any background.
 *  - Optional wordmark: "Leet" in adaptive slate (changes with theme) +
 *    "Deck" in emerald green (matches the arrow). Deliberately not orange
 *    to avoid LeetCode trade-dress confusion.
 */

type Props = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
};

function LogoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rounded charcoal background — self-contained badge */}
      <rect width="32" height="32" rx="7" fill="#282c34" />

      {/* Bottom card (slightly offset down-right, partially visible behind top) */}
      <rect
        x="9"
        y="12"
        width="18"
        height="13"
        rx="2.25"
        fill="#3a3f4a"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.5"
      />

      {/* Top card (slid up + left) */}
      <rect
        x="5"
        y="7"
        width="18"
        height="13"
        rx="2.25"
        fill="#1f2329"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.6"
      />

      {/* `=>` ligature centered on top card */}
      <g
        stroke="#39ff7f"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Double horizontal lines = "=" */}
        <line x1="8.5" y1="12" x2="14.5" y2="12" />
        <line x1="8.5" y1="15.5" x2="14.5" y2="15.5" />
        {/* Chevron = ">" */}
        <polyline points="15,9.5 19.5,13.75 15,18" />
      </g>
    </svg>
  );
}

export default function LeetDeckLogo({
  size = 24,
  withWordmark = false,
  className = '',
}: Props) {
  if (!withWordmark) return <LogoIcon size={size} />;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={size} />
      <span className="font-bold tracking-tight" style={{ fontSize: size * 0.7 }}>
        <span className="text-slate-700 dark:text-slate-200">Leet</span>
        <span className="text-emerald-500 dark:text-emerald-400">Deck</span>
      </span>
    </div>
  );
}
