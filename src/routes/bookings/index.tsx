import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useGarage } from "@/lib/booking-store";
import { getCar } from "@/lib/cars";
import { formatEuro, inclusiveDays } from "@/lib/utils";

export const Route = createFileRoute("/bookings/")({ component: Bookings });

function Bookings() {
  const bookings = useGarage((s) => s.bookings);

  return (
    <Shell>
      <h1 className="font-display text-4xl">Prenotazioni</h1>
      <p className="mt-2 text-sm text-muted">Viaggi confermati e prossimi ritiri.</p>
      {bookings.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted">Nessuna prenotazione. Una leggenda ti aspetta.</p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Esplora la collezione</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b) => {
            const car = getCar(b.slug);
            if (!car) return null;
            return (
              <li key={b.id}>
                <Link
                  to="/bookings/$id"
                  params={{ id: b.id }}
                  className="flex gap-3 rounded-2xl bg-elevated p-3 shadow-[var(--shadow-card)]"
                >
                  <img src={car.image} alt="" className="size-24 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-gold">{b.id}</p>
                    <h2 className="font-display text-xl leading-tight">{car.name}</h2>
                    <p className="text-sm text-muted">
                      {format(parseISO(b.start), "d MMM", { locale: it })} – {format(parseISO(b.end), "d MMM yyyy", { locale: it })} ·{" "}
                      {inclusiveDays(b.start, b.end)} giorni
                    </p>
                    <p className="mt-1 text-sm text-gold">{formatEuro(b.total)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
