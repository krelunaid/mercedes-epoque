import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CarCard } from "@/components/car-card";
import { Shell } from "@/components/shell";
import { searchCars, type Era } from "@/lib/cars";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [era, setEra] = useState<"all" | Era>("all");
  const results = useMemo(() => searchCars(q, era), [q, era]);

  return (
    <Shell>
      <h1 className="font-display text-4xl text-cream">La collezione</h1>
      <p className="mt-2 text-sm text-muted">Otto chiavi. Una stella. Mercedes storiche e moderne, fianco a fianco.</p>

      <label className="mt-6 flex items-center gap-2 rounded-xl bg-elevated px-3 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca auto, modelli o anni"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>

      <div className="mt-4 flex gap-2">
        {(
          [
            ["all", "Tutte"],
            ["historic", "Storiche"],
            ["modern", "Moderne"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setEra(id)}
            className={cn(
              "min-h-10 rounded-full px-4 text-sm",
              era === id ? "bg-gold text-bg" : "bg-elevated text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((car) => (
          <CarCard key={car.slug} car={car} />
        ))}
      </div>
      {results.length === 0 && <p className="mt-12 text-center text-sm text-muted">Nessuna auto corrisponde.</p>}
    </Shell>
  );
}
