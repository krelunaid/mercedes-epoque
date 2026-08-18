import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AuthSlot } from "@/components/auth-slot";
import { BottomNav } from "@/components/bottom-nav";
import { Wordmark } from "@/components/brand";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Collezione" },
  { to: "/explore", label: "Esplora" },
  { to: "/circle", label: "Il Circolo" },
  { to: "/garage", label: "Garage" },
  { to: "/bookings", label: "Prenotazioni" },
] as const;

export function Shell({
  children,
  flush = false,
}: {
  children: ReactNode;
  flush?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-cream">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.75rem]">
          <Wordmark className="min-w-0" />
          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors",
                  pathname === l.to ? "text-gold" : "text-muted hover:text-cream",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <AuthSlot />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-line text-cream md:hidden"
              aria-label="Apri menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-line px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm text-cream hover:bg-cream/5"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <div className={cn(flush ? "" : "mx-auto max-w-6xl px-4 pb-28 pt-6 md:pb-16")}>{children}</div>
      <BottomNav />
    </div>
  );
}
