import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Compass, Heart, House, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Inizio", icon: House, match: (p: string) => p === "/" },
  { to: "/search", label: "Cerca", icon: Search, match: (p: string) => p.startsWith("/search") },
  {
    to: "/explore",
    label: "Esplora",
    icon: Compass,
    match: (p: string) => p.startsWith("/explore") || p.startsWith("/circle"),
  },
  {
    to: "/favorites",
    label: "Preferiti",
    icon: Heart,
    match: (p: string) => p.startsWith("/favorites"),
  },
  {
    to: "/bookings",
    label: "Viaggi",
    icon: CalendarDays,
    match: (p: string) => p.startsWith("/bookings") || p.startsWith("/garage"),
  },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[0.65rem] tracking-wide",
                  active ? "text-gold" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.7} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
