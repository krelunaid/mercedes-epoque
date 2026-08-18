import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarDays, Check, MapPin, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useGarage } from "@/lib/booking-store";
import { getCar } from "@/lib/cars";
import { formatEuro } from "@/lib/utils";

export const Route = createFileRoute("/bookings/$id")({
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useParams();
  const booking = useGarage((s) => s.bookings.find((b) => b.id === id));
  if (!booking) throw notFound();
  const car = getCar(booking.slug);
  if (!car) throw notFound();

  return (
    <Shell>
      <Toaster theme="dark" position="top-center" />
      <div className="text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">Mercedes</p>
        <p className="font-display text-3xl text-gold">Époque</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">
          La tua leggenda
          <br />
          è prenotata
        </h1>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
          <Check className="size-4 text-gold" />
          Prenotazione confermata · Codice #{booking.id}
        </p>
      </div>

      <img
        src={car.slug === "mercedes-300-sl" ? "/images/mercedes-300-sl-wings.jpg" : car.heroImage}
        alt={car.name}
        className="mt-6 aspect-[16/8] w-full rounded-2xl object-cover shadow-[var(--shadow-card)]"
      />

      <section className="mt-6 space-y-4 rounded-2xl bg-elevated p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Il tuo viaggio</h2>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-4 text-gold" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">Ritiro</p>
            <p className="text-cream">{car.pickup.venue}, {car.pickup.city}</p>
            <p className="text-sm text-muted">{car.pickup.street}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 size-4 text-gold" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">Date</p>
            <p className="text-cream">
              {format(parseISO(booking.start), "d MMMM yyyy", { locale: it })}, ore 10:00
            </p>
            <p className="text-cream">{format(parseISO(booking.end), "d MMMM yyyy", { locale: it })}, ore 18:00</p>
          </div>
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">Atmosfera</p>
          <p className="mt-1 text-cream">
            {booking.atmosphere}{" "}
            <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-gold">
              Attiva
            </span>
          </p>
          <p className="text-sm text-muted">Colonna sonora, abbigliamento e dettagli d'epoca</p>
        </div>
        <div className="flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">Prezzo totale</p>
            <p className="text-xs text-muted">Tutto incluso · Assicurazione · Concierge</p>
          </div>
          <p className="font-display text-3xl text-gold">{formatEuro(booking.total)}</p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-elevated p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">La tua storia inizia</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/85">
          Non è solo un giro. È un ritorno a un tempo di eleganza, libertà e stile. Questo è il tuo
          momento nella storia.
        </p>
        <p className="mt-3 font-display italic text-muted">
          Ogni viaggio ha una storia. Questa è la tua.
        </p>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/garage">
          <Button block>Aggiungi al garage</Button>
        </Link>
        <Button
          variant="outline"
          block
          onClick={() => {
            void navigator.clipboard?.writeText(window.location.href);
            toast("Link della prenotazione copiato");
          }}
        >
          <Share2 className="size-4" />
          Condividi il momento
        </Button>
      </div>
    </Shell>
  );
}
