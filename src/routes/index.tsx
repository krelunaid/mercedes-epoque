import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { CarCard } from "@/components/car-card";
import { Shell } from "@/components/shell";
import { CARS, historicCars, modernCars, type Era } from "@/lib/cars";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [era, setEra] = useState<"all" | Era>("historic");
  const [q, setQ] = useState("");
  const hero = CARS[0];

  const filtered = useMemo(() => {
    const list = era === "historic" ? historicCars() : era === "modern" ? modernCars() : CARS;
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((c) => `${c.name} ${c.year} ${c.maker}`.toLowerCase().includes(query));
  }, [era, q]);

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-2xl bg-elevated shadow-[var(--shadow-card)]">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_1.1fr]">
          <div className="relative z-10 space-y-5 px-6 pb-4 pt-8 md:px-10 md:py-14">
            <h1 className="font-display text-5xl text-cream md:text-6xl">
              Viaggi
              <br />
              senza tempo.
            </h1>
            <p className="font-display text-xl italic text-gold">La stella, in ogni epoca.</p>
            <Link
              to="/search"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-gold/50 px-4 text-xs font-medium uppercase tracking-[0.2em] text-cream transition hover:border-gold hover:bg-gold/10"
            >
              Esplora la collezione
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <Link to="/cars/$slug" params={{ slug: hero.slug }} className="relative block min-h-52 md:min-h-80">
            <img
              src={hero.heroImage}
              alt={hero.name}
              width={1100}
              height={620}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[60%_50%] md:absolute md:inset-0"
            />
          </Link>
        </div>
      </section>

      <form
        className="mt-6 flex items-center gap-2 rounded-xl bg-elevated px-3 shadow-[var(--shadow-card)]"
        onSubmit={(e) => e.preventDefault()}
      >
        <Search className="size-4 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca auto, modelli o anni"
          className="h-12 w-full bg-transparent text-sm text-cream outline-none placeholder:text-muted"
        />
        <SlidersHorizontal className="size-4 text-muted" />
      </form>

      <div className="mt-5 grid grid-cols-3 rounded-xl bg-elevated p-1 shadow-[var(--shadow-card)]">
        {(
          [
            ["historic", "Storiche"],
            ["modern", "Moderne"],
            ["all", "Tutte"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setEra(id)}
            className={cn(
              "min-h-10 rounded-lg text-sm transition",
              era === id ? "bg-gold/15 text-gold" : "text-muted hover:text-cream",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {era !== "modern" && (
        <section className="mt-8">
          <SectionHead title="Classiche storiche" to="/search" />
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {(era === "all" ? historicCars() : filtered).map((car, i) => (
              <CarCard key={car.slug} car={car} priority={i === 0} className="w-[72%] shrink-0 sm:w-[46%] md:w-auto" />
            ))}
          </div>
        </section>
      )}

      {era !== "historic" && (
        <section className="mt-8">
          <SectionHead title="Eccellenza moderna" to="/search" />
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {(era === "all" ? modernCars() : filtered).map((car) => (
              <CarCard key={car.slug} car={car} className="w-[72%] shrink-0 sm:w-[46%] md:w-auto" />
            ))}
          </div>
        </section>
      )}

      {era !== "all" && filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted">Nessuna leggenda corrisponde alla ricerca.</p>
      )}
    </Shell>
  );
}

function SectionHead({ title, to }: { title: string; to: "/search" }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-display text-2xl text-cream">{title}</h2>
      <Link to={to} className="text-xs uppercase tracking-[0.18em] text-gold">
        Vedi tutte
      </Link>
    </div>
  );
}
