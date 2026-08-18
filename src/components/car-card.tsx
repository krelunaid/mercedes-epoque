import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { saveFavorite } from "@/lib/server/garage";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import type { Car } from "@/lib/cars";
import { cn, formatEuro } from "@/lib/utils";

export function CarCard({
  car,
  className,
  priority = false,
}: {
  car: Car;
  className?: string;
  priority?: boolean;
}) {
  const fav = useGarage((s) => s.favorites.includes(car.slug));
  const toggle = useGarage((s) => s.toggleFavorite);
  const user = useCurrentUser();

  return (
    <article className={cn("group relative min-w-0", className)}>
      <Link
        to="/cars/$slug"
        params={{ slug: car.slug }}
        className="block overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-card)]"
      >
        <div className="relative aspect-[4/3] bg-bg">
          <img
            src={car.image}
            alt={car.name}
            width={720}
            height={540}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
            className="size-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
          {car.era === "historic" ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-bg/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-gold backdrop-blur-sm">
              Classica
            </span>
          ) : (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-bg/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-cream backdrop-blur-sm">
              Moderna
            </span>
          )}
        </div>
        <div className="space-y-1 px-3 py-3">
          <h3 className="font-display text-lg leading-tight text-cream">{car.name}</h3>
          <p className="text-xs text-muted">
            {car.year} · {car.era === "historic" ? "Classica" : "Moderna"}
          </p>
          <p className="pt-1 text-sm text-gold">Da {formatEuro(car.dailyRate)} / giorno</p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(car.slug);
          if (user) void saveFavorite({ data: { slug: car.slug, on: !fav } }).catch(() => {});
        }}
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-bg/55 text-cream backdrop-blur-sm"
      >
        <Heart className={cn("size-4", fav && "fill-gold text-gold")} />
      </button>
    </article>
  );
}
