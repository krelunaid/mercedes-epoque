export type Era = "historic" | "modern";

export type Car = {
  slug: string;
  name: string;
  shortName: string;
  maker: string;
  year: number;
  era: Era;
  badge: string;
  origin: string;
  color: string;
  body: string;
  dailyRate: number;
  rating: number;
  reviews: number;
  image: string;
  heroImage: string;
  atmosphereDefault: string;
  atmospheres: string[];
  pickup: { city: string; venue: string; street: string };
  map: { x: number; y: number; area: string };
  engine: string;
  power: string;
  transmission: string;
  topSpeed: string;
  production: string;
  poetryTitle: string;
  poetry: string;
  timeline: { year: string; text: string }[];
};

export const CARS: Car[] = [
  {
    slug: "mercedes-300-sl",
    name: "Mercedes-Benz 300 SL Gullwing",
    shortName: "300 SL Gullwing",
    maker: "Mercedes-Benz",
    year: 1955,
    era: "historic",
    badge: "Leggenda storica",
    origin: "Germania",
    color: "Argento metallizzato",
    body: "Coupé ali di gabbiano",
    dailyRate: 2200,
    rating: 4.9,
    reviews: 128,
    image: "/images/mercedes-300-sl.jpg",
    heroImage: "/images/mercedes-300-sl-wings.jpg",
    atmosphereDefault: "Anni ’50",
    atmospheres: ["Anni ’50", "Anni ’60"],
    pickup: {
      city: "Parigi",
      venue: "Avenue Montaigne",
      street: "Cortile del Plaza Athénée",
    },
    map: { x: 48, y: 38, area: "Montaigne" },
    engine: "6 cilindri in linea 3.0",
    power: "215 CV",
    transmission: "Manuale 4 rapporti",
    topSpeed: "263 km/h",
    production: "1954 – 1957",
    poetryTitle: "Porte che hanno imparato a volare",
    poetry:
      "La prima supercar, prima che la parola esistesse. Quelle ali non erano teatro: erano l'unico modo per uscire da un telaio a traliccio. Aprirle una volta, e ogni altra portiera diventa provinciale.",
    timeline: [
      {
        year: "1952",
        text: "La W194 vince Le Mans. Un'auto stradale diventa inevitabile.",
      },
      {
        year: "1954",
        text: "New York vede la 300 SL. Le portiere ad ali di gabbiano fermano lo show.",
      },
      {
        year: "1955",
        text: "Arriva l'iniezione. La freccia d'argento scende in strada.",
      },
    ],
  },
  {
    slug: "mercedes-300-sl-roadster",
    name: "Mercedes-Benz 300 SL Roadster",
    shortName: "300 SL Roadster",
    maker: "Mercedes-Benz",
    year: 1957,
    era: "historic",
    badge: "Leggenda storica",
    origin: "Germania",
    color: "Argento metallizzato",
    body: "Roadster",
    dailyRate: 2100,
    rating: 4.9,
    reviews: 96,
    image: "/images/mercedes-300-sl-roadster.jpg",
    heroImage: "/images/mercedes-300-sl-roadster.jpg",
    atmosphereDefault: "Anni ’50",
    atmospheres: ["Anni ’50", "Anni ’60"],
    pickup: {
      city: "Parigi",
      venue: "Place de la Concorde",
      street: "Cortile dell'Hôtel de Crillon",
    },
    map: { x: 62, y: 34, area: "Concorde" },
    engine: "6 cilindri in linea 3.0",
    power: "225 CV",
    transmission: "Manuale 4 rapporti",
    topSpeed: "250 km/h",
    production: "1957 – 1963",
    poetryTitle: "La stessa stella, a cielo aperto",
    poetry:
      "Quando le ali impararono a vivere senza tetto, nacque un'altra leggenda: ancora un'auto da corsa sotto la pelle, ora vestita per la Côte d'Azur.",
    timeline: [
      {
        year: "1957",
        text: "La Roadster succede alla Gullwing. Porte convenzionali, vita più morbida, lo stesso cuore.",
      },
      {
        year: "1963",
        text: "L'ultima 300 SL lascia Sindelfingen. Un'epoca si chiude a capote aperta.",
      },
    ],
  },
  {
    slug: "mercedes-190-sl",
    name: "Mercedes-Benz 190 SL",
    shortName: "190 SL",
    maker: "Mercedes-Benz",
    year: 1960,
    era: "historic",
    badge: "Classica storica",
    origin: "Germania",
    color: "Avorio",
    body: "Roadster",
    dailyRate: 1400,
    rating: 4.8,
    reviews: 154,
    image: "/images/mercedes-190-sl.jpg",
    heroImage: "/images/mercedes-190-sl.jpg",
    atmosphereDefault: "Anni ’60",
    atmospheres: ["Anni ’50", "Anni ’60"],
    pickup: {
      city: "Parigi",
      venue: "Saint-Germain",
      street: "Boulevard Saint-Germain",
    },
    map: { x: 44, y: 66, area: "Saint-Germain" },
    engine: "4 cilindri in linea 1.9",
    power: "105 CV",
    transmission: "Manuale 4 rapporti",
    topSpeed: "171 km/h",
    production: "1955 – 1963",
    poetryTitle: "La sorella minore",
    poetry:
      "Nata per assomigliare a una 300 SL e comportarsi come un weekend. La 190 SL è l'auto che porti a pranzo e che, chissà come, hai ancora a mezzanotte.",
    timeline: [
      {
        year: "1954",
        text: "Svelata a New York accanto alla 300 SL. L'America si innamora della stella più piccola.",
      },
      {
        year: "1963",
        text: "La produzione finisce mentre la Pagoda aspetta in disparte.",
      },
    ],
  },
  {
    slug: "mercedes-280-sl",
    name: "Mercedes-Benz 280 SL Pagoda",
    shortName: "280 SL Pagoda",
    maker: "Mercedes-Benz",
    year: 1968,
    era: "historic",
    badge: "Classica storica",
    origin: "Germania",
    color: "Argento metallizzato",
    body: "Coupé Pagoda",
    dailyRate: 1600,
    rating: 4.9,
    reviews: 187,
    image: "/images/mercedes-280-sl.jpg",
    heroImage: "/images/mercedes-280-sl.jpg",
    atmosphereDefault: "Anni ’60",
    atmospheres: ["Anni ’60", "Anni ’70"],
    pickup: {
      city: "Parigi",
      venue: "Trocadéro",
      street: "Place du Trocadéro, 16e",
    },
    map: { x: 26, y: 30, area: "Trocadéro" },
    engine: "6 cilindri in linea 2.8",
    power: "170 CV",
    transmission: "Automatico 4 rapporti",
    topSpeed: "200 km/h",
    production: "1968 – 1971",
    poetryTitle: "Un tetto come un tempio",
    poetry:
      "Paul Bracq disegnò un hardtop che scende al centro e si alza ai lati: una pagoda. Sotto, la SL più elegante di tutte.",
    timeline: [
      {
        year: "1963",
        text: "Arriva la W113. Il tetto a pagoda diventa una sagoma che riconosci a un chilometro.",
      },
      {
        year: "1968",
        text: "La 280 SL porta il sei cilindri più grande. Grazia, ora con vero passo.",
      },
    ],
  },
  {
    slug: "mercedes-300-sel",
    name: "Mercedes-Benz 300 SEL 6.3",
    shortName: "300 SEL 6.3",
    maker: "Mercedes-Benz",
    year: 1968,
    era: "historic",
    badge: "Leggenda storica",
    origin: "Germania",
    color: "Nero profondo",
    body: "Berlina",
    dailyRate: 1800,
    rating: 4.8,
    reviews: 72,
    image: "/images/mercedes-300-sel.jpg",
    heroImage: "/images/mercedes-300-sel.jpg",
    atmosphereDefault: "Anni ’60",
    atmospheres: ["Anni ’60", "Anni ’70"],
    pickup: {
      city: "Parigi",
      venue: "Le Marais",
      street: "Place des Vosges",
    },
    map: { x: 78, y: 46, area: "Le Marais" },
    engine: "V8 6.3",
    power: "250 CV",
    transmission: "Automatico 4 rapporti",
    topSpeed: "220 km/h",
    production: "1968 – 1972",
    poetryTitle: "Una sala del consiglio che morde",
    poetry:
      "Qualcuno mise il V8 della 600 in una Classe S e inventò la Q-car. Vernice nera, calandra dritta e un piede destro che riordina il traffico.",
    timeline: [
      {
        year: "1968",
        text: "Mercedes cala il V8 M100 nella W109. Nasce la 6.3.",
      },
      {
        year: "1971",
        text: "Diventa l'arma segreta dei signori che rifiutano di sembrare di fretta.",
      },
    ],
  },
  {
    slug: "mercedes-amg-gt",
    name: "Mercedes-AMG GT",
    shortName: "AMG GT",
    maker: "Mercedes-AMG",
    year: 2023,
    era: "modern",
    badge: "Eccellenza moderna",
    origin: "Germania",
    color: "Grigio selenite",
    body: "Coupé",
    dailyRate: 2800,
    rating: 4.8,
    reviews: 64,
    image: "/images/mercedes-amg-gt.jpg",
    heroImage: "/images/mercedes-amg-gt.jpg",
    atmosphereDefault: "Anni ’20",
    atmospheres: ["Anni ’20"],
    pickup: {
      city: "Parigi",
      venue: "Champs-Élysées",
      street: "Avenue des Champs-Élysées",
    },
    map: { x: 38, y: 32, area: "Champs-Élysées" },
    engine: "V8 biturbo 4.0",
    power: "577 CV",
    transmission: "MCT 9 rapporti",
    topSpeed: "315 km/h",
    production: "2015 –",
    poetryTitle: "Affalterbach, dopo il tramonto",
    poetry:
      "Un cofano lungo, una coda corta e un V8 che crede ancora nel teatro. La GT è la cugina più selvaggia della SL moderna: nata ad Affalterbach, pensata per il rientro di notte.",
    timeline: [
      {
        year: "2014",
        text: "AMG svela la seconda sportiva tutta sua. La GT raccoglie lo spirito della SLS.",
      },
      {
        year: "2023",
        text: "Arriva la seconda generazione: ancora un V8 anteriore-centrale, ancora una stella senza guanti.",
      },
    ],
  },
  {
    slug: "mercedes-sl-63",
    name: "Mercedes-AMG SL 63",
    shortName: "SL 63",
    maker: "Mercedes-AMG",
    year: 2023,
    era: "modern",
    badge: "Eccellenza moderna",
    origin: "Germania",
    color: "Nero ossidiana",
    body: "Cabriolet",
    dailyRate: 2600,
    rating: 4.9,
    reviews: 51,
    image: "/images/mercedes-sl-63.jpg",
    heroImage: "/images/mercedes-sl-63.jpg",
    atmosphereDefault: "Anni ’20",
    atmospheres: ["Anni ’20"],
    pickup: {
      city: "Parigi",
      venue: "Avenue Montaigne",
      street: "Garage del Plaza Athénée",
    },
    map: { x: 52, y: 42, area: "Montaigne" },
    engine: "V8 biturbo 4.0",
    power: "577 CV",
    transmission: "MCT 9 rapporti",
    topSpeed: "315 km/h",
    production: "2022 –",
    poetryTitle: "La SL, riscritta",
    poetry:
      "Due posti. Un tetto in tela. Un V8 dove un tempo viveva un sei in linea. La nuova SL è il sangue della stirpe, continuato da chi crede ancora che una Mercedes aperta debba attraversare un continente prima di cena.",
    timeline: [
      {
        year: "1954",
        text: "La prima SL inventa il gran turismo Mercedes.",
      },
      {
        year: "2022",
        text: "AMG riporta la SL a due posti e al tetto in tela. La stella torna ai primi principi.",
      },
    ],
  },
  {
    slug: "mercedes-g-63",
    name: "Mercedes-AMG G 63",
    shortName: "G 63",
    maker: "Mercedes-AMG",
    year: 2024,
    era: "modern",
    badge: "Eccellenza moderna",
    origin: "Germania",
    color: "Nero ossidiana",
    body: "Geländewagen",
    dailyRate: 2400,
    rating: 4.8,
    reviews: 88,
    image: "/images/mercedes-g-63.jpg",
    heroImage: "/images/mercedes-g-63.jpg",
    atmosphereDefault: "Anni ’20",
    atmospheres: ["Anni ’20"],
    pickup: {
      city: "Parigi",
      venue: "Trocadéro",
      street: "Avenue Kléber",
    },
    map: { x: 30, y: 28, area: "Trocadéro" },
    engine: "V8 biturbo 4.0",
    power: "577 CV",
    transmission: "Automatico 9 rapporti",
    topSpeed: "220 km/h",
    production: "2018 –",
    poetryTitle: "Una scatola diventata stella",
    poetry:
      "Disegnata per gli eserciti, adottata da tutti gli altri. La G 63 è la prova che un angolo retto, con abbastanza cavalli, diventa gioielleria.",
    timeline: [
      {
        year: "1979",
        text: "Il Geländewagen entra in servizio. Prima la funzione, per sempre.",
      },
      {
        year: "2018",
        text: "Una nuova Classe G tiene la sagoma e lascia ad AMG riscrivere la colonna sonora.",
      },
    ],
  },
];

export const INSURANCE = {
  premium: { id: "premium" as const, label: "Copertura Premium", perDay: 48, note: "Kasko completa, senza franchigia" },
  standard: { id: "standard" as const, label: "Standard", perDay: 28, note: "Terzi e protezione di base" },
  none: { id: "none" as const, label: "Rinuncia", perDay: 0, note: "I danni restano a tuo carico" },
};

export type InsuranceId = keyof typeof INSURANCE;

export function getCar(slug: string) {
  return CARS.find((c) => c.slug === slug);
}

export function historicCars() {
  return CARS.filter((c) => c.era === "historic");
}

export function modernCars() {
  return CARS.filter((c) => c.era === "modern");
}

export function searchCars(q: string, era: "all" | Era = "all") {
  const query = q.trim().toLowerCase();
  return CARS.filter((c) => {
    if (era !== "all" && c.era !== era) return false;
    if (!query) return true;
    const hay = `${c.name} ${c.maker} ${c.year} ${c.origin} ${c.body}`.toLowerCase();
    return hay.includes(query);
  });
}

export function bookingTotal(dailyRate: number, days: number, insurance: InsuranceId) {
  return (dailyRate + INSURANCE[insurance].perDay) * days;
}
