import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import {
  EVENT_SOURCES,
  SEED_EVENTS,
  formatEventDates,
  hostOf,
  imageForEvent,
  isAllowedEventUrl,
  mergeOfficial,
  parseGenericOfficial,
  parseMilleMiglia,
  slugifyEvent,
  todayIso,
  upcomingOnly,
  type ClubEvent,
} from "@/lib/events";

const STALE_MS = 12 * 60 * 60 * 1000;
const AI_STALE_MS = 7 * 24 * 60 * 60 * 1000;

type EventRow = {
  slug: string;
  title: string;
  date_label: string;
  place: string;
  city: string;
  image: string;
  url: string;
  source: string;
  blurb: string;
  start_date: string;
  end_date: string;
};

function rowToEvent(r: EventRow): ClubEvent {
  return {
    slug: r.slug,
    title: r.title,
    dateLabel: r.date_label,
    place: r.place,
    city: r.city,
    image: r.image,
    url: r.url,
    source: r.source,
    blurb: r.blurb,
    startDate: r.start_date,
    endDate: r.end_date,
  };
}

async function seedIfNeeded() {
  const sql = await getSql();
  for (const ev of SEED_EVENTS) {
    await sql`
      insert into official_events (
        slug, title, date_label, place, city, image, url, source, blurb, start_date, end_date
      ) values (
        ${ev.slug}, ${ev.title}, ${ev.dateLabel}, ${ev.place}, ${ev.city},
        ${ev.image}, ${ev.url}, ${ev.source}, ${ev.blurb}, ${ev.startDate}, ${ev.endDate}
      )
      on conflict (slug) do nothing
    `;
  }
}

async function readUpcoming(): Promise<ClubEvent[]> {
  const sql = await getSql();
  const today = todayIso();
  const rows = await sql<EventRow>`
    select slug, title, date_label, place, city, image, url, source, blurb, start_date, end_date
    from official_events
    where end_date >= ${today}
    order by start_date asc, title asc
  `;
  return rows.map(rowToEvent);
}

async function upsertEvents(events: ClubEvent[]) {
  const sql = await getSql();
  for (const ev of events) {
    if (!isAllowedEventUrl(ev.url)) continue;
    await sql`
      insert into official_events (
        slug, title, date_label, place, city, image, url, source, blurb, start_date, end_date, updated_at
      ) values (
        ${ev.slug}, ${ev.title}, ${ev.dateLabel}, ${ev.place}, ${ev.city},
        ${ev.image}, ${ev.url}, ${ev.source}, ${ev.blurb}, ${ev.startDate}, ${ev.endDate}, now()
      )
      on conflict (slug) do update set
        title = excluded.title,
        date_label = excluded.date_label,
        place = excluded.place,
        city = excluded.city,
        url = excluded.url,
        blurb = excluded.blurb,
        start_date = excluded.start_date,
        end_date = excluded.end_date,
        updated_at = now()
    `;
  }
  await sql`delete from official_events where end_date < ${todayIso()}`;
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/&#39;|'/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 14000);
}

async function fetchOfficialText(url: string) {
  const res = await fetch(url, {
    headers: { "user-agent": "MercedesEpoque/1.0 (calendario ufficiale)" },
    signal: AbortSignal.timeout(7000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const html = await res.text();
  return stripHtml(html);
}

function parseSource(text: string, url: string, name: string): ClubEvent[] {
  if (url.includes("1000miglia.it")) return parseMilleMiglia(text, url);
  return parseGenericOfficial(text, url, name);
}

type AiEvent = {
  title?: string;
  start?: string;
  end?: string;
  place?: string;
  city?: string;
  url?: string;
  blurb?: string;
};

async function extractWithAi(pages: { name: string; url: string; text: string }[]) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return [] as ClubEvent[];
  const digest = pages
    .map((p) => `### ${p.name}\nURL: ${p.url}\n${p.text.slice(0, 2500)}`)
    .join("\n\n");
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "Estrai SOLO eventi auto classiche/concorsi già scritti nella pagina. Nessuna invenzione. JSON array: title,start,end,place,city,url,blurb. Date ISO YYYY-MM-DD. url deve essere dello stesso sito. Se non sei sicuro, ometti.",
        },
        { role: "user", content: digest },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return [];
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content ?? "";
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  let parsed: AiEvent[] = [];
  try {
    parsed = JSON.parse(jsonMatch[0]) as AiEvent[];
  } catch {
    return [];
  }
  const today = todayIso();
  const out: ClubEvent[] = [];
  for (const item of parsed) {
    if (!item.title || !item.start || !item.url) continue;
    if (!isAllowedEventUrl(item.url)) continue;
    const end = item.end && item.end >= item.start ? item.end : item.start;
    if (end < today) continue;
    const host = hostOf(item.url);
    out.push({
      slug: slugifyEvent(item.title, item.start.slice(0, 4)),
      title: item.title.slice(0, 80),
      dateLabel: formatEventDates(item.start, end),
      place: (item.place || item.title).slice(0, 80),
      city: (item.city || host).slice(0, 80),
      image: imageForEvent(item.title, host),
      url: item.url,
      source: host,
      blurb: (item.blurb || `Calendario ufficiale. Fonte: ${host}.`).slice(0, 280),
      startDate: item.start,
      endDate: end,
    });
  }
  return out;
}

async function syncFromOfficialSites() {
  const sql = await getSql();
  const pages: { name: string; url: string; text: string }[] = [];
  const found: ClubEvent[] = [];
  let error: string | null = null;

  await Promise.all(
    EVENT_SOURCES.map(async (src) => {
      try {
        const text = await fetchOfficialText(src.url);
        pages.push({ name: src.name, url: src.url, text });
        found.push(...parseSource(text, src.url, src.name));
      } catch (err) {
        error = err instanceof Error ? err.message : "sync failed";
      }
    }),
  );

  const meta = await sql<{ last_ai_at: string | null }>`
    select last_ai_at from event_sync_meta where id = 1
  `;
  const lastAi = meta[0]?.last_ai_at ? new Date(meta[0].last_ai_at).getTime() : 0;
  const aiDue = lastAi > 0 && Date.now() - lastAi > AI_STALE_MS;
  if (aiDue && pages.length && process.env.XAI_API_KEY) {
    try {
      found.push(...(await extractWithAi(pages)));
      await sql`update event_sync_meta set last_ai_at = now() where id = 1`;
    } catch (err) {
      error = err instanceof Error ? err.message : "ai sync failed";
    }
  }

  const merged = mergeOfficial(SEED_EVENTS, found);
  await upsertEvents(merged);
  await sql`
    update event_sync_meta
    set last_synced_at = now(),
        last_ai_at = coalesce(last_ai_at, now()),
        last_error = ${error}
    where id = 1
  `;
}

export const loadOfficialEvents = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfNeeded();
  const sql = await getSql();
  const meta = await sql<{ last_synced_at: string | null }>`
    select last_synced_at from event_sync_meta where id = 1
  `;
  const last = meta[0]?.last_synced_at ? new Date(meta[0].last_synced_at).getTime() : 0;
  const stale = Date.now() - last > STALE_MS;
  if (stale) {
    try {
      await syncFromOfficialSites();
    } catch {
      /* keep seed / last good snapshot */
    }
  }
  const events = upcomingOnly(await readUpcoming());
  const after = await sql<{ last_synced_at: string | null }>`
    select last_synced_at from event_sync_meta where id = 1
  `;
  return {
    events,
    syncedAt: after[0]?.last_synced_at ?? null,
  };
});
