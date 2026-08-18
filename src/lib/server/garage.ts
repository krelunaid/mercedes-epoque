import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Booking } from "@/lib/booking-store";
import type { InsuranceId } from "@/lib/cars";

const bookingRow = z.object({
  id: z.string(),
  slug: z.string(),
  start: z.string(),
  end: z.string(),
  atmosphere: z.string(),
  insurance: z.string(),
  total: z.number(),
  pickup: z.string(),
  createdAt: z.string(),
  status: z.literal("confirmed"),
});

export const loadGarage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const favs = await sql<{ car_slug: string }>`
      select car_slug from favorites where user_id = ${context.userId} order by created_at desc
    `;
    const rows = await sql<{
      id: string;
      car_slug: string;
      start_date: string;
      end_date: string;
      atmosphere: string;
      insurance: string;
      total_cents: number;
      pickup: string;
      status: string;
      created_at: string;
    }>`
      select id, car_slug, start_date, end_date, atmosphere, insurance, total_cents, pickup, status, created_at
      from bookings
      where user_id = ${context.userId}
      order by created_at desc
    `;
    const rsvps = await sql<{ event_slug: string }>`
      select event_slug from event_rsvps where user_id = ${context.userId}
    `;
    const bookings: Booking[] = rows.map((r) => ({
      id: r.id,
      slug: r.car_slug,
      start: r.start_date,
      end: r.end_date,
      atmosphere: r.atmosphere,
      insurance: r.insurance as InsuranceId,
      total: r.total_cents / 100,
      pickup: r.pickup,
      createdAt: r.created_at,
      status: "confirmed",
    }));
    return {
      favorites: favs.map((f) => f.car_slug),
      bookings,
      attending: rsvps.map((r) => r.event_slug),
    };
  });

export const saveFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string; on: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.on) {
      await sql`
        insert into favorites (user_id, car_slug)
        values (${context.userId}, ${data.slug})
        on conflict (user_id, car_slug) do nothing
      `;
    } else {
      await sql`
        delete from favorites where user_id = ${context.userId} and car_slug = ${data.slug}
      `;
    }
    return { ok: true as const };
  });

export const saveBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Booking) => bookingRow.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into bookings (
        id, user_id, car_slug, start_date, end_date, atmosphere, insurance, total_cents, pickup, status, created_at
      ) values (
        ${data.id},
        ${context.userId},
        ${data.slug},
        ${data.start},
        ${data.end},
        ${data.atmosphere},
        ${data.insurance},
        ${Math.round(data.total * 100)},
        ${data.pickup},
        ${data.status},
        ${data.createdAt}
      )
      on conflict (id) do nothing
    `;
    return { ok: true as const };
  });

export const saveEventRsvp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into event_rsvps (user_id, event_slug)
      values (${context.userId}, ${data.slug})
      on conflict (user_id, event_slug) do nothing
    `;
    return { ok: true as const };
  });
