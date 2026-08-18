import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useGarage } from "@/lib/booking-store";
import { loadGarage } from "@/lib/server/garage";

export function SyncGarage() {
  const { user, isPending } = useCurrentUserState();
  const hydrate = useGarage((s) => s.hydrateRemote);
  const did = useRef(false);

  useEffect(() => {
    if (isPending || !user || did.current) return;
    did.current = true;
    void loadGarage()
      .then((remote) => {
        if (remote.bookings.length || remote.favorites.length || remote.attending.length) {
          hydrate(remote);
        }
      })
      .catch(() => {
        did.current = false;
      });
  }, [user, isPending, hydrate]);

  return null;
}
