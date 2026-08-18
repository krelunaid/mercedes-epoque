import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Crown, ExternalLink, MapPin } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import type { ClubEvent } from "@/lib/events";
import { saveEventRsvp } from "@/lib/server/garage";
import { loadOfficialEvents } from "@/lib/server/events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/circle")({
  loader: () => loadOfficialEvents(),
  component: Circle,
});

function Circle() {
  const { events, syncedAt } = Route.useLoaderData();
  const featured = events[0];
  const attending = useGarage((s) => s.attending);
  const join = useGarage((s) => s.joinEvent);
  const user = useCurrentUser();

  function openOfficial(ev: ClubEvent) {
    join(ev.slug);
    if (user) void saveEventRsvp({ data: { slug: ev.slug } }).catch(() => {});
    window.open(ev.url, "_blank", "noopener,noreferrer");
  }

  return (
    <Shell>
      <div className="text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">Mercedes</p>
        <p className="font-display text-4xl text-gold">Époque</p>
        <Crown className="mx-auto mt-2 size-5 text-gold" />
        <h1 className="mt-2 font-display text-4xl">Il Circolo</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Calendario vivo: ogni visita rilegge i siti ufficiali e toglie gli eventi già chiusi.
        </p>
      </div>

      {!featured ? (
        <p className="mt-10 text-center text-sm text-muted">
          Nessun appuntamento aperto in questo momento. Il calendario si aggiorna da solo.
        </p>
      ) : (
        <>
          <article className="relative mt-8 overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
            <img src={featured.image} alt="" className="aspect-[16/9] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
            <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-bg">
              Ufficiale
            </span>
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-5">
              <h2 className="font-display text-3xl leading-tight">{featured.title}</h2>
              <p className="text-sm text-gold">{featured.dateLabel}</p>
              <p className="flex items-center gap-1 text-sm text-cream/80">
                <MapPin className="size-3.5" />
                {featured.place}, {featured.city}
              </p>
            </div>
          </article>
          <p className="mt-3 text-sm leading-relaxed text-muted">{featured.blurb}</p>
          <Button className="mt-4" onClick={() => openOfficial(featured)}>
            <ExternalLink className="size-4" />
            {attending.includes(featured.slug) ? "Apri di nuovo il sito" : "Biglietti e info ufficiali"}
          </Button>
          <p className="mt-2 text-xs text-muted">{featured.source}</p>
        </>
      )}

      {events.length > 1 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Prossimi incontri</h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {events.slice(1).map((ev) => (
              <a
                key={ev.slug}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  join(ev.slug);
                  if (user) void saveEventRsvp({ data: { slug: ev.slug } }).catch(() => {});
                }}
                className="w-56 shrink-0 overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-card)]"
              >
                <img src={ev.image} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-1 p-3">
                  <h3 className="font-display text-lg leading-tight">{ev.title}</h3>
                  <p className="text-xs text-muted">{ev.city}</p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <CalendarDays className="size-3" />
                    {ev.dateLabel}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-center text-[0.7rem] text-muted">
        {syncedAt
          ? `Ultimo aggiornamento automatico: ${new Date(syncedAt).toLocaleString("it-IT")}`
          : "In attesa del primo aggiornamento automatico."}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-elevated px-5 py-5 shadow-[var(--shadow-gold)]">
        <div>
          <p className="font-display text-2xl text-gold">Unisciti a Il Circolo</p>
          <p className="text-sm text-muted">Wishlist, prenotazioni e gli eventi che hai segnato.</p>
        </div>
        {featured && (
          <Button
            className={cn(attending.includes(featured.slug) && "opacity-80")}
            onClick={() => openOfficial(featured)}
          >
            {attending.includes(featured.slug) ? "In agenda" : "Prossimo evento"}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center">
        <Link to="/explore" className="text-xs uppercase tracking-[0.2em] text-muted">
          Torna alla mappa
        </Link>
      </p>
    </Shell>
  );
}
