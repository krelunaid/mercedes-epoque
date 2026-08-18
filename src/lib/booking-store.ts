import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bookingTotal, type InsuranceId } from "@/lib/cars";
import { inclusiveDays, makeBookingId } from "@/lib/utils";

export type Booking = {
  id: string;
  slug: string;
  start: string;
  end: string;
  atmosphere: string;
  insurance: InsuranceId;
  total: number;
  pickup: string;
  createdAt: string;
  status: "confirmed";
};

type State = {
  favorites: string[];
  bookings: Booking[];
  attending: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addBooking: (input: Omit<Booking, "id" | "createdAt" | "status" | "total"> & { dailyRate: number }) => Booking;
  joinEvent: (slug: string) => void;
  hydrateRemote: (data: { favorites: string[]; bookings: Booking[]; attending: string[] }) => void;
};

export const useGarage = create<State>()(
  persist(
    (set, get) => ({
      favorites: [],
      bookings: [],
      attending: [],
      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((x) => x !== slug)
            : [...s.favorites, slug],
        })),
      isFavorite: (slug) => get().favorites.includes(slug),
      addBooking: (input) => {
        const days = inclusiveDays(input.start, input.end);
        const booking: Booking = {
          id: makeBookingId(),
          slug: input.slug,
          start: input.start,
          end: input.end,
          atmosphere: input.atmosphere,
          insurance: input.insurance,
          total: bookingTotal(input.dailyRate, days, input.insurance),
          pickup: input.pickup,
          createdAt: new Date().toISOString(),
          status: "confirmed",
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking;
      },
      joinEvent: (slug) =>
        set((s) => ({
          attending: s.attending.includes(slug) ? s.attending : [...s.attending, slug],
        })),
      hydrateRemote: (data) =>
        set({
          favorites: data.favorites,
          bookings: data.bookings,
          attending: data.attending,
        }),
    }),
    { name: "epoque-garage" },
  ),
);
