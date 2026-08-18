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
  startDate: string;
  endDate: string;
};

export const EVENT_SOURCES = [
  {
    url: "https://www.salonpriveconcours.com/",
    host: "salonpriveconcours.com",
    name: "Salon Privé",
  },
  {
    url: "https://www.goodwood.com/motorsport/goodwood-revival/",
    host: "goodwood.com",
    name: "Goodwood Revival",
  },
  {
    url: "https://www.mercedes-benz.com/en/art-and-culture/museum/events/classics-coffee/",
    host: "mercedes-benz.com",
    name: "Mercedes-Benz Museum",
  },
  {
    url: "https://autoemotodepoca.com/",
    host: "autoemotodepoca.com",
    name: "Auto e Moto d'Epoca",
  },
  {
    url: "https://1000miglia.it/en/",
    host: "1000miglia.it",
    name: "1000 Miglia",
  },
  {
    url: "https://www.concorsodeleganzavilladeste.com/",
    host: "concorsodeleganzavilladeste.com",
    name: "Concorso d'Eleganza Villa d'Este",
  },
] as const;

export const ALLOWED_EVENT_HOSTS = new Set(EVENT_SOURCES.map((s) => s.host));

/** Semina ufficiale nota. Il sync aggiorna date e aggiunge solo ciò che trova sui siti allowlistati. */
export const SEED_EVENTS: ClubEvent[] = [
  {
    slug: "salon-prive-2026",
    title: "Salon Privé",
    dateLabel: "2–6 settembre 2026",
    place: "Blenheim Palace",
    city: "Woodstock, Oxfordshire",
    image: "/images/event-salon.jpg",
    url: "https://www.salonpriveconcours.com/",
    source: "salonpriveconcours.com",
    blurb: "Concorso e garden party sulle praterie di Blenheim Palace. Ingresso pubblico, biglietti dal sito ufficiale.",
    startDate: "2026-09-02",
    endDate: "2026-09-06",
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
    blurb: "Meeting di corse storiche sul circuito originale di Goodwood. Vetture e moto 1948–1966.",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
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
    blurb: "Raduno domenicale ufficiale del Museo Mercedes-Benz, fino al 4 ottobre 2026.",
    startDate: "2026-08-23",
    endDate: "2026-10-04",
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
    blurb: "Il salone europeo delle auto e moto d'epoca a BolognaFiere.",
    startDate: "2026-10-22",
    endDate: "2026-10-25",
  },
];

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
  luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12,
};

