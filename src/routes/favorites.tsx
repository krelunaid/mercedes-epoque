import { createFileRoute, Link } from "@tanstack/react-router";
import { CarCard } from "@/components/car-card";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useGarage } from "@/lib/booking-store";
import { getCar } from "@/lib/cars";

export const Route = createFileRoute("/favorites")({ component: Favorites });

function Favorites() {
  const slugs = useGarage((s) => s.favorites);
  const cars = slugs.map(getCar).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <Shell>
      <h1 className="font-display text-4xl">Preferiti</h1>
      <p className="mt-2 text-sm text-muted">Le auto che hai segnato per un prossimo ritiro delle chiavi.</p>
      {cars.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted">La lista è vuota. Inizia da una classica.</p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Sfoglia la collezione</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      )}
    </Shell>
  );
}
