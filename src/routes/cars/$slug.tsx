import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import { getCar } from "@/lib/cars";
import { saveFavorite } from "@/lib/server/garage";
import { cn, formatEuro } from "@/lib/utils";

export const Route = createFileRoute("/cars/$slug")({
  loader: ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    return { car };
  },
  component: CarDetail,
});

function CarDetail() {
  const { car } = Route.useLoaderData();
  const fav = useGarage((s) => s.favorites.includes(car.slug));
  const toggle = useGarage((s) => s.toggleFavorite);
  const user = useCurrentUser();

  return (
    <Shell>
      <Toaster theme="dark" position="top-center" />
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid size-10 place-items-center rounded-full bg-elevated text-cream">
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-elevated"
            aria-label="Condividi"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              toast("Link copiato");
            }}
          >
            <Share2 className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-elevated"
            aria-label="Preferiti"
            onClick={() => {
              toggle(car.slug);
              if (user) void saveFavorite({ data: { slug: car.slug, on: !fav } }).catch(() => {});
            }}
          >
            <Heart className={cn("size-4", fav && "fill-gold text-gold")} />
          </button>
        </div>
      </div>

      <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">{car.badge}</p>
      <h1 className="mt-2 font-display text-4xl text-cream md:text-5xl">{car.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {car.year} · {car.engine.split(" ")[0]} · {car.body}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-cream">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("size-3.5", i < Math.round(car.rating) ? "fill-gold text-gold" : "text-line")}
          />
        ))}
        <span className="text-muted">
          {car.rating} ({car.reviews} recensioni)
        </span>
      </p>

      <img
        src={car.heroImage}
        alt={car.name}
        width={1100}
        height={688}
        fetchPriority="high"
        decoding="async"
        className="mt-6 aspect-[16/10] w-full rounded-2xl object-cover shadow-[var(--shadow-card)]"
      />

      <section className="mt-8">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">{car.poetryTitle}</p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream/85">{car.poetry}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Cronologia</h2>
        <ol className="mt-5 space-y-5 border-l border-gold/30 pl-5">
          {car.timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[1.54rem] top-1.5 size-2.5 rounded-full bg-gold" />
              <p className="text-sm font-medium text-gold">{t.year}</p>
              <p className="mt-1 text-sm text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Scheda tecnica</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <Spec icon="engine" label="Motore" value={car.engine} />
          <Spec icon="power" label="Potenza" value={car.power} />
          <Spec icon="gear" label="Cambio" value={car.transmission} />
          <Spec icon="speed" label="Velocità max" value={car.topSpeed} />
          <Spec icon="years" label="Produzione" value={car.production} />
        </dl>
      </section>

      <div className="mt-8">
        <Link to="/reserve/$slug" params={{ slug: car.slug }}>
          <Button block>Prenota questa leggenda · {formatEuro(car.dailyRate)}/giorno</Button>
        </Link>
      </div>
    </Shell>
  );
}

function Spec({ label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-elevated px-4 py-3 shadow-[var(--shadow-card)]">
      <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-gold">{label}</dt>
      <dd className="mt-1 text-sm text-cream">{value}</dd>
    </div>
  );
}