const IT_MONTHS = [
  "", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export function formatEventDates(startIso: string, endIso: string) {
  const s = parseIso(startIso);
  const e = parseIso(endIso);
  if (!s || !e) return startIso;
  if (startIso === endIso) return `${s.d} ${IT_MONTHS[s.m]} ${s.y}`;
  if (s.m === e.m && s.y === e.y) return `${s.d}–${e.d} ${IT_MONTHS[s.m]} ${s.y}`;
  return `${s.d} ${IT_MONTHS[s.m]} – ${e.d} ${IT_MONTHS[e.m]} ${e.y}`;
}

function parseIso(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

export function todayIso(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function upcomingOnly(events: ClubEvent[], today = todayIso()) {
  return events
    .filter((e) => e.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.title.localeCompare(b.title));
}

export function slugifyEvent(title: string, year: string | number) {
  const base = title
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
  return `${base || "evento"}-${year}`;
}

export function imageForEvent(title: string, host: string) {
  const hay = `${title} ${host}`.toLowerCase();
  if (hay.includes("coffee") || hay.includes("stuttgart") || hay.includes("mercedes-benz.com")) {
    return "/images/mercedes-300-sl.jpg";
  }
  if (hay.includes("salon") || hay.includes("prive") || hay.includes("blenheim")) {
    return "/images/event-salon.jpg";
  }
  if (hay.includes("villa") || hay.includes("este") || hay.includes("goodwood")) {
    return "/images/event-villa.jpg";
  }
  if (hay.includes("miglia") || hay.includes("alpine") || hay.includes("stelvio")) {
    return "/images/event-alpine.jpg";
  }
  return "/images/event-amalfi.jpg";
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isAllowedEventUrl(url: string) {
  const host = hostOf(url);
  return [...ALLOWED_EVENT_HOSTS].some((h) => host === h || host.endsWith(`.${h}`));
}

/** Estrae coppie di date da testo ufficiale (EN/IT). */
export function extractDateRange(text: string): { start: string; end: string } | null {
  const month = Object.keys(MONTHS).join("|");
  const splitMonths = new RegExp(
    `(\\d{1,2})\\s+(${month})\\s*[–\\-—]\\s*(\\d{1,2})\\s+(${month})\\s+(\\d{4})`,
    "i",
  );
  const sm = splitMonths.exec(text);
  if (sm) {
    const y = Number(sm[5]);
    return {
      start: iso(y, MONTHS[sm[2].toLowerCase()], Number(sm[1])),
      end: iso(y, MONTHS[sm[4].toLowerCase()], Number(sm[3])),
    };
  }
  const range = new RegExp(
    `(\\d{1,2})\\s*[–\\-—]\\s*(\\d{1,2})\\s+(${month})\\s+(\\d{4})`,
    "i",
  );
  const m = range.exec(text);
  if (m) {
    const mon = MONTHS[m[3].toLowerCase()];
    const y = Number(m[4]);
    return {
      start: iso(y, mon, Number(m[1])),
      end: iso(y, mon, Number(m[2])),
    };
  }
  const single = new RegExp(`(\\d{1,2})\\s+(${month})\\s+(\\d{4})`, "i");
  const s = single.exec(text);
  if (s) {
    const day = iso(Number(s[3]), MONTHS[s[2].toLowerCase()], Number(s[1]));
    return { start: day, end: day };
  }
  return null;
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Eventi 1000 Miglia: titolo + "10 - 13 September" sulla homepage. */
export function parseMilleMiglia(text: string, pageUrl: string): ClubEvent[] {
  const out: ClubEvent[] = [];
  const re =
    /1000 Miglia[^\n]{0,80}?(\d{4})[\s\S]{0,80}?(\d{1,2}\s*[–\-]\s*\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    const title = match[0].split("\n")[0].replace(/\s+/g, " ").trim().slice(0, 80);
    const dates = extractDateRange(match[0]);
    if (!dates || dates.end < todayIso()) continue;
    const year = dates.start.slice(0, 4);
    out.push({
      slug: slugifyEvent(title, year),
      title: title.replace(/\s+\d{4}$/, "").trim() || "1000 Miglia",
      dateLabel: formatEventDates(dates.start, dates.end),
      place: "Percorso ufficiale",
      city: title.toLowerCase().includes("austria") ? "Bad Gastein" : "Italia",
      image: imageForEvent(title, "1000miglia.it"),
      url: pageUrl,
      source: "1000miglia.it",
      blurb: "Appuntamento ufficiale 1000 Miglia. Date e iscrizioni sul sito dell'organizzatore.",
      startDate: dates.start,
      endDate: dates.end,
    });
  }
  return dedupeEvents(out);
}

export function parseGenericOfficial(text: string, sourceUrl: string, name: string): ClubEvent[] {
  const dates = extractDateRange(text);
  if (!dates || dates.end < todayIso()) return [];
  const host = hostOf(sourceUrl);
  const year = dates.start.slice(0, 4);
  return [
    {
      slug: slugifyEvent(name, year),
      title: name,
      dateLabel: formatEventDates(dates.start, dates.end),
      place: name,
      city: host,
      image: imageForEvent(name, host),
      url: sourceUrl,
      source: host,
      blurb: `Calendario ufficiale ${name}. Date lette dal sito dell'organizzatore.`,
      startDate: dates.start,
      endDate: dates.end,
    },
  ];
}

export function dedupeEvents(events: ClubEvent[]) {
  const map = new Map<string, ClubEvent>();
  for (const ev of events) {
    const key = ev.slug;
    const prev = map.get(key);
    if (!prev || ev.startDate < prev.startDate) map.set(key, ev);
  }
  return [...map.values()];
}

export function mergeOfficial(seed: ClubEvent[], found: ClubEvent[]) {
  const byHost = new Map<string, ClubEvent>();
  for (const ev of seed) byHost.set(`${hostOf(ev.url)}::${ev.title.toLowerCase()}`, ev);
  const extra: ClubEvent[] = [];
  for (const ev of found) {
    if (!isAllowedEventUrl(ev.url)) continue;
    const key = `${hostOf(ev.url)}::${ev.title.toLowerCase()}`;
    const existing = byHost.get(key);
    if (existing) {
      byHost.set(key, {
        ...existing,
        startDate: ev.startDate,
        endDate: ev.endDate,
        dateLabel: formatEventDates(ev.startDate, ev.endDate),
        url: ev.url || existing.url,
      });
    } else {
      extra.push(ev);
    }
  }
  return upcomingOnly([...byHost.values(), ...extra]);
}

/** @deprecated usa loadOfficialEvents — tenuto per fallback statico */
export const EVENTS = upcomingOnly(SEED_EVENTS);
