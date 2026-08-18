import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, LocateFixed, MapPin } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { CARS } from "@/lib/cars";
import { useGarage } from "@/lib/booking-store";
import { saveEventRsvp } from "@/lib/server/garage";
import { loadOfficialEvents } from "@/lib/server/events";
import { useCurrentUser } from "@/lib/auth/use-current-user";

const PINNED = CARS.filter((c) =>
  ["mercedes-300-sl", "mercedes-280-sl", "mercedes-190-sl", "mercedes-amg-gt"].includes(c.slug),
);

export const Route = createFileRoute("/explore")({
  loader: () => loadOfficialEvents(),
  component: Explore,
});

function Explore() {
  const nearby = CARS.filter((c) => c.pickup.city === "Parigi");
  const { events } = Route.useLoaderData();
  const featured = events[0];
  const attending = useGarage((s) => s.attending.includes(featured?.slug ?? ""));
  const join = useGarage((s) => s.joinEvent);
  const user = useCurrentUser();

  return (
    <Shell>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">Parigi, Francia</p>
          <h1 className="font-display text-4xl">Scopri</h1>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
        <img src="/images/paris-map.jpg" alt="Mappa di Parigi" className="aspect-[16/11] w-full object-cover" loading="lazy" />
        {PINNED.map((car) => (
          <Link
            key={car.slug}
            to="/cars/$slug"
            params={{ slug: car.slug }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${car.map.x}%`, top: `${car.map.y}%` }}
            title={`${car.shortName} · ${car.map.area}`}
          >
            <span className="block rounded-full border border-gold bg-bg/85 p-0.5 shadow-[var(--shadow-gold)]">
              <img src={car.image} alt={car.shortName} className="size-10 rounded-full object-cover" />
            </span>
          </Link>
        ))}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-bg/75 px-3 py-1 text-xs text-cream backdrop-blur">
            <Layers className="size-3.5" /> Livelli
          </span>
        </div>
        <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-bg/75 text-gold backdrop-blur">
          <LocateFixed className="size-4" />
        </span>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">Prossimi eventi ufficiali</h2>
          <Link to="/circle" className="text-xs text-muted">
            Vedi tutti
          </Link>
        </div>
        {featured ? (
          <article className="mt-3 overflow-hidden rounded-2xl bg-elevated shadow-[var(--shadow-card)]">
            <img src={featured.image} alt="" className="aspect-[16/8] w-full object-cover" />
            <div className="space-y-2 p-4">
              <h3 className="font-display text-2xl leading-tight">{featured.title}</h3>
              <p className="text-sm text-gold">{featured.dateLabel}</p>
              <p className="flex items-center gap-1 text-sm text-muted">
                <MapPin className="size-3.5" />
                {featured.place}, {featured.city}
              </p>
              <p className="text-sm text-cream/80">{featured.blurb}</p>
              <Button
                className="mt-2"
                variant={attending ? "outline" : "gold"}
                onClick={() => {
                  join(featured.slug);
                  if (user) void saveEventRsvp({ data: { slug: featured.slug } }).catch(() => {});
                  window.open(featured.url, "_blank", "noopener,noreferrer");
                }}
              >
                {attending ? "Sito ufficiale" : "Info e biglietti"}
              </Button>
            </div>
          </article>
        ) : (
          <p className="mt-4 text-sm text-muted">Nessun evento aperto. Il calendario si aggiorna da solo.</p>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">Leggende vicine</h2>
          <Link to="/search" className="text-xs text-muted">
            Vedi la mappa
          </Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {nearby.slice(0, 5).map((car) => (
            <CarCard key={car.slug} car={car} className="w-[70%] shrink-0 sm:w-64" />
          ))}
        </div>
      </section>
    </Shell>
  );
}
