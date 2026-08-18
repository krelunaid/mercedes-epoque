import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot() {
  const { user } = useCurrentUserState();
  if (!user) {
    return (
      <Link
        to="/login"
        className="grid size-9 place-items-center rounded-full border border-gold/30 text-gold"
        aria-label="Accedi"
      >
        <User className="size-4" />
      </Link>
    );
  }
  const label = user.displayName ?? user.primaryEmail ?? "Account";
  return (
    <div className="flex items-center gap-2">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="size-9 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-9 place-items-center rounded-full bg-gold/15 font-display text-sm text-gold">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <button
        type="button"
        onClick={() => void signOut()}
        className="hidden text-xs uppercase tracking-[0.16em] text-muted hover:text-cream sm:inline"
      >
        Esci
      </button>
    </div>
  );
}
