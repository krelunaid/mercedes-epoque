import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Crest } from "@/components/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-6 py-12">
      <img
        src="/images/mercedes-300-sl-wings.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg" />
      <div className="relative w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Crest className="size-12" />
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-gold">Mercedes</p>
          <h1 className="font-display text-5xl text-cream">Époque</h1>
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Entra nella collezione</p>
        </div>
        <p className="text-sm text-muted">
          Accedi per prenotare una leggenda, salvare i preferiti e unirti a Il Circolo.
        </p>
        {authEnabled ? (
          <div className="space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant={p.idp === "google" ? "gold" : "outline"}
                block
                onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              >
                Continua con {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">L'accesso è disattivato.</p>
        )}
        <Link to="/" className="inline-block text-xs uppercase tracking-[0.2em] text-muted hover:text-cream">
          Entra come ospite
        </Link>
      </div>
    </main>
  );
}
