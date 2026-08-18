export type ClubEvent = {
  slug: string;
  title: string;
  dateLabel: string;
  place: string;
  city: string;
  image: string;
  url: string;
  source: string;
  blurb: string;
};

/** Calendario da siti ufficiali, aggiornato ad agosto 2026. Solo eventi veri. */
export const EVENTS: ClubEvent[] = [
  {
    slug: "salon-prive-2026",
    title: "Salon Privé",
    dateLabel: "2–6 settembre 2026",
    place: "Blenheim Palace",
    city: "Woodstock, Oxfordshire",
    image: "/images/event-salon.jpg",
    url: "https://www.salonpriveconcours.com/",
    source: "salonpriveconcours.com",
    blurb: "Concorso e garden party sulle praterie di Blenheim Palace: classiche, supercar e ospitalità. Ingresso pubblico, biglietti dal sito ufficiale.",
  },
  {
    slug: "goodwood-revival-2026",
    title: "Goodwood Revival",
    dateLabel: "18–20 settembre 2026",
    place: "Goodwood Motor Circuit",
    city: "Chichester, West Sussex",
    image: "/images/event-villa.jpg",
    url: "https://www.goodwood.com/motorsport/goodwood-revival/",
    source: "goodwood.com",
    blurb: "Il meeting di corse storiche più famoso al mondo. Vetture e moto del periodo 1948–1966 sul circuito originale di Goodwood.",
  },
  {
    slug: "classics-coffee-stuttgart",
    title: "Classics & Coffee",
    dateLabel: "Domeniche fino al 4 ottobre 2026",
    place: "Mercedes-Benz Museum",
    city: "Stoccarda",
    image: "/images/mercedes-300-sl.jpg",
    url: "https://www.mercedes-benz.com/en/art-and-culture/museum/events/classics-coffee/",
    source: "mercedes-benz.com",
    blurb: "Appuntamento ufficiale del Museo Mercedes-Benz. Raduno domenicale di classiche nel parco del museo, da aprile al 4 ottobre 2026.",
  },
  {
    slug: "auto-moto-epoca-2026",
    title: "Auto e Moto d'Epoca",
    dateLabel: "22–25 ottobre 2026",
    place: "BolognaFiere",
    city: "Bologna",
    image: "/images/event-amalfi.jpg",
    url: "https://autoemotodepoca.com/",
    source: "autoemotodepoca.com",
    blurb: "Il salone europeo delle auto e moto d'epoca. Quattro giorni in fiera a Bologna, tra collezionismo, ricambi e club.",
  },
];
