import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import { CARS, getCar } from "@/lib/cars";
import { inclusiveDays } from "@/lib/utils";

export const Route = createFileRoute("/garage")({ component: Garage });

function Garage() {
  const { user, isPending } = useCurrentUserState();
  const bookings = useGarage((s) => s.bookings);
  const favorites = useGarage((s) => s.favorites);
  const attending = useGarage((s) => s.attending);

  const driven = bookings
    .map((b) => getCar(b.slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

  const daysOnRoad = bookings.reduce((n, b) => n + inclusiveDays(b.start, b.end), 0);
  const wish = favorites.map(getCar).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const name = user?.displayName?.split(" ")[0] ?? "Ospite";

  return (
    <Shell>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">Bentornato,</p>
          <h1 className="font-display text-4xl text-gold">
            {isPending ? "…" : name}
          </h1>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 divide-x divide-line rounded-2xl bg-elevated py-5 text-center shadow-[var(--shadow-card)]">
        <Stat value={driven.length} label="Leggende guidate" />
        <Stat value={daysOnRoad} label="giorni in viaggio" />
        <Stat value={attending.length} label="eventi" />
      </dl>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl text-gold">Il mio garage</h2>
          <Link to="/bookings" className="text-xs text-muted">
            Vedi tutte
          </Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {(driven.length ? driven : CARS.slice(0, 3)).map((car) => (
            <div key={car.slug} className="w-[68%] shrink-0 sm:w-64">
              <CarCard car={car} />
              <p className="mt-2 px-1 text-xs text-muted">
                {car.year} · {car.origin}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-elevated shadow-[var(--shadow-card)]">
        <Row to="/bookings" icon="car" label="Il mio garage" />
        <Row to="/favorites" icon="heart" label="Preferiti" />
      </div>

      {wish.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Preferiti</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {wish.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-3xl text-gold tabular-nums">{value}</dd>
      <p className="mt-1 text-[0.7rem] text-muted">{label}</p>
    </div>
  );
}

function Row({ to, label }: { to: "/bookings" | "/favorites"; icon: string; label: string }) {
  return (
    <Link to={to} className="flex min-h-14 items-center justify-between px-4 text-sm">
      <span className="flex items-center gap-3">
        <Heart className="size-4 text-gold" />
        {label}
      </span>
      <ChevronRight className="size-4 text-muted" />
    </Link>
  );
}
