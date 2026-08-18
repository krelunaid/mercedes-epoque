import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ArrowLeft, Crown } from "lucide-react";
import { useMemo, useState } from "react";
import { MonthCalendar } from "@/components/month-calendar";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import { bookingTotal, getCar, INSURANCE, type InsuranceId } from "@/lib/cars";
import { saveBooking } from "@/lib/server/garage";
import { cn, formatEuro, formatEuroExact, inclusiveDays } from "@/lib/utils";

export const Route = createFileRoute("/reserve/$slug")({
  loader: ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    return { car };
  },
  component: Reserve,
});

function Reserve() {
  const { car } = Route.useLoaderData();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const addBooking = useGarage((s) => s.addBooking);

  const [month, setMonth] = useState(new Date());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [atmosphere, setAtmosphere] = useState(car.atmosphereDefault);
  const [insurance, setInsurance] = useState<InsuranceId>("premium");
  const [busy, setBusy] = useState(false);

  function pick(day: Date) {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
      return;
    }
    if (day < start) {
      setEnd(start);
      setStart(day);
      return;
    }
    setEnd(day);
  }

  const days = start && end ? inclusiveDays(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd")) : 0;
  const total = useMemo(
    () => (days ? bookingTotal(car.dailyRate, days, insurance) : 0),
    [car.dailyRate, days, insurance],
  );

  async function confirm() {
    if (!start || !end) return;
    setBusy(true);
    const booking = addBooking({
      slug: car.slug,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
      atmosphere,
      insurance,
      dailyRate: car.dailyRate,
      pickup: `${car.pickup.venue}, ${car.pickup.city}`,
    });
    if (user) {
      try {
        await saveBooking({ data: booking });
      } catch {
        /* local copy already saved */
      }
    }
    void navigate({ to: "/bookings/$id", params: { id: booking.id } });
  }

  return (
    <Shell>
      <div className="mb-5 flex items-center gap-3">
        <Link
          to="/cars/$slug"
          params={{ slug: car.slug }}
          className="grid size-10 place-items-center rounded-full bg-elevated"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">Prenota</h1>
      </div>

      <div className="rounded-2xl bg-elevated p-3 shadow-[var(--shadow-card)]">
        <p className="px-2 pt-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold">La tua scelta</p>
        <div className="mt-2 flex items-center gap-3">
          <img src={car.image} alt="" className="size-24 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="text-sm text-muted">
              {car.maker}
            </p>
            <h2 className="font-display text-2xl leading-tight">{car.shortName}</h2>
            <p className="text-xs text-muted">
              {car.year} · {car.era === "historic" ? "Storica" : "Moderna"}
            </p>
            <p className="mt-1 text-sm text-cream">
              {car.color}
              <span className="mx-2 text-muted">·</span>
              {car.transmission} · {car.engine}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-gold">
              ★ {car.rating} ({car.reviews} recensioni)
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-gold">Scegli le date</h2>
      <div className="mt-3">
        <MonthCalendar month={month} onMonth={setMonth} start={start} end={end} onPick={pick} />
      </div>
      {start && end && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          {format(start, "d MMM", { locale: it })} – {format(end, "d MMM yyyy", { locale: it })} · {days} giorni
        </p>
      )}

      <h2 className="mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-gold">Atmosfera</h2>
      <div className="mt-3 rounded-2xl bg-elevated p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl">Stile {atmosphere}</p>
            <p className="mt-1 text-sm text-muted">Un passo indietro nel tempo. Eleganza classica.</p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-gold" />
            <span className="size-6 rounded-full bg-gold" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {car.atmospheres.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAtmosphere(a)}
              className={cn(
                "min-h-10 rounded-full px-3 text-sm",
                atmosphere === a ? "bg-gold text-bg" : "bg-bg text-muted",
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Colonna sonora, note di stile e dettagli d'epoca attivati.</p>
      </div>

      <h2 className="mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-gold">Assicurazione</h2>
      <div className="mt-3 grid gap-2">
        {(Object.values(INSURANCE) as (typeof INSURANCE)[InsuranceId][]).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setInsurance(opt.id)}
            className={cn(
              "flex items-start justify-between gap-3 rounded-2xl px-4 py-4 text-left shadow-[var(--shadow-card)]",
              insurance === opt.id ? "bg-elevated ring-1 ring-gold" : "bg-elevated",
            )}
          >
            <span>
              <span className="flex items-center gap-2 text-sm text-cream">
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border",
                    insurance === opt.id ? "border-gold bg-gold" : "border-muted",
                  )}
                />
                {opt.label}
              </span>
              <span className="mt-1 block text-xs text-muted">{opt.note}</span>
            </span>
            <span className="text-sm text-gold">
              {opt.perDay ? `+${formatEuro(opt.perDay)}/giorno` : "0 €/giorno"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl bg-elevated px-4 py-4 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Totale per {days || "—"} giorni
          </p>
          <p className="font-display text-3xl text-gold">{days ? formatEuroExact(total) : "—"}</p>
        </div>
        <Button disabled={!start || !end || busy} onClick={() => void confirm()}>
          {busy ? "Prenotazione…" : "Conferma"}
        </Button>
      </div>
    </Shell>
  );
}
