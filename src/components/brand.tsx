import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("text-gold", className)} aria-hidden>
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M32 12 L32 32 L18 46 M32 32 L46 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 text-cream", className)}>
      <Crest className="size-8 shrink-0" />
      <span className="leading-none">
        <span className="block text-[0.58rem] font-medium uppercase tracking-[0.28em] text-gold">
          Mercedes
        </span>
        <span className="font-display text-[1.55rem] font-semibold tracking-[0.04em]">Époque</span>
        {!compact && (
          <span className="mt-0.5 hidden text-[0.58rem] font-medium uppercase tracking-[0.22em] text-muted sm:block">
            Collezione classica e moderna
          </span>
        )}
      </span>
    </Link>
  );
}
