// Travel Hood Data Graph
// Structured data: Continents → Countries → Destinations → Trips

export interface Continent {
  id: string
  name: string
  slug: string
  editorialIntro: string
  heroImage: string
  bestMonths: string
  faqs: { question: string; answer: string }[]
  seoTitle: string
  seoDescription: string
}

export interface Country {
  id: string
  name: string
  slug: string
  continentId: string
  flag: string
  currency?: string
  currencyRate?: string
  language?: string
  timezone?: string
  visaRequired?: boolean
  visaInfo?: string
  vaccinesRecommended?: string
}

export type DestinationCategory = "playa" | "aventura" | "cultural" | "naturaleza" | "nieve"

export interface FAQ {
  question: string
  answer: string
}

export interface ClimateMonth {
  month: string
  avgTemp: string
  rainfall: "Baja" | "Media" | "Alta"
  recommendation: "Ideal" | "Buena" | "Aceptable" | "No recomendado"
  note?: string
}

export interface BudgetPerDay {
  mealCostLow: string
  mealCostMid: string
  beerCost: string
  dailyBudget: string
  totalExtras: string
}

export interface DestinationSeo {
  title: string
  description: string
  keywords: string
  cuandoViajarTitle?: string
  cuandoViajarDescription?: string
  presupuestoTitle?: string
  presupuestoDescription?: string
}

export interface Destination {
  id: string
  name: string
  slug: string
  countryId: string
  continentId: string
  description: string
  shortDescription: string
  heroImage: string
  highlights: string[]
  idealFor: string
  climate: string
  categories: DestinationCategory[]
  extraIncluded?: string[]
  extraNotIncluded?: string[]
  included?: string[]
  notIncluded?: string[]
  itinerary?: ItineraryDay[]
  heroImageAlt?: string
  coordinates?: { lat: number; lng: number }
  climateByMonth?: ClimateMonth[]
  budgetPerDay?: BudgetPerDay
  faqs?: FAQ[]
  seo?: DestinationSeo
  pdfUrl?: string
  hasCoordinator: boolean
}

export type TripTag =
  | "semana-santa"
  | "puente-mayo"
  | "verano"
  | "septiembre"
  | "puente-octubre"
  | "puente-noviembre"
  | "navidad"
  | "fin-de-anio"

export interface Trip {
  id: string
  destinationId: string
  title: string
  departureDate: string
  returnDate: string
  durationDays: number
  priceFrom: number
  promoPrice?: number
  promoLabel?: string
  flightEstimate: number
  totalPlaces: number
  placesLeft: number
  coordinatorId: string
  status: "open" | "almost-full" | "full"
  included: string[]
  notIncluded: string[]
  extraIncluded?: string[]
  extraNotIncluded?: string[]
  itinerary: ItineraryDay[]
  itineraryOverride?: ItineraryDay[]
  tags: TripTag[]
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  lat?: number
  lng?: number
}

export interface Coordinator {
  id: string
  name: string
  age: number
  role: string
  bio: string
  destinations: string[]
  quote: string
  image: string
}

export type TestimonialSource = "trustpilot" | "editorial"
export type TestimonialVerificationStatus =
  | "individual-link"
  | "profile-link"
  | "pending-review"
  | "retired"

export interface Testimonial {
  id: string
  name: string
  age?: number
  city?: string
  destinationId?: string
  quote: string
  rating: number
  image?: string
  featured?: boolean
  source?: TestimonialSource
  verificationStatus?: TestimonialVerificationStatus
  externalReviewUrl?: string
  sourceProfileUrl?: string
  experienceDateLabel?: string
  experienceDate?: string
  editorialReviewedAt?: string
  editorialEvidenceRef?: string
  isVisible?: boolean
  sortOrder?: number
}

export interface TripCategoryData {
  name: string
  slug: DestinationCategory
  editorial: string
  heroImage: string
  idealProfile: string
  faqs: { question: string; answer: string }[]
  seoTitle: string
  seoDescription: string
}

export interface SeasonData {
  name: string
  slug: string
  tags: TripTag[]
  editorial: string
  heroImage: string
  faqs: { question: string; answer: string }[]
  seoTitle: string
  seoDescription: string
}

// --- DATA ---

// TODO: migrar a Sanity
export const continents: Continent[] = [
  {
    id: "europe",
    name: "Europa",
    slug: "europa",
    editorialIntro:
      "Europa es mucho más que monumentos y museos. Es perderse por los lagos volcánicos de Azores al atardecer, cazar auroras boreales en Islandia, recorrer los fiordos noruegos o descubrir la Laponia más salvaje bajo la nieve. En Travel Hood organizamos viajes en grupo para jóvenes de 20 a 35 años por los rincones más auténticos del viejo continente, combinando cultura, naturaleza y experiencias que no encontrarías en una guía turística. Nuestros grupos reducidos de 12 a 13 personas viajan con coordinador en destino, alojamiento incluido y un itinerario diseñado para vivir cada país de verdad. Europa tiene destinos para todos los gustos: desde escapadas de puente de 5 días hasta aventuras de dos semanas. Y lo mejor: los vuelos son cortos y baratos, así que el presupuesto total es muy accesible.",
    heroImage: "/images/hero-laponia.jpg",
    bestMonths: "Islandia: mayo-septiembre. Laponia: diciembre-marzo. Lofoten: jun-jul. Azores: jun-sept.",
    faqs: [
      { question: "¿Necesito pasaporte para viajar por Europa?", answer: "Si eres ciudadano de la UE, con el DNI es suficiente para la mayoría de destinos. Para Islandia (fuera de la UE pero en Schengen) también vale el DNI." },
      { question: "¿Cuál es el destino europeo más barato?", answer: "Azores y Lofoten ofrecen una relación calidad-precio excelente entre nuestros destinos europeos. Vuelos accesibles y experiencias naturales únicas a precios muy razonables." },
      { question: "¿Merece la pena ir a Laponia en verano?", answer: "El verano en Laponia ofrece el sol de medianoche, pero la magia de las auroras y la nieve solo se vive en invierno (diciembre-marzo)." },
    ],
    seoTitle: "Viajes en grupo a Europa para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Descubre los mejores viajes en grupo a Europa para jóvenes: Islandia, Laponia, Lofoten y Azores. Grupos reducidos con coordinador.",
  },
  {
    id: "asia",
    name: "Asia",
    slug: "asia",
    editorialIntro:
      "Asia es el continente que te cambia la perspectiva. Desde las playas imposibles de Tailandia hasta los arrozales de Bali, pasando por los templos de Sri Lanka y las islas paradisíacas de Filipinas, cada destino asiático es una inmersión total en otra forma de entender la vida. En Travel Hood llevamos grupos de jóvenes de 20 a 35 años a vivir Asia de verdad: no desde un resort, sino desde la calle, los mercados nocturnos, los templos al amanecer y las experiencias que solo un coordinador local puede abrir. Nuestros viajes por Asia combinan aventura, cultura y playa en itinerarios de 10 a 14 días que maximizan cada momento. El sudeste asiático ofrece además una relación calidad-precio difícil de superar: comidas por 2-3€, transportes económicos y alojamientos con encanto a precios accesibles.",
    heroImage: "/images/hero-japon.jpg",
    bestMonths: "Tailandia: nov-marzo. Bali/Indonesia: abril-octubre. Maldivas: dic-abril. Sri Lanka: ene-mar y jun-sept. Filipinas: nov-mayo.",
    faqs: [
      { question: "¿Necesito vacunas para viajar a Asia?", answer: "Depende del destino. Para el sudeste asiático se recomiendan hepatitis A y B. Consulta tu centro de vacunación internacional al menos 1 mes antes." },
      { question: "¿Es seguro para mujeres viajar solas a Asia?", answer: "El sudeste asiático es uno de los destinos más seguros del mundo para viajeras. Además, en Travel Hood siempre viajas con grupo y coordinador." },
      { question: "¿Es muy caro viajar a Asia?", answer: "Los vuelos varían según destino, pero una vez allí todo es muy barato. Tailandia, Bali y Sri Lanka son de los destinos más económicos del mundo." },
    ],
    seoTitle: "Viajes en grupo a Asia para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes en grupo a Asia para jóvenes: Tailandia, Bali, Maldivas, Sri Lanka y Filipinas. Grupos reducidos de 12-13 personas con coordinador.",
  },
  {
    id: "africa",
    name: "África",
    slug: "africa",
    editorialIntro:
      "África es el continente que te sacude. Desde las pirámides de Egipto hasta las playas de Zanzíbar, cada destino africano ofrece una intensidad que no encontrarás en ningún otro lugar. En Travel Hood organizamos viajes en grupo para jóvenes de 20 a 35 años a los destinos africanos más espectaculares, siempre con coordinador en destino y en grupos reducidos de 12 a 13 personas. África tiene opciones para todos: Egipto está a pocas horas de vuelo y es perfecto para escapadas de puente, mientras que Zanzíbar ofrece aventuras más largas e inmersivas con playas paradisíacas y cultura única. Los precios locales son muy accesibles y la experiencia cultural es incomparable.",
    heroImage: "/images/hero-zanzibar.jpg",
    bestMonths: "Egipto: oct-abril. Zanzíbar: junio-octubre.",
    faqs: [
      { question: "¿Es seguro viajar a África?", answer: "Los destinos que operamos son muy seguros para turistas. Egipto y Zanzíbar son destinos con infraestructura turística consolidada. Además, siempre viajas con coordinador y grupo." },
      { question: "¿Necesito vacunas para África?", answer: "Depende del destino. Para Egipto no hay obligatorias. Para Zanzíbar se recomienda fiebre amarilla y profilaxis antimalárica." },
      { question: "¿Cuánto cuesta un viaje a África?", answer: "Los precios varían según destino y temporada. Consulta las fichas de cada viaje para ver precios actualizados. Egipto es el destino más accesible en vuelos y Zanzíbar ofrece una experiencia más inmersiva." },
    ],
    seoTitle: "Viajes en grupo a África para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes en grupo a África para jóvenes: Egipto y Zanzíbar. Coordinador en destino, grupos reducidos.",
  },
  {
    id: "south-america",
    name: "Sudamérica",
    slug: "sudamerica",
    editorialIntro:
      "Sudamérica es pura intensidad. Desde las playas tropicales de Brasil hasta las cumbres andinas de Perú, pasando por la salsa y el Caribe de Colombia, este continente tiene la energía de un volcán y la belleza de un cuadro. En Travel Hood llevamos grupos de jóvenes de 20 a 35 años a descubrir la esencia de Sudamérica: no la versión turística, sino la real. Gastronomía de talla mundial en Lima, samba en Rio, Machu Picchu al amanecer, salsa en Cartagena... Nuestros itinerarios de 12 a 14 días están diseñados para exprimir cada destino con coordinador en terreno y experiencias que solo un grupo puede desbloquear. Los precios locales son asequibles y la hospitalidad latinoamericana hace que cada viajero se sienta en casa desde el primer día.",
    heroImage: "/images/hero-brasil.jpg",
    bestMonths: "Brasil: junio-septiembre. Perú: mayo-septiembre. Colombia: dic-marzo y julio-agosto.",
    faqs: [
      { question: "¿Necesito visado para Sudamérica?", answer: "Los ciudadanos españoles no necesitan visado para Brasil, Perú ni Colombia como turistas (90 días)." },
      { question: "¿Es seguro Sudamérica?", answer: "Las zonas turísticas son seguras, especialmente viajando en grupo con coordinador. Se aplica el sentido común habitual de cualquier gran ciudad." },
      { question: "¿Me afectará la altitud en Perú?", answer: "Cusco está a 3.400m y puede afectar los primeros días. Nuestros itinerarios incluyen aclimatación progresiva y el mate de coca ayuda mucho." },
    ],
    seoTitle: "Viajes en grupo a Sudamérica para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes en grupo a Sudamérica para jóvenes: Brasil, Perú y Colombia. Grupos reducidos con coordinador, itinerarios de aventura.",
  },
  {
    id: "central-america",
    name: "Centroamérica",
    slug: "centroamerica",
    editorialIntro:
      "Centroamérica y el Caribe son el secreto mejor guardado de los viajeros. Puerto Rico ofrece el Caribe más auténtico: playas vírgenes, bioluminiscencia, cascadas escondidas y una cultura latina que enamora desde el primer momento. En Travel Hood organizamos viajes en grupo para jóvenes de 20 a 35 años por los destinos más espectaculares del Caribe, con coordinador en destino y grupos reducidos. Los viajes combinan aventura, cultura y playa en itinerarios diseñados para vivir cada destino al máximo. La hospitalidad caribeña, el ritmo relajado y las experiencias únicas hacen de esta región una opción perfecta para todo tipo de viajeros.",
    heroImage: "/images/hero-brasil.jpg",
    bestMonths: "Puerto Rico: dic-abril y jun-sept.",
    faqs: [
      { question: "¿Necesito visado para Puerto Rico?", answer: "Sí, Puerto Rico es territorio de EE.UU. y necesitas pasaporte en vigor y autorización ESTA (14 USD)." },
      { question: "¿Es caro el Caribe?", answer: "Puerto Rico tiene precios algo superiores a otros destinos caribeños, pero cuenta con infraestructura de primer nivel y experiencias únicas como la bioluminiscencia." },
      { question: "¿Qué hace especial a Puerto Rico?", answer: "Puerto Rico es Caribe auténtico con bioluminiscencia, playas vírgenes, cascadas como Gozalandia, cultura afroboricua y gastronomía latina. Todo en una isla compacta y bien conectada." },
    ],
    seoTitle: "Viajes en grupo a Centroamérica para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes en grupo al Caribe para jóvenes: Puerto Rico. Coordinador en destino, grupos reducidos.",
  },
  {
    id: "oceania",
    name: "Oceanía",
    slug: "oceania",
    editorialIntro:
      "Oceanía es el fin del mundo conocido y el principio de paisajes que parecen de otro planeta. Australia, Nueva Zelanda y las islas del Pacífico ofrecen aventuras épicas para viajeros que buscan lo extraordinario. Estamos preparando los primeros viajes en grupo a Oceanía — si te interesa, déjanos tu email y serás el primero en enterarte.",
    heroImage: "/images/hero-maldivas.jpg",
    bestMonths: "Australia: septiembre-noviembre y marzo-mayo. Nueva Zelanda: diciembre-febrero.",
    faqs: [
      { question: "¿Cuándo habrá viajes a Oceanía?", answer: "Estamos diseñando los primeros itinerarios. Apúntate a la lista de espera para ser el primero en enterarte." },
    ],
    seoTitle: "Viajes en grupo a Oceanía para jóvenes | Travel Hood (Próximamente)",
    seoDescription: "Próximamente: viajes en grupo a Australia y Nueva Zelanda para jóvenes de 20 a 35 años. Apúntate a la lista de espera.",
  },
]

export const countries: Country[] = [
  {
    id: "br", name: "Brasil", slug: "brasil", continentId: "south-america", flag: "BR",
    currency: "Real brasileño (BRL)", currencyRate: "1€ ≈ 5,5 BRL", language: "Portugués",
    timezone: "GMT-3 (4h menos que España)", visaRequired: false,
    visaInfo: "Hasta 90 días sin visa (UE)", vaccinesRecommended: "Fiebre amarilla y hepatitis A/B recomendadas",
  },
  {
    id: "co", name: "Colombia", slug: "colombia", continentId: "south-america", flag: "CO",
    currency: "Peso colombiano (COP)", currencyRate: "1€ ≈ 4.500 COP", language: "Español",
    timezone: "GMT-5 (6h menos que España)", visaRequired: false,
    visaInfo: "Hasta 90 días sin visa (UE)", vaccinesRecommended: "Fiebre amarilla recomendada en zonas de selva/parques naturales",
  },
  {
    id: "fi", name: "Finlandia", slug: "finlandia", continentId: "europe", flag: "FI",
    currency: "Euro (EUR)", currencyRate: "1€ = 1€", language: "Finés, sueco",
    timezone: "GMT+2 (1h más que España)", visaRequired: false,
    visaInfo: "Schengen, DNI o pasaporte", vaccinesRecommended: "",
  },
  {
    id: "mv", name: "Maldivas", slug: "maldivas", continentId: "asia", flag: "MV",
    currency: "Rufiyaa maldiva (MVR)", currencyRate: "1€ ≈ 16,5 MVR", language: "Dhivehi, inglés",
    timezone: "GMT+5 (4h más que España)", visaRequired: false,
    visaInfo: "Visa on arrival gratuita 30 días", vaccinesRecommended: "Hepatitis A y B recomendadas",
  },
  {
    id: "tz", name: "Tanzania", slug: "tanzania", continentId: "africa", flag: "TZ",
    currency: "Chelín tanzano (TZS)", currencyRate: "1€ ≈ 2.700 TZS", language: "Suajili, inglés",
    timezone: "GMT+3 (2h más que España)", visaRequired: true,
    visaInfo: "E-visa ~50 USD", vaccinesRecommended: "Fiebre amarilla recomendada, antimalárica aconsejable",
  },
  {
    id: "th", name: "Tailandia", slug: "tailandia", continentId: "asia", flag: "TH",
    currency: "Baht (THB)", currencyRate: "1€ ≈ 37 THB", language: "Tailandés",
    timezone: "GMT+7 (6h más que España)", visaRequired: false,
    visaInfo: "Hasta 30 días sin visa", vaccinesRecommended: "",
  },
  {
    id: "is", name: "Islandia", slug: "islandia", continentId: "europe", flag: "IS",
    currency: "Corona islandesa (ISK)", currencyRate: "1€ ≈ 150 ISK", language: "Islandés, inglés",
    timezone: "GMT+0 (1h menos que España)", visaRequired: false,
    visaInfo: "Schengen, DNI o pasaporte", vaccinesRecommended: "",
  },
  {
    id: "id", name: "Indonesia", slug: "indonesia", continentId: "asia", flag: "ID",
    currency: "Rupia indonesia (IDR)", currencyRate: "1€ ≈ 17.000 IDR", language: "Bahasa Indonesia",
    timezone: "GMT+8 (7h más que España)", visaRequired: true,
    visaInfo: "VOA 30 días ~35 USD", vaccinesRecommended: "Hepatitis A y B recomendadas",
  },
  {
    id: "eg", name: "Egipto", slug: "egipto", continentId: "africa", flag: "EG",
    currency: "Libra egipcia (EGP)", currencyRate: "1€ ≈ 52 EGP", language: "Árabe",
    timezone: "GMT+2 (1h más que España)", visaRequired: true,
    visaInfo: "~25 USD on arrival o e-visa", vaccinesRecommended: "",
  },
  {
    id: "lk", name: "Sri Lanka", slug: "sri-lanka", continentId: "asia", flag: "LK",
    currency: "Rupia (LKR)", currencyRate: "1€ ≈ 320 LKR", language: "Cingalés, tamil, inglés",
    timezone: "GMT+5:30 (4,5h más que España)", visaRequired: true,
    visaInfo: "ETA online ~35 USD", vaccinesRecommended: "Hepatitis A y B recomendadas",
  },
  {
    id: "pt", name: "Portugal", slug: "portugal", continentId: "europe", flag: "PT",
    currency: "Euro (EUR)", currencyRate: "1€ = 1€", language: "Portugués",
    timezone: "GMT+0 (1h menos que España)", visaRequired: false,
    visaInfo: "Schengen, DNI o pasaporte", vaccinesRecommended: "",
  },
  {
    id: "no", name: "Noruega", slug: "noruega", continentId: "europe", flag: "NO",
    currency: "Corona noruega (NOK)", currencyRate: "1€ ≈ 11,5 NOK", language: "Noruego, inglés",
    timezone: "GMT+1 (misma hora que España)", visaRequired: false,
    visaInfo: "Schengen, DNI o pasaporte", vaccinesRecommended: "",
  },
  {
    id: "es", name: "España", slug: "espana", continentId: "europe", flag: "ES",
    currency: "Euro (EUR)", currencyRate: "1€ = 1€", language: "Español",
    timezone: "GMT+1", visaRequired: false,
    visaInfo: "Sin documentación especial", vaccinesRecommended: "",
  },
  {
    id: "ph", name: "Filipinas", slug: "filipinas", continentId: "asia", flag: "PH",
    currency: "Peso filipino (PHP)", currencyRate: "1€ ≈ 61 PHP", language: "Filipino, inglés",
    timezone: "GMT+8 (7h más que España)", visaRequired: false,
    visaInfo: "Hasta 30 días sin visado", vaccinesRecommended: "Hepatitis A y B recomendadas",
  },
  {
    id: "pr", name: "Puerto Rico", slug: "puerto-rico", continentId: "central-america", flag: "PR",
    currency: "Dólar (USD)", currencyRate: "1€ ≈ 1,08 USD", language: "Español, inglés",
    timezone: "GMT-4 (5h menos que España)", visaRequired: true,
    visaInfo: "ESTA obligatorio (14 USD)", vaccinesRecommended: "",
  },
  {
    id: "jp", name: "Japón", slug: "japon", continentId: "asia", flag: "JP",
    currency: "Yen japonés (JPY)", currencyRate: "1€ ≈ 164 JPY", language: "Japonés",
    timezone: "GMT+9 (8h más que España)", visaRequired: false,
    visaInfo: "Hasta 90 días sin visa (UE)", vaccinesRecommended: "",
  },
]

export const destinations: Destination[] = [
  {
    id: "brasil",
    name: "Brasil",
    slug: "brasil",
    countryId: "br",
    continentId: "south-america",
    description:
      "Rio, playas paradisíacas, caipirinha al atardecer y un grupo que se convierte en familia. Brasil es pura energía, color y ritmo.",
    shortDescription: "Playas, ritmo y energía pura. Desde Rio hasta las mejores playas del norte.",
    heroImage: "/images/hero-brasil.jpg",
    heroImageAlt: "Playa paradisíaca de aguas turquesa en Arraial do Cabo, Brasil",
    highlights: ["Angra dos Reis", "Rio de Janeiro", "Arraial do Cabo", "Búzios"],
    idealFor: "Amantes de la playa, la fiesta y la naturaleza salvaje",
    climate: "Tropical, 25-35°C",
    categories: ["playa", "aventura", "naturaleza"],
    extraIncluded: ["Entradas a parques nacionales y propinas", "Actividades y excursiones (quads, snorkel)"],
    extraNotIncluded: [],
    coordinates: { lat: -22.9068, lng: -43.1729 },
    budgetPerDay: { mealCostLow: "3-5€", mealCostMid: "8-15€", beerCost: "1,5-3€", dailyBudget: "20-35€/día", totalExtras: "250-400€ (11 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Brasil", description: "Llegada al aeropuerto de Río de Janeiro. Recogida y traslado a Angra dos Reis." },
      { day: 2, title: "Descubriendo Angra dos Reis", description: "Exploración de playas paradisíacas. Barbacoa en la villa con piscina privada." },
      { day: 3, title: "Explorando playas y paisajes", description: "Barco privado a playa Lopes Mendes, Vila de Abraão y almuerzo frente al mar en Japariz." },
      { day: 4, title: "Aventura en aguas cristalinas", description: "Día completo en barco privado por Laguna Azul, Grumixama, Aripeba y Araçá. Snorkel en playas paradisíacas." },
      { day: 5, title: "¡Vamos a Río!", description: "Transporte privado a Río de Janeiro. Cristo Redentor, Maracaná y cena en Copacabana." },
      { day: 6, title: "Explorando Río", description: "Pan de Azúcar, Lagoa Rodrigo de Freitas y noche en Lapa." },
      { day: 7, title: "Río de Janeiro", description: "Mañana en Copacabana, recorrido por la favela de Rocinha y atardecer en Ipanema." },
      { day: 8, title: "Rumbo al Caribe brasileño", description: "Arraial do Cabo: paseo en barco por playas paradisíacas y aventura en quads por las dunas." },
      { day: 9, title: "Vamos a Búzios", description: "Mañana en Geribá, barbacoa con piscina privada y cena en la Rua das Pedras." },
      { day: 10, title: "Volvemos a Río", description: "Regreso a Río de Janeiro. Recorrido cultural por el centro histórico." },
      { day: 11, title: "Se acaba la aventura", description: "Últimas horas en Río de Janeiro. Vuelo de regreso a casa." },
    ],
    faqs: [
      { question: "¿Es seguro viajar a Brasil en grupo?", answer: "Sí, viajar a Brasil con Travel Hood es seguro. Nuestro coordinador te acompaña durante todo el viaje, planificamos cada traslado y alojamiento para maximizar la seguridad." },
      { question: "¿Necesito visado o vacunas para viajar a Brasil?", answer: "Si eres ciudadano español no necesitas visado para viajes turísticos de hasta 90 días. No hay vacunas obligatorias, pero se recomienda fiebre amarilla y hepatitis." },
      { question: "¿Cuál es el clima en Brasil durante el viaje?", answer: "Brasil ofrece un clima cálido tropical, ideal para disfrutar de sus playas y naturaleza. Las temperaturas suelen ser elevadas durante el día y agradables por la noche." },
      { question: "¿Qué tipo de alojamiento está incluido?", answer: "Disfrutarás de villas privadas, alojamientos con piscina y casas seleccionadas para el máximo confort y autenticidad." },
      { question: "¿Puedo viajar solo/a a Brasil?", answer: "Por supuesto. Muchos de nuestros viajeros llegan solos y encuentran amistades desde el primer día. Travel Hood está pensado para jóvenes aventureros." },
      { question: "¿Cómo funciona el transporte durante el viaje?", answer: "Todos los traslados están cubiertos en vehículo privado, incluyendo viajes entre destinos, excursiones y traslados al aeropuerto." },
      { question: "¿Hay tiempo libre para explorar por mi cuenta?", answer: "Sí, aunque el itinerario está muy completo, tendrás momentos libres para descubrir Brasil a tu ritmo." },
      { question: "¿Cuántas personas viajan en el grupo?", answer: "Los grupos suelen ser reducidos (12-13 personas) para asegurar una experiencia cercana, divertida y personalizada." },
      { question: "¿Qué ropa y equipaje debo llevar?", answer: "Ropa cómoda y ligera, bañador, calzado para caminatas, protección solar y una chaqueta ligera para las noches." },
      { question: "¿Cómo reservo mi plaza?", answer: "Solo tienes que contactar con Travel Hood a través de nuestra web, Instagram o WhatsApp y te informaremos de todos los pasos." },
    ],
    seo: {
      title: "Viaje a Brasil en grupo | Travel Hood",
      description: "Viaje en grupo a Brasil para jóvenes. Playas, Río de Janeiro y naturaleza salvaje. Coordinador 24/7.",
      keywords: "viaje brasil, viaje en grupo brasil, brasil jóvenes, travel hood brasil",
      cuandoViajarTitle: "Cuándo viajar a Brasil | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Brasil: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Brasil | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Brasil? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "28-32°C", rainfall: "Alta", recommendation: "Aceptable", note: "Temporada de lluvias" },
      { month: "Febrero", avgTemp: "28-32°C", rainfall: "Alta", recommendation: "Aceptable", note: "Carnaval" },
      { month: "Marzo", avgTemp: "27-31°C", rainfall: "Media", recommendation: "Buena", note: "Fin de lluvias" },
      { month: "Abril", avgTemp: "25-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "23-28°C", rainfall: "Baja", recommendation: "Ideal", note: "Clima perfecto" },
      { month: "Junio", avgTemp: "22-27°C", rainfall: "Baja", recommendation: "Ideal", note: "Temporada seca" },
      { month: "Julio", avgTemp: "21-26°C", rainfall: "Baja", recommendation: "Ideal", note: "Temporada seca" },
      { month: "Agosto", avgTemp: "22-28°C", rainfall: "Baja", recommendation: "Ideal", note: "Mejor época, Travel Hood opera" },
      { month: "Septiembre", avgTemp: "23-29°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Octubre", avgTemp: "24-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Noviembre", avgTemp: "26-31°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "27-32°C", rainfall: "Alta", recommendation: "Buena", note: "Travel Hood opera" },
    ],
    hasCoordinator: true,
  },
  {
    id: "colombia",
    name: "Colombia",
    slug: "colombia",
    countryId: "co",
    continentId: "south-america",
    description:
      "Medellín, el Eje Cafetero, Cartagena y el Caribe colombiano. Colombia es color, ritmo, café y una de las experiencias más completas de Latinoamérica.",
    shortDescription: "Medellín, café, Caribe y aventura. Colombia en estado puro.",
    heroImage: "/images/hero-colombia.jpg",
    heroImageAlt: "Vista panorámica de Cartagena de Indias con el mar Caribe al fondo",
    highlights: ["Medellín y Comuna 13", "Valle del Cocora", "Eje Cafetero", "Islas del Rosario"],
    idealFor: "Viajeros que buscan variedad total: ciudad, naturaleza, café y playa caribeña",
    climate: "Tropical variado, 20-32°C según región",
    categories: ["aventura", "cultural", "naturaleza", "playa"],
    extraIncluded: ["Vuelos internos", "Traslados principales en furgoneta privada"],
    extraNotIncluded: ["Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"],
    coordinates: { lat: 6.2442, lng: -75.5812 },
    budgetPerDay: { mealCostLow: "3-5€", mealCostMid: "8-15€", beerCost: "1-2€", dailyBudget: "20-35€/día", totalExtras: "220-385€ (11 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Medellín", description: "Traslado al alojamiento y cena de bienvenida para conocer al grupo." },
      { day: 2, title: "Tour por Medellín y Comuna 13", description: "Teleférico, recorrido por Comuna 13 y noche en Provenza." },
      { day: 3, title: "Guatapé y la Piedra del Peñol", description: "Subida a la Piedra del Peñol y paseo en lancha por el embalse." },
      { day: 4, title: "Vuelo al Eje Cafetero", description: "Visita a finca cafetera, paseo por Filandia y traslado a Salento." },
      { day: 5, title: "Valle del Cocora y cascada", description: "Ruta en Jeep Willys por el valle y visita a la cascada de Santa Rita." },
      { day: 6, title: "Termales y relax", description: "Día de descanso en los termales de Santa Rosa de Cabal." },
      { day: 7, title: "Rumbo al Caribe", description: "Vuelo a Santa Marta y tarde libre para disfrutar la costa." },
      { day: 8, title: "Parque Nacional Tayrona", description: "Senderos de selva y tiempo en playas vírgenes del parque." },
      { day: 9, title: "De Santa Marta a Cartagena", description: "Traslado a Cartagena, tour por Getsemaní y centro histórico." },
      { day: 10, title: "Islas del Rosario", description: "Excursión en barco con snorkel en Isla Grande, Cholón y Playa Blanca." },
      { day: 11, title: "Beach club y despedida", description: "Mañana en Tierra Bomba o visita cultural y traslado al aeropuerto." },
    ],
    faqs: [
      { question: "¿Qué moneda se usa en Colombia y cómo pagar?", answer: "La moneda oficial es el peso colombiano (COP). En ciudades grandes se puede pagar con tarjeta, pero conviene llevar efectivo para gastos pequeños y evitar cambios en la calle." },
      { question: "¿Qué ropa debo llevar a Colombia?", answer: "Ropa ligera para zonas cálidas, algo de abrigo para montaña y prendas por capas. Así te adaptas al contraste entre Medellín, Eje Cafetero y Caribe." },
      { question: "¿Cómo es la cultura y qué normas debo tener en cuenta?", answer: "La gente es cercana y hospitalaria. Recomendamos respetar costumbres locales, no mostrar objetos de valor y pedir permiso antes de hacer fotos a personas." },
      { question: "¿Es seguro viajar a Colombia?", answer: "Sí, especialmente en un viaje organizado con coordinador y ruta planificada. Aplicando sentido común, es un destino muy disfrutable para viajar en grupo." },
      { question: "¿Necesito vacunas para viajar a Colombia?", answer: "No hay vacunas obligatorias para la mayoría de viajeros, pero se recomienda consultar un centro de vacunación internacional. La fiebre amarilla es aconsejable para zonas de selva y parques naturales." },
    ],
    seo: {
      title: "Viaje a Colombia en grupo | Travel Hood",
      description: "Viaje en grupo a Colombia para jóvenes. Medellín, Eje Cafetero y Caribe. Coordinador 24/7.",
      keywords: "viaje colombia, viaje en grupo colombia, colombia jóvenes, travel hood colombia",
      cuandoViajarTitle: "Cuándo viajar a Colombia | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Colombia: clima, lluvias y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Colombia | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Colombia? Precios de comida y gasto diario estimado para un viaje de 11 días.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "21-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Temporada seca en gran parte del país" },
      { month: "Febrero", avgTemp: "21-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "21-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Abril", avgTemp: "20-30°C", rainfall: "Alta", recommendation: "Aceptable", note: "Inicio de temporada de lluvias" },
      { month: "Mayo", avgTemp: "20-29°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Junio", avgTemp: "20-29°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Julio", avgTemp: "20-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "20-31°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "20-31°C", rainfall: "Alta", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "20-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "20-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "21-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Inicio de temporada seca" },
    ],
    hasCoordinator: true,
  },
  {
    id: "laponia",
    name: "Laponia",
    slug: "laponia",
    countryId: "fi",
    continentId: "europe",
    description:
      "Auroras boreales, trineo de huskies, saunas bajo la nieve y noches que no olvidarás. Laponia es el viaje más mágico que puedes hacer.",
    shortDescription: "Auroras boreales, huskies y magia bajo la nieve ártica.",
    heroImage: "/images/hero-laponia.jpg",
    heroImageAlt: "Auroras boreales sobre paisaje nevado en Laponia, Finlandia",
    highlights: ["Rovaniemi", "Santa Claus Village", "Trineo de huskies", "Sauna en lago congelado"],
    idealFor: "Quienes buscan experiencias únicas e irrepetibles",
    climate: "Ártico, -15 a -5°C",
    categories: ["nieve", "aventura", "naturaleza"],
    extraIncluded: ["Paseo en trineo con huskies", "Paseo en moto de nieve", "Esquí/Snowboard con forfait y equipo", "Entrada a sauna con lago congelado"],
    extraNotIncluded: [],
    coordinates: { lat: 66.5039, lng: 25.7294 },
    budgetPerDay: { mealCostLow: "8-12€", mealCostMid: "18-30€", beerCost: "6-8€", dailyBudget: "30-50€/día", totalExtras: "150-250€ (5 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Rovaniemi", description: "Traslado al hotel, check-in y primera toma de contacto con el grupo." },
      { day: 2, title: "Huskies + Santa Claus Village", description: "Paseo en trineo tirado por huskies por paisajes blancos. Visita al Santa Claus Village: cruce del Círculo Polar Ártico y oficina de Papá Noel." },
      { day: 3, title: "Moto de nieve + Sauna en lago congelado", description: "Paseo en moto de nieve por bosques y lagos helados. Sauna tradicional finlandesa con opción de baño en lago congelado." },
      { day: 4, title: "Esquí / Snowboard", description: "Día de esquí o snowboard en estación cercana a Rovaniemi con forfait y equipo incluido. Pistas para todos los niveles." },
      { day: 5, title: "Se acaba la aventura", description: "Mañana libre para disfrutar los últimos momentos en Rovaniemi. Traslado al aeropuerto." },
    ],
    faqs: [
      { question: "¿Hace mucho frío? ¿Es soportable?", answer: "Las temperaturas pueden ser bajo cero (entre -5°C y -25°C), pero con la ropa adecuada es totalmente llevadero. Muchas actividades incluyen equipamiento térmico." },
      { question: "¿Necesito experiencia previa para las actividades?", answer: "No. Tanto el paseo en huskies, la moto de nieve como el esquí están adaptados a todos los niveles." },
      { question: "¿Qué tipo de ropa debo llevar?", answer: "Ropa térmica, varias capas, guantes, gorro y calzado impermeable. En actividades como huskies o moto de nieve se proporciona equipamiento específico." },
      { question: "¿Es obligatorio bañarse en el lago congelado?", answer: "Para nada. Es una experiencia opcional. Puedes disfrutar de la sauna igualmente sin meterte al agua." },
    ],
    seo: {
      title: "Viaje a Laponia en grupo | Travel Hood",
      description: "Viaje en grupo a Laponia para jóvenes. Auroras boreales, huskies y nieve ártica. Coordinador 24/7.",
      keywords: "viaje laponia, viaje en grupo laponia, laponia jóvenes, travel hood laponia",
      cuandoViajarTitle: "Cuándo viajar a Laponia | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Laponia: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Laponia | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Laponia? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "-15 a -5°C", rainfall: "Baja", recommendation: "Buena", note: "Nieve y auroras" },
      { month: "Febrero", avgTemp: "-12 a -3°C", rainfall: "Baja", recommendation: "Buena", note: "Nieve y más luz" },
      { month: "Marzo", avgTemp: "-8 a 0°C", rainfall: "Baja", recommendation: "Buena", note: "Últimas auroras" },
      { month: "Abril", avgTemp: "-3 a 5°C", rainfall: "Baja", recommendation: "Aceptable", note: "Deshielo" },
      { month: "Mayo", avgTemp: "2-10°C", rainfall: "Media", recommendation: "No recomendado" },
      { month: "Junio", avgTemp: "8-18°C", rainfall: "Media", recommendation: "Aceptable", note: "Sol de medianoche" },
      { month: "Julio", avgTemp: "12-22°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Agosto", avgTemp: "10-18°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Septiembre", avgTemp: "5-12°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Octubre", avgTemp: "-2 a 5°C", rainfall: "Media", recommendation: "Buena", note: "Primeras auroras" },
      { month: "Noviembre", avgTemp: "-8 a -1°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "-12 a -5°C", rainfall: "Baja", recommendation: "Ideal", note: "Navidad y auroras, Travel Hood opera" },
    ],
    hasCoordinator: true,
  },
  {
    id: "maldivas",
    name: "Maldivas",
    slug: "maldivas",
    countryId: "mv",
    continentId: "asia",
    description:
      "Aguas cristalinas, bungalows sobre el agua, snorkel con mantas raya y atardeceres que parecen de película. Maldivas es el paraíso hecho destino.",
    shortDescription: "Paraíso cristalino, bungalows y snorkel con mantas raya.",
    heroImage: "/images/hero-maldivas.jpg",
    heroImageAlt: "Aguas turquesa y banco de arena blanca en las islas Maldivas",
    highlights: ["Maafushi", "Kaafu Atoll", "Vaavu Atoll", "Isla desierta"],
    idealFor: "Quienes sueñan con el paraíso y quieren vivirlo en buena compañía",
    climate: "Tropical, 27-31°C",
    categories: ["playa", "naturaleza"],
    extraIncluded: ["2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"],
    extraNotIncluded: ["Visado"],
    coordinates: { lat: 3.9417, lng: 73.5331 },
    budgetPerDay: { mealCostLow: "5-8€", mealCostMid: "12-20€", beerCost: "3-5€", dailyBudget: "25-40€/día", totalExtras: "180-280€ (7 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Malé", description: "Recogida en el aeropuerto y speedboat privado a Maafushi. Check-in y descanso." },
      { day: 2, title: "Kaafu Atoll — Half Day Adventure", description: "Snorkel en Coral Garden, Turtle Point, Dolphin Bay y Nemo's Reef. Comida incluida en Guraidhoo. Fotos y vídeos underwater." },
      { day: 3, title: "Día libre en Maafushi", description: "Relax en la playa local. Opciones: inmersión con botella, moto de agua, Whaleshark Trip o Night Snorkel." },
      { day: 4, title: "Vaavu Atoll — Shark Bay", description: "Snorkel con tiburones nodriza, delfines y rayas. Barco hundido. Comida incluida. Visita a Thinadhoo." },
      { day: 5, title: "Kaafu Atoll — Island Hopping", description: "Visita a isla local de Gulhi, Bikini Beach, sandbank paradisíaco y comida incluida." },
      { day: 6, title: "Sunset & Bonfire Night", description: "Atardecer en isla desierta. Cena de despedida con hoguera y música en la playa." },
      { day: 7, title: "Se acaba la aventura", description: "Mañana libre en Maafushi. Traslado al aeropuerto y vuelta a casa." },
    ],
    faqs: [
      { question: "¿Cuáles son las ventajas de viajar en grupo reducido a Maldivas?", answer: "Atención personalizada, mayor flexibilidad, experiencias exclusivas y un ambiente más cercano para hacer amistades." },
      { question: "¿Es un viaje recomendado para parejas o solo para grupos de amigos?", answer: "Es ideal tanto para parejas como para grupos de amigos o viajeros solitarios que quieren conocer gente nueva." },
      { question: "¿Cómo es el transporte entre las islas?", answer: "El traslado es en lancha rápida." },
      { question: "¿Es necesario vacunarse antes de viajar a Maldivas?", answer: "No hay vacunas obligatorias, pero se recomienda estar al día con las vacunas de rutina." },
      { question: "¿Es Maldivas un destino caro para viajar en grupo?", answer: "Viajar en grupo reducido permite compartir costos, haciendo Maldivas más asequible. Hay opciones de guesthouses en islas locales económicas." },
      { question: "¿Se puede pagar con tarjeta de crédito en Maldivas?", answer: "Sí, en la mayoría de resorts y restaurantes. En islas locales es útil llevar algo de efectivo en dólares." },
    ],
    seo: {
      title: "Viaje a Maldivas en grupo | Travel Hood",
      description: "Viaje en grupo a Maldivas para jóvenes. Snorkel, islas paradisíacas y experiencias únicas. Coordinador 24/7.",
      keywords: "viaje maldivas, viaje en grupo maldivas, maldivas jóvenes, travel hood maldivas",
      cuandoViajarTitle: "Cuándo viajar a Maldivas | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Maldivas: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Maldivas | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Maldivas? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Temporada seca" },
      { month: "Febrero", avgTemp: "27-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "28-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "28-32°C", rainfall: "Media", recommendation: "Buena", note: "Transición" },
      { month: "Mayo", avgTemp: "28-31°C", rainfall: "Alta", recommendation: "Aceptable", note: "Inicio monzón" },
      { month: "Junio", avgTemp: "27-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Julio", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Noviembre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
    ],
    hasCoordinator: true,
  },
  {
    id: "zanzibar",
    name: "Zanzíbar",
    slug: "zanzibar",
    countryId: "tz",
    continentId: "africa",
    description:
      "La isla de las especias te sorprende con playas de arena blanca, aguas turquesa y una cultura que mezcla África con el Índico. Zanzíbar es aventura tropical con alma africana.",
    shortDescription: "La isla de las especias: playas blancas, cultura y aventura africana.",
    heroImage: "/images/hero-zanzibar.jpg",
    heroImageAlt: "Playa de arena blanca y aguas turquesa en Nungwi, Zanzíbar",
    highlights: ["Nungwi", "Mnemba Island", "Stone Town", "Bahía de Menai"],
    idealFor: "Aventureros que buscan destinos menos masificados",
    climate: "Tropical, 25-33°C",
    categories: ["playa", "naturaleza", "aventura", "cultural"],
    extraIncluded: ["2 excursiones de snorkel con equipamiento y comida", "Visita a Mnemba y Prison Island", "Entrada a centro de conservación de tortugas", "Cena de bienvenida y despedida", "Guía local"],
    extraNotIncluded: ["Visado", "Safari en Mikumi (opcional)"],
    coordinates: { lat: -5.7264, lng: 39.2983 },
    budgetPerDay: { mealCostLow: "2-4€", mealCostMid: "6-12€", beerCost: "1,5-3€", dailyBudget: "15-25€/día", totalExtras: "120-200€ (8 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Zanzíbar", description: "Recogida en el aeropuerto y traslado al hotel boutique en Nungwi. Cena de bienvenida." },
      { day: 2, title: "Mnemba Island", description: "Excursión a Mnemba Island: snorkel con delfines y almuerzo de mariscos. Atardecer en playa de Kendwa." },
      { day: 3, title: "Stone Town + Prison Island", description: "Granja de especias, Prison Island con tortugas gigantes, sandbank Nakupenda y Stone Town (Patrimonio de la Humanidad)." },
      { day: 4, title: "Día libre en Zanzíbar", description: "Día libre para relajarse en el hotel, explorar la zona o actividades opcionales como kitesurfing o buceo." },
      { day: 5, title: "Día libre / Safari en Mikumi", description: "Opcional: vuelo a Tanzania para safari en Parque Nacional de Mikumi. O día libre en la playa." },
      { day: 6, title: "Blue Safari", description: "Barco al Área de Conservación de la Bahía de Menai. Snorkel, fruta y marisco incluidos." },
      { day: 7, title: "Día libre", description: "Último día de actividades pendientes y relax. Cena de despedida." },
      { day: 8, title: "Se acaba la aventura", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es un viaje de relax o de actividades?", answer: "Es un equilibrio perfecto. Tienes días con experiencias organizadas y otros libres para relajarte o hacer actividades opcionales." },
      { question: "¿Es seguro viajar a Zanzíbar?", answer: "Sí, es un destino turístico muy popular. Además, contarás con guía local y coordinador durante todo el viaje." },
      { question: "¿Necesito experiencia para hacer snorkel o buceo?", answer: "No. El snorkel es apto para todos y el buceo se puede hacer con instructores." },
      { question: "¿Merece la pena hacer el safari en Tanzania?", answer: "Totalmente. Es una experiencia única en la vida. Aun así, es opcional por si prefieres quedarte disfrutando de la playa." },
    ],
    seo: {
      title: "Viaje a Zanzíbar en grupo | Travel Hood",
      description: "Viaje en grupo a Zanzíbar para jóvenes. Playas paradisíacas, snorkel y cultura africana. Coordinador 24/7.",
      keywords: "viaje zanzibar, viaje en grupo zanzibar, zanzibar jóvenes, travel hood zanzibar",
      cuandoViajarTitle: "Cuándo viajar a Zanzíbar | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Zanzíbar: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Zanzíbar | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Zanzíbar? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "27-32°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Febrero", avgTemp: "27-33°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "27-32°C", rainfall: "Alta", recommendation: "Aceptable", note: "Inicio lluvias" },
      { month: "Abril", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "No recomendado", note: "Lluvias fuertes" },
      { month: "Mayo", avgTemp: "25-29°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Junio", avgTemp: "24-29°C", rainfall: "Baja", recommendation: "Ideal", note: "Temporada seca" },
      { month: "Julio", avgTemp: "23-28°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Agosto", avgTemp: "23-29°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Septiembre", avgTemp: "24-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Octubre", avgTemp: "25-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Noviembre", avgTemp: "26-31°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "27-31°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
    ],
    hasCoordinator: true,
  },
  {
    id: "islandia",
    name: "Islandia",
    slug: "islandia",
    countryId: "is",
    continentId: "europe",
    description:
      "Géiseres, cascadas imposibles, glaciares y aguas termales. Islandia es naturaleza en estado puro, el paisaje más brutal de Europa.",
    shortDescription: "Cascadas, glaciares y aguas termales. Naturaleza extrema en Europa.",
    heroImage: "/images/hero-laponia.jpg",
    heroImageAlt: "Cascada Skógafoss bajo cielo nórdico en Islandia",
    highlights: ["Círculo Dorado", "Diamond Beach", "Glaciar Jökulsárlón", "Skógafoss y Seljalandsfoss"],
    idealFor: "Amantes de la naturaleza salvaje y los paisajes dramáticos",
    climate: "Subártico, 0-15°C",
    categories: ["naturaleza", "aventura", "nieve"],
    extraIncluded: ["Chófer durante todo el recorrido", "Gasolina y parking", "Entradas a termas"],
    extraNotIncluded: [],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    budgetPerDay: { mealCostLow: "10-15€", mealCostMid: "25-40€", beerCost: "8-10€", dailyBudget: "40-60€/día", totalExtras: "320-480€ (8 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Islandia", description: "Recogida en el aeropuerto de Keflavík y traslado al alojamiento." },
      { day: 2, title: "Cráteres, cascadas y géiseres", description: "Cráter Kitter, cascada de Bruararfoss, géiseres de Haukadalur y cascada de Gullfoss. Noche en cabañas junto al río con auroras boreales." },
      { day: 3, title: "Termas con vistas al mar", description: "Ruta hacia el noroeste. Pueblo pesquero y termas para relajarse." },
      { day: 4, title: "Ruta de cascadas y zona geotermal", description: "Cascadas Godafoss, Dettifoss y Fosholl. Zona geotermal Námafjall, un paisaje marciano." },
      { day: 5, title: "Termas y traslado al sur", description: "Termas Vök con opción de baño en lago congelado. Playa de arena negra de Fauskasandur." },
      { day: 6, title: "Icebergs y arena negra", description: "Diamond Beach con bloques de hielo. Glaciar Jökulsárlón con focas. Playa de Reynisfjara." },
      { day: 7, title: "Cascadas legendarias y glaciar", description: "Skógafoss, Seljalandsfoss, Gluggafoss. Avión abandonado. Glaciar Sólheimajökull. Paseo por Reikiavik." },
      { day: 8, title: "Vuelta a casa", description: "Traslado al aeropuerto y fin de la aventura." },
    ],
    faqs: [
      { question: "¿Es seguro conducir en Islandia?", answer: "Sí. Nuestro viaje incluye chófer, por lo que no tendrás que preocuparte." },
      { question: "¿Qué ropa debo llevar?", answer: "Ropa térmica, impermeable, botas de trekking, gorro, guantes y bañador para las termas." },
      { question: "¿Necesito visado para viajar a Islandia desde España?", answer: "No, Islandia pertenece al espacio Schengen, solo necesitas tu DNI o pasaporte." },
      { question: "¿Hace mucho frío en Islandia?", answer: "En otoño las temperaturas rondan los -1 a 4°C. Es un frío seco y soportable con buena ropa." },
      { question: "¿Se necesita experiencia previa para las actividades?", answer: "No. Todo está diseñado para disfrutar sin necesidad de conocimientos técnicos." },
    ],
    seo: {
      title: "Viaje a Islandia en grupo | Travel Hood",
      description: "Viaje en grupo a Islandia para jóvenes. Cascadas, glaciares, auroras boreales y termas. Coordinador 24/7.",
      keywords: "viaje islandia, viaje en grupo islandia, islandia jóvenes, travel hood islandia",
      cuandoViajarTitle: "Cuándo viajar a Islandia | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Islandia: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Islandia | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Islandia? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "-3 a 2°C", rainfall: "Media", recommendation: "Buena", note: "Auroras boreales" },
      { month: "Febrero", avgTemp: "-2 a 3°C", rainfall: "Media", recommendation: "Buena", note: "Auroras boreales" },
      { month: "Marzo", avgTemp: "-1 a 4°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Abril", avgTemp: "1-7°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "4-10°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Junio", avgTemp: "7-13°C", rainfall: "Baja", recommendation: "Ideal", note: "Sol de medianoche" },
      { month: "Julio", avgTemp: "9-14°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Agosto", avgTemp: "8-13°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Septiembre", avgTemp: "5-10°C", rainfall: "Media", recommendation: "Ideal", note: "Auroras + buen tiempo, Travel Hood opera" },
      { month: "Octubre", avgTemp: "2-7°C", rainfall: "Media", recommendation: "Ideal", note: "Auroras boreales, Travel Hood opera" },
      { month: "Noviembre", avgTemp: "-1 a 4°C", rainfall: "Media", recommendation: "Buena", note: "Auroras boreales" },
      { month: "Diciembre", avgTemp: "-3 a 2°C", rainfall: "Media", recommendation: "Buena", note: "Auroras y navidad" },
    ],
    hasCoordinator: true,
  },
  {
    id: "egipto",
    name: "Egipto",
    slug: "egipto",
    countryId: "eg",
    continentId: "africa",
    description:
      "Las Pirámides, el Nilo, templos faraónicos y el desierto. 5.000 años de historia en un viaje que te deja sin palabras.",
    shortDescription: "Pirámides, el Nilo y 5.000 años de historia en un solo viaje.",
    heroImage: "/images/hero-zanzibar.jpg",
    heroImageAlt: "Pirámides de Giza al atardecer con el desierto de fondo, Egipto",
    highlights: ["Pirámides de Giza", "Valle de los Reyes", "Luxor", "Mar Rojo"],
    idealFor: "Apasionados de la historia y las civilizaciones antiguas",
    climate: "Desértico, 20-40°C",
    categories: ["cultural", "aventura"],
    extraIncluded: ["Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"],
    extraNotIncluded: ["Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"],
    coordinates: { lat: 30.0444, lng: 31.2357 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "5-10€", beerCost: "2-3€", dailyBudget: "15-25€/día", totalExtras: "120-200€ (8 días)" },
    itinerary: [
      { day: 1, title: "Llegada a El Cairo", description: "Recepción en el aeropuerto y traslado al hotel. Tiempo para descansar." },
      { day: 2, title: "Pirámides, Saqqara y quads", description: "Pirámides de Guiza, Esfinge y necrópolis de Saqqara. Ruta en quads por el desierto." },
      { day: 3, title: "Desierto de Faium y crucero por el Nilo", description: "Excursión al desierto de Faium. Crucero por el Nilo con cena y espectáculo tradicional." },
      { day: 4, title: "Cultura y vuelo a Luxor", description: "Museo de El Cairo, barrio Copto, Ciudadela y mercado de Khan Khalili. Vuelo nocturno a Luxor." },
      { day: 5, title: "Amanecer en globo y templos del oeste", description: "Opción de vuelo en globo. Templo de Hatshepsut, Valle de los Reyes y Colosos de Memnón." },
      { day: 6, title: "Templos de Luxor y traslado a Hurghada", description: "Templos de Karnak y Luxor. Traslado a la costa del Mar Rojo." },
      { day: 7, title: "Snorkel en el Mar Rojo", description: "Día completo de snorkel en aguas cristalinas con comida a bordo. Tarde libre en el resort." },
      { day: 8, title: "Relax y regreso", description: "Mañana libre para relajarse. Traslado al aeropuerto para el vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es seguro viajar a Egipto?", answer: "Sí, es un destino muy turístico y las rutas están bien organizadas. Viajarás acompañado con guías y coordinador." },
      { question: "¿Hace mucho calor?", answer: "Depende de la época, pero suele hacer calor, especialmente en Luxor. Las visitas se organizan temprano para evitar las horas más fuertes." },
      { question: "¿Es un viaje muy intenso?", answer: "Tiene bastante contenido cultural, pero está equilibrado con experiencias diferentes y tiempo de relax en el Mar Rojo." },
      { question: "¿Necesito experiencia para snorkel o quads?", answer: "No. Son actividades aptas para principiantes y con supervisión." },
      { question: "¿El vuelo en globo está incluido?", answer: "No, es opcional. Puedes decidir allí si hacerlo según el clima y disponibilidad." },
    ],
    seo: {
      title: "Viaje a Egipto en grupo | Travel Hood",
      description: "Viaje en grupo a Egipto para jóvenes. Pirámides, Luxor, Nilo y Mar Rojo. Coordinador 24/7.",
      keywords: "viaje egipto, viaje en grupo egipto, egipto jóvenes, travel hood egipto",
      cuandoViajarTitle: "Cuándo viajar a Egipto | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Egipto: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Egipto | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Egipto? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "10-20°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "11-22°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "14-25°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "18-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Mayo", avgTemp: "22-35°C", rainfall: "Baja", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Junio", avgTemp: "25-38°C", rainfall: "Baja", recommendation: "Aceptable", note: "Calor intenso" },
      { month: "Julio", avgTemp: "26-38°C", rainfall: "Baja", recommendation: "Aceptable", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "26-37°C", rainfall: "Baja", recommendation: "Aceptable" },
      { month: "Septiembre", avgTemp: "24-35°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Octubre", avgTemp: "20-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Noviembre", avgTemp: "15-25°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "11-21°C", rainfall: "Baja", recommendation: "Ideal" },
    ],
    hasCoordinator: true,
  },
  // ─── NUEVOS DESTINOS (fillDestination) ───
  {
    id: "lofoten",
    name: "Lofoten",
    slug: "lofoten",
    countryId: "no",
    continentId: "europe",
    description: "Fiordos, playas árticas de arena blanca, pueblos pesqueros de postal y hikes con vistas que cortan la respiración. Lofoten es Noruega en estado salvaje y puro.",
    shortDescription: "Fiordos, playas árticas y pueblos de postal en el norte de Noruega.",
    heroImage: "",
    heroImageAlt: "Vista panorámica de los fiordos y pueblos pesqueros de Lofoten, Noruega",
    highlights: ["Reinebringen", "Reine", "Henningsvær", "Museo Vikingo"],
    idealFor: "Amantes de la naturaleza, el trekking y los paisajes épicos",
    climate: "Subártico oceánico, 8-15°C en verano",
    categories: ["naturaleza", "aventura", "playa", "cultural"],
    extraIncluded: ["Traslados incluido ferry y gasolina", "Entrada al museo Vikingo", "Actividades (termas/sauna, kayaks)", "Itinerarios de trekking completos"],
    extraNotIncluded: [],
    coordinates: { lat: 68.2342, lng: 14.5684 },
    budgetPerDay: { mealCostLow: "8-12€", mealCostMid: "18-30€", beerCost: "7-9€", dailyBudget: "30-50€/día", totalExtras: "270-450€ (9 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Lofoten", description: "Llegada y traslado al alojamiento. Tiempo para instalarse y preparar el roadtrip." },
      { day: 2, title: "Henningsvær + Gimsøya", description: "Exploración de Henningsvær con su icónico campo de fútbol. Subida a Festvågtind y visita a Gimsøya con playas salvajes." },
      { day: 3, title: "Flakstad + Ramberg + Ryten", description: "Ruta por la costa oeste: iglesia de Flakstad, playa de Ramberg y hike de Ryten con vistas brutales al mar." },
      { day: 4, title: "Reine, Å + Kayak + Reinebringen", description: "Pueblo de Å, Reine y kayak en el fiordo. Subida a Reinebringen, el mirador más espectacular de las islas." },
      { day: 5, title: "Excursión a Skrova", description: "Ferry a Skrova, isla poco turística. Playas y subida a su montaña con vistas de postal." },
      { day: 6, title: "Nusfjord + Offersøykammen", description: "Visita a Nusfjord, pueblo con encanto. Hike de Offersøykammen con mirador increíble." },
      { day: 7, title: "Kabelvåg + Svolvær + Spa", description: "Visita a Kabelvåg, parada en pastelería Hjørnet, Svolvær y spa en Skårungen." },
      { day: 8, title: "Vikingos + Playas + Surf Ártico", description: "Museo Vikingo, Unstad Arctic Surf, playas de Haukland y Uttakleiv. Subida a Mannen." },
      { day: 9, title: "Se acaba la aventura", description: "Mañana libre y traslado al aeropuerto." },
    ],
    faqs: [
      { question: "¿Es un viaje exigente físicamente?", answer: "Tiene varias caminatas, pero son accesibles para cualquier persona con condición física normal. Siempre hay opciones más tranquilas." },
      { question: "¿Necesito experiencia previa para kayak o hikes?", answer: "No. Las actividades están pensadas para todos los niveles y se adaptan al grupo." },
      { question: "¿Cómo son los alojamientos?", answer: "Alojamiento cómodo en ubicaciones estratégicas para aprovechar al máximo el itinerario." },
      { question: "¿Voy a encajar si voy solo/a?", answer: "Sí, es en grupo reducido y suele haber muy buen ambiente. Mucha gente viaja sola y acaba haciendo piña desde el primer día." },
    ],
    seo: {
      title: "Viaje a Lofoten en grupo | Travel Hood",
      description: "Viaje en grupo a Lofoten para jóvenes. Fiordos, playas árticas y trekking épico. Coordinador 24/7.",
      keywords: "viaje lofoten, viaje en grupo lofoten, lofoten jóvenes, travel hood lofoten, noruega jóvenes",
      cuandoViajarTitle: "Cuándo viajar a Lofoten | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Lofoten: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Lofoten | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Lofoten? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "-2 a 1°C", rainfall: "Media", recommendation: "No recomendado", note: "Oscuridad polar" },
      { month: "Febrero", avgTemp: "-2 a 2°C", rainfall: "Media", recommendation: "Aceptable", note: "Auroras boreales" },
      { month: "Marzo", avgTemp: "-1 a 3°C", rainfall: "Baja", recommendation: "Buena", note: "Auroras y más luz" },
      { month: "Abril", avgTemp: "1-6°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "5-10°C", rainfall: "Baja", recommendation: "Buena", note: "Sol de medianoche" },
      { month: "Junio", avgTemp: "8-14°C", rainfall: "Baja", recommendation: "Ideal", note: "Sol de medianoche, Travel Hood opera" },
      { month: "Julio", avgTemp: "10-16°C", rainfall: "Baja", recommendation: "Ideal", note: "Mejor época, Travel Hood opera" },
      { month: "Agosto", avgTemp: "10-15°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Septiembre", avgTemp: "7-11°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Octubre", avgTemp: "3-7°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "0-4°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "-1 a 2°C", rainfall: "Media", recommendation: "Aceptable", note: "Auroras boreales" },
    ],
    hasCoordinator: true,
  },
  {
    id: "azores",
    name: "Azores",
    slug: "azores",
    countryId: "pt",
    continentId: "europe",
    description: "Volcanes, lagos de cráter, termas naturales y cascadas en medio del Atlántico. Azores es naturaleza en estado puro a solo 2 horas de vuelo.",
    shortDescription: "Lagos volcánicos, termas naturales y cascadas en el Atlántico.",
    heroImage: "",
    heroImageAlt: "Lago de cráter de Sete Cidades rodeado de vegetación en Azores, Portugal",
    highlights: ["Sete Cidades", "Termas de Furnas", "Isla de Vila Franca", "Lago Azul"],
    idealFor: "Amantes de la naturaleza y los paisajes volcánicos únicos",
    climate: "Oceánico templado, 18-25°C en verano",
    categories: ["naturaleza", "aventura", "playa"],
    extraIncluded: ["Alojamiento en casa exclusiva con piscina", "Actividades y excursiones naturales y culturales cada día"],
    extraNotIncluded: [],
    coordinates: { lat: 37.7483, lng: -25.6666 },
    budgetPerDay: { mealCostLow: "5-8€", mealCostMid: "10-18€", beerCost: "2-3€", dailyBudget: "20-35€/día", totalExtras: "140-245€ (7 días)" },
    itinerary: [
      { day: 1, title: "Bienvenida natural", description: "Lagoa do Congro, cascada Salto do Cabrito, barco a Isla de Vila Franca y piscina natural de Caloura." },
      { day: 2, title: "Ruta de miradores y pozos secretos", description: "Ermita Nossa Senhora da Paz, Fábrica de Té Gorreana, Pozo Azul Achadinha, cascada Salto da Farinha y Poza de Doña Beija." },
      { day: 3, title: "Miradores y atardecer de ensueño", description: "Miradouro da Vista do Rei, Ruinas Monte Palace, Lagoa do Canário, Grota do Inferno y atardecer en Mosteiros Beach." },
      { day: 4, title: "Aventura en la naturaleza y kayak", description: "Mirador das Cumeeiras, piscinas Caneiros, kayak en Lago Azul y miradores Cerrado das Freiras y Pico Carvão." },
      { day: 5, title: "Cultura y playas", description: "Ribeira Grande, mirador de Cintrao, Playa de Monte Verde y relax en Povoação." },
      { day: 6, title: "Relax y cultura en Furnas", description: "Termas en Terra Nostra, almuerzo con cocido volcánico, cascada Salto do Prego y miradores." },
      { day: 7, title: "Despedida con historia", description: "Paseo por Ponta Delgada: Portas da Cidade, Iglesia de San Sebastián. Regreso al aeropuerto." },
    ],
    faqs: [
      { question: "¿Es un viaje exigente físicamente?", answer: "No demasiado. Hay caminatas suaves y actividades como kayak, pero todo es adaptable al ritmo del grupo." },
      { question: "¿Hace falta experiencia para el kayak?", answer: "No. Son actividades accesibles y se hacen con instrucciones previas." },
      { question: "¿Cómo es el clima en Azores?", answer: "Es cambiante: puedes tener sol, nubes y lluvia en el mismo día. Eso es parte de la magia de la isla." },
      { question: "¿Se puede bañar en las termas y piscinas naturales?", answer: "Sí, es uno de los grandes atractivos. Algunas tienen temperatura caliente y otras son naturales en el mar." },
    ],
    seo: {
      title: "Viaje a Azores en grupo | Travel Hood",
      description: "Viaje en grupo a Azores para jóvenes. Volcanes, termas y naturaleza atlántica. Coordinador 24/7.",
      keywords: "viaje azores, viaje en grupo azores, azores jóvenes, travel hood azores",
      cuandoViajarTitle: "Cuándo viajar a Azores | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Azores: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Azores | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Azores? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "12-16°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Febrero", avgTemp: "12-16°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Marzo", avgTemp: "12-17°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Abril", avgTemp: "13-18°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "14-20°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Junio", avgTemp: "17-23°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Julio", avgTemp: "19-25°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "20-26°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Septiembre", avgTemp: "19-24°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Octubre", avgTemp: "16-21°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Noviembre", avgTemp: "14-18°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "13-17°C", rainfall: "Alta", recommendation: "Aceptable" },
    ],
    hasCoordinator: true,
  },
  {
    id: "camino-de-santiago",
    name: "Camino de Santiago",
    slug: "camino-de-santiago",
    countryId: "es",
    continentId: "europe",
    description: "Próximamente",
    shortDescription: "Próximamente",
    heroImage: "",
    highlights: [],
    idealFor: "Aventureros y peregrinos",
    climate: "Atlántico templado",
    categories: ["aventura", "cultural", "naturaleza"],
    coordinates: { lat: 42.8782, lng: -8.5448 },
    hasCoordinator: true,
  },
  {
    id: "indonesia",
    name: "Indonesia",
    slug: "indonesia",
    countryId: "id",
    continentId: "asia",
    description: "Templos milenarios, arrozales infinitos, volcanes al amanecer, islas paradisíacas y una cultura que te atrapa desde el primer momento. Indonesia es el viaje completo que todo joven debería hacer.",
    shortDescription: "Templos, volcanes, surf y playas de ensueño en el corazón de Asia.",
    heroImage: "",
    heroImageAlt: "Templo Uluwatu al atardecer con vistas al océano en Bali, Indonesia",
    highlights: ["Uluwatu", "Volcán Batur", "Islas Gili", "Lombok"],
    idealFor: "Viajeros que buscan aventura, cultura y playa en un solo viaje",
    climate: "Tropical, 27-32°C",
    categories: ["playa", "cultural", "naturaleza", "aventura"],
    extraIncluded: ["Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"],
    extraNotIncluded: ["Traslados opcionales (motos, taxis)"],
    coordinates: { lat: -8.5069, lng: 115.2625 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "15-25€/día", totalExtras: "210-350€ (14 días)" },
    itinerary: [
      { day: 1, title: "Uluwatu y Canggu (Bali Sur)", description: "Playas como Padang Padang y Melasti, danza Kecak al atardecer en Templo Uluwatu." },
      { day: 2, title: "Uluwatu y Canggu", description: "Beach clubs en Canggu, surf y ambiente joven." },
      { day: 3, title: "Uluwatu y Canggu", description: "Más playas espectaculares y atardeceres épicos." },
      { day: 4, title: "Norte de Bali: Templos y arrozales", description: "Templos Tanah Lot, Ulun Danu, Puerta de Bali Handara. Arrozales de Jatiluwih (Patrimonio de la Humanidad)." },
      { day: 5, title: "Cascadas y selva", description: "Caminata por la selva, canoa en lago Tamblingan y cascada Git Git." },
      { day: 6, title: "Ubud: Rafting y ATV", description: "Rafting por ríos salvajes y aventura en ATV por la selva." },
      { day: 7, title: "Volcán Batur y templos", description: "Amanecer desde el volcán Batur, aguas termales, Tirta Empul y Monkey Forest de Ubud." },
      { day: 8, title: "Islas Gili: llegada", description: "Fast boat a Gili Trawangan. Snorkel entre tortugas y arrecifes." },
      { day: 9, title: "Islas Gili: paraíso", description: "Vida nocturna en la playa, relax total en hamacas y bicicletas." },
      { day: 10, title: "Islas Gili: libertad", description: "Más snorkel, buceo opcional y atardeceres." },
      { day: 11, title: "Lombok: playas vírgenes", description: "Clases de surf y relax en playas Mawun y Selong Belanak." },
      { day: 12, title: "Lombok: miradores", description: "Atardecer en Bukit Merese, trekking a cascada Benang Stokel." },
      { day: 13, title: "Lombok: cultura", description: "Clase de yoga entre arrozales, Pueblo Sasak y experiencia culinaria." },
      { day: 14, title: "Fin del viaje", description: "Últimos momentos y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es un viaje exigente físicamente?", answer: "No especialmente. Hay actividades como el volcán Batur o rafting, pero son opcionales o adaptables." },
      { question: "¿Cómo son los alojamientos?", answer: "Alojamientos cómodos y bien ubicados, pensados para disfrutar del entorno y la experiencia local." },
      { question: "¿Es seguro viajar a Bali, Gili y Lombok?", answer: "Sí, son destinos muy turísticos y seguros. Viajarás acompañado/a por el coordinador y guías locales." },
      { question: "¿Necesito experiencia para surf o snorkel?", answer: "No. Todo está pensado para principiantes, con instructores y apoyo en cada actividad." },
    ],
    seo: {
      title: "Viaje a Indonesia en grupo | Travel Hood",
      description: "Viaje en grupo a Indonesia para jóvenes. Bali, Gili y Lombok: templos, surf y playas. Coordinador 24/7.",
      keywords: "viaje indonesia, viaje en grupo indonesia, bali jóvenes, travel hood indonesia",
      cuandoViajarTitle: "Cuándo viajar a Indonesia | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Indonesia: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Indonesia | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Indonesia? Precios de comida, transporte y gastos diarios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable", note: "Temporada de lluvias" },
      { month: "Febrero", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Marzo", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Abril", avgTemp: "27-31°C", rainfall: "Media", recommendation: "Buena", note: "Transición" },
      { month: "Mayo", avgTemp: "27-31°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Junio", avgTemp: "26-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Julio", avgTemp: "26-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "26-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "27-31°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "27-31°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Noviembre", avgTemp: "27-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Diciembre", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
    ],
    hasCoordinator: true,
  },
  {
    id: "tailandia-verano",
    name: "Tailandia — Verano",
    slug: "tailandia-verano",
    countryId: "th",
    continentId: "asia",
    description: "Bangkok vibrante, templos dorados en Chiang Mai, elefantes en la selva y las islas más espectaculares del Golfo de Tailandia. La edición verano recorre Koh Samui, Koh Tao y el Parque Nacional Ang Thong.",
    shortDescription: "Bangkok, Chiang Mai, Koh Samui y Koh Tao en la edición veraniega.",
    heroImage: "",
    heroImageAlt: "Islas del Parque Nacional Ang Thong desde el mar en Tailandia",
    highlights: ["Bangkok", "Chiang Mai", "Koh Samui", "Koh Tao", "Ang Thong"],
    idealFor: "Quienes buscan cultura, playa y aventura en pleno verano asiático",
    climate: "Tropical, 28-35°C, lluvias puntuales",
    categories: ["playa", "cultural", "aventura"],
    extraIncluded: ["Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"],
    extraNotIncluded: ["Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"],
    coordinates: { lat: 13.7563, lng: 100.5018 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "15-25€/día", totalExtras: "195-350€ (14 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Bangkok", description: "Check-in y cena de bienvenida. Primera noche en la capital tailandesa." },
      { day: 2, title: "Bangkok en estado puro", description: "Visita a Wat Pho, Wat Arun y Palacio Real. Cultura e historia de la capital." },
      { day: 3, title: "Excursión a Ayutthaya", description: "Ruinas históricas de la antigua capital del reino. Regreso a Bangkok." },
      { day: 4, title: "Rumbo al norte: Chiang Mai", description: "Vuelo a Chiang Mai. Templos, mercados locales y masaje tailandés." },
      { day: 5, title: "Elefantes, trekking y aventura", description: "Santuario ético de elefantes, trekking por la selva y rafting." },
      { day: 6, title: "Paraíso tropical: Koh Samui", description: "Vuelo al sur y barco a Koh Samui. Tarde libre en la playa." },
      { day: 7, title: "Parque Nacional Ang Thong", description: "Islas vírgenes, kayak, snorkel y paisajes de postal." },
      { day: 8, title: "De Koh Samui a Koh Tao", description: "Mañana tranquila y ferry a Koh Tao, la isla del buceo." },
      { day: 9, title: "Buceo y libertad", description: "Día libre en Koh Tao: bucear, explorar calas o relax total." },
      { day: 10, title: "Más buceo, más relax", description: "Otro día libre para descubrir nuevos rincones de la isla." },
      { day: 11, title: "Koh Nang Yuan y cena BBQ", description: "Excursión a Koh Nang Yuan: snorkel y vistas espectaculares. Cena BBQ de celebración." },
      { day: 12, title: "Vuelta a Bangkok", description: "Vuelo de regreso a Bangkok. Tarde libre para compras." },
      { day: 13, title: "Mercado flotante y cena final", description: "Mercado flotante y cena de despedida con el grupo." },
      { day: 14, title: "Vuelta a casa", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Necesito visado para Tailandia?", answer: "Para ciudadanos españoles, no se necesita visado para estancias menores de 30 días." },
      { question: "¿Cuánto dinero debo llevar para gastos diarios?", answer: "Unos 15-25€ diarios son suficientes para comida, compras y ocio." },
      { question: "¿Es seguro viajar a Tailandia en grupo?", answer: "Sí, en Travel Hood priorizamos tu seguridad con protocolos y coordinadores expertos, además de organización y acompañamiento constante." },
      { question: "¿Qué tipo de ropa debo llevar?", answer: "Ropa ligera, bañadores, calzado cómodo y algo elegante para la cena final." },
      { question: "¿Habrá tiempo libre durante el viaje?", answer: "Sí, el itinerario incluye actividades organizadas y momentos de relax." },
    ],
    seo: {
      title: "Viaje a Tailandia Verano en grupo | Travel Hood",
      description: "Viaje en grupo a Tailandia en verano para jóvenes. Bangkok, Chiang Mai, Koh Samui y Koh Tao. Coordinador 24/7.",
      keywords: "viaje tailandia verano, tailandia en grupo verano, tailandia jóvenes, travel hood tailandia verano",
      cuandoViajarTitle: "Cuándo viajar a Tailandia en verano | Travel Hood",
      cuandoViajarDescription: "Descubre por qué el verano es una gran época para viajar a Tailandia: clima, islas del Golfo y experiencias únicas.",
      presupuestoTitle: "Presupuesto Tailandia Verano | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Tailandia en verano? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "22-32°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "23-33°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "25-34°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Abril", avgTemp: "26-35°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "26-34°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Junio", avgTemp: "26-33°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Julio", avgTemp: "26-33°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "26-33°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "25-32°C", rainfall: "Alta", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "25-32°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "24-32°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Diciembre", avgTemp: "22-31°C", rainfall: "Baja", recommendation: "Ideal" },
    ],
    hasCoordinator: true,
  },
  {
    id: "tailandia-invierno",
    name: "Tailandia — Invierno",
    slug: "tailandia-invierno",
    countryId: "th",
    continentId: "asia",
    description: "La edición invernal de Tailandia explora la costa del Andamán: Krabi, Hong Islands y las míticas Phi Phi. Combinada con Bangkok, Ayutthaya y Chiang Mai, es la versión más completa del país.",
    shortDescription: "Bangkok, Chiang Mai, Krabi y Phi Phi en la edición invernal.",
    heroImage: "",
    heroImageAlt: "Islas Phi Phi con aguas turquesa y acantilados de caliza en Tailandia",
    highlights: ["Bangkok", "Chiang Mai", "Krabi", "Phi Phi Islands", "Hong Islands"],
    idealFor: "Quienes prefieren la costa del Andamán y las islas más icónicas",
    climate: "Tropical, 26-33°C, época seca",
    categories: ["playa", "cultural", "aventura"],
    extraIncluded: ["Traslados principales y ferrys", "Vuelos internos", "Tren nocturno Bangkok→Chiang Mai", "Templos de Chiang Mai", "Santuario de elefantes + trekking + rafting + almuerzo", "Tour Hong Island en lancha + almuerzo", "Tour Phi Phi en barca + almuerzo + snorkel"],
    extraNotIncluded: ["Tuk tuk y grabs", "Templos de Ayutthaya y Bangkok"],
    coordinates: { lat: 13.7563, lng: 100.5018 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "15-25€/día", totalExtras: "195-350€ (13 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Bangkok", description: "Recepción y traslado al hotel. Cena de bienvenida." },
      { day: 2, title: "Bangkok cultural", description: "Templos Wat Pho, Wat Arun y Palacio Real. Tarde y noche libres." },
      { day: 3, title: "Ayutthaya y relax", description: "Excursión a Ayutthaya. Masaje tailandés tradicional." },
      { day: 4, title: "Rumbo a Chiang Mai", description: "Viaje en tren hacia Chiang Mai. Templos y ambiente tranquilo." },
      { day: 5, title: "Elefantes y aventura en la selva", description: "Santuario ético de elefantes, trekking por la selva y rafting." },
      { day: 6, title: "Vuelo al sur — Krabi", description: "Vuelo a Krabi. Tarde libre para disfrutar de la playa." },
      { day: 7, title: "Hong Islands", description: "Excursión en lancha a Hong Island: lagunas escondidas, playas y aguas cristalinas. Almuerzo incluido." },
      { day: 8, title: "Phi Phi Islands", description: "Ferry a Phi Phi. Excursión en barco: Maya Bay, Viking Cave, playas y lagunas." },
      { day: 9, title: "Día libre en Phi Phi", description: "Snorkel, buceo opcional, playas y miradores." },
      { day: 10, title: "Más Phi Phi", description: "Otro día libre para explorar la isla o relajarse frente al mar." },
      { day: 11, title: "Regreso a Bangkok", description: "Vuelo de regreso. Tarde libre para compras." },
      { day: 12, title: "Bangkok a tu ritmo", description: "Chinatown, Parque Lumpini, mercados. Cena de despedida." },
      { day: 13, title: "Fin del viaje", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Necesito visado para Tailandia?", answer: "Para ciudadanos españoles, no se necesita visado para estancias menores de 30 días." },
      { question: "¿Qué tipo de ropa debo llevar?", answer: "Ropa ligera, bañadores, calzado cómodo y algo elegante para la cena final." },
      { question: "¿Hay actividades opcionales?", answer: "Sí: buceo en Phi Phi, masajes, tours adicionales y compras en mercados locales." },
      { question: "¿Es seguro viajar a Tailandia?", answer: "Sí, es uno de los destinos más seguros del sudeste asiático. Además, viajarás acompañado en todo momento." },
    ],
    seo: {
      title: "Viaje a Tailandia Invierno en grupo | Travel Hood",
      description: "Viaje en grupo a Tailandia en invierno para jóvenes. Bangkok, Chiang Mai, Krabi y Phi Phi. Coordinador 24/7.",
      keywords: "viaje tailandia invierno, tailandia en grupo invierno, phi phi jóvenes, travel hood tailandia invierno",
      cuandoViajarTitle: "Cuándo viajar a Tailandia en invierno | Travel Hood",
      cuandoViajarDescription: "Descubre por qué el invierno es ideal para la costa del Andamán en Tailandia: Krabi, Phi Phi y clima perfecto.",
      presupuestoTitle: "Presupuesto Tailandia Invierno | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Tailandia en invierno? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "22-32°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "23-33°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "25-34°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "26-35°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Mayo", avgTemp: "26-34°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Junio", avgTemp: "26-33°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Julio", avgTemp: "26-33°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Agosto", avgTemp: "26-33°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Septiembre", avgTemp: "25-32°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Octubre", avgTemp: "25-32°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Noviembre", avgTemp: "24-32°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "22-31°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
    ],
    hasCoordinator: true,
  },
  {
    id: "filipinas-verano",
    name: "Filipinas — Verano",
    slug: "filipinas-verano",
    countryId: "ph",
    continentId: "asia",
    description: "Island hopping por Siargao, volcanes de Camiguin y las playas vírgenes de Bohol y Panglao. La edición verano de Filipinas recorre la cara más salvaje y auténtica del archipiélago.",
    shortDescription: "Siargao, Camiguin y Bohol: la Filipinas más salvaje y auténtica.",
    heroImage: "",
    heroImageAlt: "Island hopping con barcas tradicionales en aguas turquesa de Siargao, Filipinas",
    highlights: ["Siargao", "Camiguin", "Bohol", "Panglao"],
    idealFor: "Amantes de las islas, el surf y la naturaleza tropical",
    climate: "Tropical, 28-33°C",
    categories: ["playa", "naturaleza", "aventura"],
    extraIncluded: ["Vuelos internos y ferry", "Island Hopping tours con comida", "Tours de un día (Camiguin, Bohol, Anda)", "Guías locales y guía español"],
    extraNotIncluded: ["Visado"],
    coordinates: { lat: 14.5995, lng: 120.9842 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "15-25€/día", totalExtras: "195-325€ (13 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Manila", description: "Llegada y traslado al hotel. Primera toma de contacto con Filipinas." },
      { day: 2, title: "Vuelo a Bohol (Panglao)", description: "Vuelo interno a Bohol y traslado a Panglao. Tarde libre en la playa." },
      { day: 3, title: "Día libre en Panglao", description: "Playas paradisíacas, snorkel, masajes y atardeceres frente al mar." },
      { day: 4, title: "Tour por Bohol y traslado a Anda", description: "Chocolate Hills, tarsiers y pueblos locales. Traslado a Anda." },
      { day: 5, title: "Naturaleza en Bohol y ferry a Camiguin", description: "Norte de Bohol: arrozales, cascadas escondidas y cenote natural. Ferry a Camiguin." },
      { day: 6, title: "Camiguin: la isla de los volcanes", description: "Aguas termales, cascadas en la jungla y snorkel con almejas gigantes." },
      { day: 7, title: "Día libre en Camiguin", description: "Lenguas de arena, playas y buceo opcional." },
      { day: 8, title: "Vuelo a Siargao", description: "Vuelo a Siargao, la isla más trendy de Filipinas." },
      { day: 9, title: "Interior de Siargao", description: "Maasin River, mirador de palmeras, cuevas naturales y vida local." },
      { day: 10, title: "Island hopping en Siargao", description: "Naked Island, Daku Island y Guyam Island. Playas de arena blanca y aguas cristalinas." },
      { day: 11, title: "Día libre en Siargao", description: "Surf, playas del norte, cafés, relax y atardeceres." },
      { day: 12, title: "Regreso a Manila", description: "Vuelo de regreso a Manila. Última noche." },
      { day: 13, title: "Fin del viaje", description: "Tiempo libre y traslado al aeropuerto." },
    ],
    faqs: [
      { question: "¿Necesito visado para Filipinas desde España?", answer: "No, para estancias de hasta 30 días no necesitas visado con pasaporte español." },
      { question: "¿Puedo hacer buceo durante el viaje?", answer: "Sí, puedes hacer inmersiones en Balicasag (no incluido en el precio)." },
      { question: "¿Puedo viajar solo/a?", answer: "¡Por supuesto! Muchos travelhooders viajan solos. Es ideal para conectar con nuevas personas." },
      { question: "¿Es seguro viajar a Filipinas?", answer: "Sí, las zonas del itinerario son seguras y turísticas. Viajarás acompañado durante todo el recorrido." },
    ],
    seo: {
      title: "Viaje a Filipinas Verano en grupo | Travel Hood",
      description: "Viaje en grupo a Filipinas en verano para jóvenes. Siargao, Camiguin y Bohol. Coordinador 24/7.",
      keywords: "viaje filipinas verano, filipinas en grupo, siargao jóvenes, travel hood filipinas verano",
      cuandoViajarTitle: "Cuándo viajar a Filipinas en verano | Travel Hood",
      cuandoViajarDescription: "Descubre por qué el verano es una gran época para viajar a Filipinas: islas, surf y naturaleza tropical.",
      presupuestoTitle: "Presupuesto Filipinas Verano | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Filipinas en verano? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "25-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "25-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "26-32°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "27-33°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Mayo", avgTemp: "27-33°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Junio", avgTemp: "27-32°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Julio", avgTemp: "27-32°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "27-32°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Octubre", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "25-30°C", rainfall: "Media", recommendation: "Buena" },
    ],
    hasCoordinator: true,
  },
  {
    id: "filipinas-invierno",
    name: "Filipinas — Invierno",
    slug: "filipinas-invierno",
    countryId: "ph",
    continentId: "asia",
    description: "El Nido, Coron y Port Barton: la edición invernal de Filipinas explora Palawan, una de las islas más bonitas del mundo. Lagunas escondidas, snorkel entre pecios y playas que parecen irreales.",
    shortDescription: "El Nido, Coron y Palawan: las islas más bonitas del mundo.",
    heroImage: "",
    heroImageAlt: "Laguna esmeralda rodeada de acantilados de caliza en El Nido, Palawan",
    highlights: ["El Nido", "Coron", "Port Barton", "Bohol"],
    idealFor: "Viajeros que buscan las playas y lagunas más espectaculares de Asia",
    climate: "Tropical, 27-32°C, época seca",
    categories: ["playa", "naturaleza", "aventura"],
    extraIncluded: ["Comidas indicadas", "Tours en privado (Bohol, Port Barton, El Nido, Coron)", "Guía de habla hispana/inglesa", "Tasas de puertos y aeropuertos"],
    extraNotIncluded: ["Gastos derivados de problemas externos"],
    coordinates: { lat: 14.5995, lng: 120.9842 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "15-25€/día", totalExtras: "195-325€ (13 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Manila", description: "Aterrizaje en Manila, traslado al hotel y primera toma de contacto." },
      { day: 2, title: "Manila → Bohol", description: "Vuelo a Bohol y llegada a playa de Alona en Panglao. Tarde libre." },
      { day: 3, title: "Explorando Bohol", description: "Tarsiers, Chocolate Hills, kayak o paddle por el río Loboc." },
      { day: 4, title: "Día libre en Panglao", description: "Playas, snorkel, buceo, visita cultural o sesión de spa." },
      { day: 5, title: "Bohol → Port Barton", description: "Ferry a Cebú y vuelo a San Vicente. Llegada a Port Barton, rincón auténtico de Palawan." },
      { day: 6, title: "Island Hopping en Port Barton", description: "Snorkel entre corales, posibilidad de nadar con tortugas. Almuerzo en isla paradisíaca." },
      { day: 7, title: "Port Barton → El Nido", description: "Traslado a El Nido. Atardecer en Las Cabañas Beach y noche en Corong-Corong." },
      { day: 8, title: "Island Hopping en El Nido", description: "Archipiélago de Bacuit: 7 Commandos, Secret Lagoon, Big Lagoon y Cadlao Island." },
      { day: 9, title: "Día libre en El Nido", description: "Moto por el norte de Palawan, Nacpan Beach, Taraw Cliff o buceo." },
      { day: 10, title: "El Nido → Coron", description: "Ferry a Coron. Subida al Monte Tapyas para ver el atardecer." },
      { day: 11, title: "Island Hopping en Coron", description: "Lago Kayangan, Twin Lagoon, Banol Beach y snorkel en Coral Garden y Skeleton Wreck." },
      { day: 12, title: "Coron → Manila", description: "Vuelo a Manila. Últimas horas para disfrutar de la vida local." },
      { day: 13, title: "Regreso a casa", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Necesito visado para Filipinas desde España?", answer: "No, para estancias de hasta 30 días no necesitas visado con pasaporte español." },
      { question: "¿Puedo hacer buceo durante el viaje?", answer: "Sí, en El Nido, Coron y Balicasag (no incluido en el precio)." },
      { question: "¿Qué tipo de ropa debo llevar?", answer: "Ropa ligera, bañador, protector solar, gafas de sol y calzado cómodo." },
      { question: "¿Es seguro viajar por Filipinas?", answer: "Sí, especialmente con el acompañamiento de coordinadores de Travel Hood y proveedores locales." },
    ],
    seo: {
      title: "Viaje a Filipinas Invierno en grupo | Travel Hood",
      description: "Viaje en grupo a Filipinas en invierno para jóvenes. El Nido, Coron y Palawan. Coordinador 24/7.",
      keywords: "viaje filipinas invierno, filipinas en grupo, el nido coron jóvenes, travel hood filipinas invierno",
      cuandoViajarTitle: "Cuándo viajar a Filipinas en invierno | Travel Hood",
      cuandoViajarDescription: "Descubre por qué el invierno es la mejor época para Palawan: El Nido, Coron y las mejores lagunas de Filipinas.",
      presupuestoTitle: "Presupuesto Filipinas Invierno | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Filipinas en invierno? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "25-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "25-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "26-32°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "27-33°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "27-33°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Junio", avgTemp: "27-32°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Julio", avgTemp: "27-32°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Agosto", avgTemp: "27-32°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Septiembre", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Octubre", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Noviembre", avgTemp: "26-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "25-30°C", rainfall: "Baja", recommendation: "Ideal" },
    ],
    hasCoordinator: true,
  },
  {
    id: "puerto-rico",
    name: "Puerto Rico",
    slug: "puerto-rico",
    countryId: "pr",
    continentId: "central-america",
    description: "Playas vírgenes en Vieques, Old San Juan colonial, clase de salsa bajo las estrellas y cascadas escondidas en la selva. Puerto Rico es el Caribe con alma latina y energía contagiosa.",
    shortDescription: "Playas vírgenes, salsa, cultura y cascadas en el Caribe latino.",
    heroImage: "",
    heroImageAlt: "Playa de aguas cristalinas y arena blanca en Vieques, Puerto Rico",
    highlights: ["Vieques", "Old San Juan", "Gozalandia", "Rincón"],
    idealFor: "Quienes buscan Caribe auténtico con cultura, fiesta y naturaleza",
    climate: "Tropical caribeño, 26-32°C",
    categories: ["playa", "cultural", "aventura", "naturaleza"],
    extraIncluded: ["Ferry a Vieques", "Guías locales en español", "Entradas a lugares de interés"],
    extraNotIncluded: ["Visado (ESTA)", "Desayunos"],
    coordinates: { lat: 18.4655, lng: -66.1057 },
    budgetPerDay: { mealCostLow: "5-8€", mealCostMid: "12-20€", beerCost: "3-5€", dailyBudget: "25-40€/día", totalExtras: "200-320€ (8 días)" },
    itinerary: [
      { day: 1, title: "Llegada a San Juan", description: "Recogida y traslado al hotel." },
      { day: 2, title: "Vieques", description: "Ferry a Vieques: aguas cristalinas, entorno natural virgen y tiempo para explorar." },
      { day: 3, title: "Vieques", description: "Ruta por playas del sur, Playa de los Caballos y tiempo libre para recorrer la isla." },
      { day: 4, title: "San Juan, salsa, cultura y fiesta", description: "Tour por el Viejo San Juan: El Morro, La Fortaleza. Clase de salsa con instructor local y noche de fiesta." },
      { day: 5, title: "El Oeste: naturaleza", description: "Excursión a Charco Azul, comida local y sunset en el faro de Rincón. Mercadillos artesanos." },
      { day: 6, title: "Cascada Gozalandia — Crashboat Beach", description: "Cascada Gozalandia con opción de bañarse y saltar. Comida en kioskos de Crashboat Beach." },
      { day: 7, title: "Cultura afroboricua y despedida", description: "Clase de bomba (danza afroboricua), almuerzo local y tarde libre." },
      { day: 8, title: "Se acaba la aventura", description: "Traslado al aeropuerto y vuelta a casa." },
    ],
    faqs: [
      { question: "¿Se necesita visado para Puerto Rico desde España?", answer: "Puerto Rico es territorio de EE. UU. Se necesita pasaporte en vigor y autorización ESTA." },
      { question: "¿Qué moneda se usa?", answer: "Dólar estadounidense (USD)." },
      { question: "¿Qué enchufe se usa? ¿Necesito adaptador?", answer: "Enchufes tipo A y B, 120V / 60Hz. Desde España necesitas adaptador." },
      { question: "¿Qué ropa llevo?", answer: "Ropa fresca, bañador, zapatillas cómodas para caminatas y chubasquero ligero." },
      { question: "¿Cómo nos movemos por la isla?", answer: "Con rutas organizadas y traslados planificados. Tú disfrutas; Travel Hood se encarga." },
      { question: "¿Qué nivel físico necesito?", answer: "Nivel normal. Hay caminatas sencillas y actividades opcionales adaptables al grupo." },
    ],
    seo: {
      title: "Viaje a Puerto Rico en grupo | Travel Hood",
      description: "Viaje en grupo a Puerto Rico para jóvenes. Playas, salsa, cascadas y cultura caribeña. Coordinador 24/7.",
      keywords: "viaje puerto rico, viaje en grupo puerto rico, caribe jóvenes, travel hood puerto rico",
      cuandoViajarTitle: "Cuándo viajar a Puerto Rico | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Puerto Rico: clima, temperaturas y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Puerto Rico | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Puerto Rico? Precios de comida, transporte y gastos.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "22-28°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Febrero", avgTemp: "22-29°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "23-29°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "24-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Mayo", avgTemp: "25-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Junio", avgTemp: "26-32°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Julio", avgTemp: "26-32°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Agosto", avgTemp: "26-32°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "26-32°C", rainfall: "Alta", recommendation: "Aceptable", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "25-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "24-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Diciembre", avgTemp: "23-29°C", rainfall: "Baja", recommendation: "Ideal" },
    ],
    hasCoordinator: true,
  },
  {
    id: "sri-lanka-verano",
    name: "Sri Lanka — Verano",
    slug: "sri-lanka-verano",
    countryId: "lk",
    continentId: "asia",
    description: "Safari en Yala, tren panorámico entre montañas de té, amanecer en Pidurangala y playas paradisíacas en Trincomalee. La edición verano de Sri Lanka recorre la costa este, la más tranquila y cristalina.",
    shortDescription: "Safari, tren panorámico y playas de Trincomalee en la edición verano.",
    heroImage: "",
    heroImageAlt: "Tren panorámico cruzando el Nine Arch Bridge entre plantaciones de té en Sri Lanka",
    highlights: ["Yala Safari", "Tren de Ella", "Pidurangala", "Trincomalee"],
    idealFor: "Viajeros que buscan naturaleza, fauna salvaje y playas tranquilas",
    climate: "Tropical, 27-32°C, costa este seca en verano",
    categories: ["aventura", "naturaleza", "cultural", "playa"],
    extraIncluded: ["Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"],
    extraNotIncluded: ["Visado"],
    coordinates: { lat: 6.9271, lng: 79.8612 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "12-22€/día", totalExtras: "120-240€ (9 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Sri Lanka", description: "Aeropuerto de Colombo y traslado a Negombo. Descanso y conocer al grupo." },
      { day: 2, title: "Costa sur y Galle", description: "Ruta al sur: Galle (Patrimonio de la Humanidad), Weligama y llegada a Tissamaharama." },
      { day: 3, title: "Safari en Yala y montañas de Ella", description: "Safari en Yala (elefantes y leopardos). Ravana Waterfall y Little Adam's Peak." },
      { day: 4, title: "Tren panorámico y plantaciones de té", description: "Nine Arch Bridge, tren de Ella (uno de los más bonitos del mundo), plantaciones y fábrica de té. Llegada a Kandy." },
      { day: 5, title: "Kandy → Sigiriya", description: "Big Buddha de Kandy, jardín de especias y safari para ver elefantes salvajes." },
      { day: 6, title: "Pidurangala y costa este", description: "Subida a Pidurangala Rock con vistas a Sigiriya. Ruta a Trincomalee." },
      { day: 7, title: "Playas y snorkel en Trincomalee", description: "Nilaveli Beach, snorkel en Pigeon Island y relax en aguas cristalinas." },
      { day: 8, title: "Templos de Dambulla y regreso", description: "Templo de las Cuevas de Dambulla (Patrimonio de la Humanidad). Regreso a Negombo." },
      { day: 9, title: "Fin del viaje", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es seguro viajar a Sri Lanka?", answer: "Sí, es un destino cada vez más turístico y seguro. Viajarás acompañado por guía y grupo." },
      { question: "¿Hace falta visado?", answer: "Sí, pero es muy sencillo. Se tramita online (ETA) en pocos minutos." },
      { question: "¿Es un viaje exigente físicamente?", answer: "No demasiado. Pidurangala o Little Adam's Peak son accesibles para cualquier persona con forma física normal." },
      { question: "¿Qué tipo de clima hace?", answer: "Tropical: calor y humedad. Ropa ligera, protector solar y prepararse para alguna lluvia puntual." },
      { question: "¿Necesito vacunas?", answer: "No hay vacunas obligatorias desde España, aunque se recomienda consultar con un centro de vacunación." },
    ],
    seo: {
      title: "Viaje a Sri Lanka Verano en grupo | Travel Hood",
      description: "Viaje en grupo a Sri Lanka en verano para jóvenes. Safari, tren panorámico y playas. Coordinador 24/7.",
      keywords: "viaje sri lanka verano, sri lanka en grupo, trincomalee jóvenes, travel hood sri lanka verano",
      cuandoViajarTitle: "Cuándo viajar a Sri Lanka en verano | Travel Hood",
      cuandoViajarDescription: "El verano es ideal para la costa este de Sri Lanka: Trincomalee, playas cristalinas y fauna salvaje.",
      presupuestoTitle: "Presupuesto Sri Lanka Verano | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Sri Lanka en verano? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "24-30°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Febrero", avgTemp: "24-31°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Marzo", avgTemp: "25-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Abril", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Mayo", avgTemp: "27-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Junio", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Ideal", note: "Costa este seca, Travel Hood opera" },
      { month: "Julio", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Agosto", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Travel Hood opera" },
      { month: "Septiembre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Octubre", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "25-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "24-30°C", rainfall: "Media", recommendation: "Buena" },
    ],
    hasCoordinator: true,
  },
  {
    id: "sri-lanka-otono",
    name: "Sri Lanka — Otoño",
    slug: "sri-lanka-otono",
    countryId: "lk",
    continentId: "asia",
    description: "La edición otoño de Sri Lanka añade días extra en Trincomalee para disfrutar de la costa este en su mejor momento. Safari, cultura, tren panorámico y las mejores playas del Índico en un viaje de 11 días.",
    shortDescription: "Safari, montañas de té y más días en las playas de Trincomalee.",
    heroImage: "",
    heroImageAlt: "Playa paradisíaca de Nilaveli con palmeras al atardecer en Sri Lanka",
    highlights: ["Yala Safari", "Ella", "Pidurangala", "Trincomalee", "Dambulla"],
    idealFor: "Quienes quieren combinar aventura con varios días de playa tranquila",
    climate: "Tropical, 27-31°C, costa este aún agradable",
    categories: ["aventura", "naturaleza", "cultural", "playa"],
    extraIncluded: ["Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"],
    extraNotIncluded: ["Visado"],
    coordinates: { lat: 6.9271, lng: 79.8612 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "12-22€/día", totalExtras: "120-240€ (11 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Sri Lanka", description: "Aeropuerto de Colombo y traslado a Negombo." },
      { day: 2, title: "Costa sur y Galle", description: "Ruta al sur: Galle (Patrimonio de la Humanidad), Weligama. Llegada a Tissamaharama." },
      { day: 3, title: "Safari en Yala y rumbo a Ella", description: "Safari en Yala. Ravana Waterfall y Templo de Mahamewnawa." },
      { day: 4, title: "Ella y sus paisajes icónicos", description: "Subida a Little Adam's Peak, Nine Arch Bridge. Opción de Ravana Pool Club." },
      { day: 5, title: "Tren panorámico y plantaciones de té", description: "Tren de Ella, plantaciones de té y fábrica. Llegada a Kandy." },
      { day: 6, title: "Kandy → Sigiriya", description: "Big Buddha, jardín de especias y safari para ver elefantes salvajes." },
      { day: 7, title: "Pidurangala y costa este", description: "Pidurangala Rock con vistas a Sigiriya. Ruta a Trincomalee." },
      { day: 8, title: "Playas y snorkel en Trincomalee", description: "Nilaveli Beach, snorkel en Pigeon Island y relax." },
      { day: 9, title: "Día libre en Trincomalee", description: "Más tiempo para disfrutar del paraíso: playa, paseos o actividades opcionales." },
      { day: 10, title: "Templo de Dambulla y regreso", description: "Templo de las Cuevas de Dambulla. Regreso a Negombo." },
      { day: 11, title: "Fin del viaje", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es seguro viajar a Sri Lanka?", answer: "Sí, es un destino turístico en crecimiento y seguro. Viajarás acompañado durante todo el recorrido." },
      { question: "¿Hace falta visado?", answer: "Sí, pero es muy fácil. Se tramita online (ETA) en pocos minutos." },
      { question: "¿Es un viaje exigente físicamente?", answer: "No. Pidurangala o Little Adam's Peak son accesibles y opcionales." },
      { question: "¿Cuántos días de playa hay?", answer: "Varios días en Trincomalee, con tiempo libre para disfrutar sin prisas." },
      { question: "¿Se puede hacer snorkel sin experiencia?", answer: "Sí, tanto snorkel como otras actividades son aptas para principiantes." },
    ],
    seo: {
      title: "Viaje a Sri Lanka Otoño en grupo | Travel Hood",
      description: "Viaje en grupo a Sri Lanka en otoño para jóvenes. Safari, montañas y más días de playa. Coordinador 24/7.",
      keywords: "viaje sri lanka otoño, sri lanka en grupo, sri lanka septiembre octubre, travel hood sri lanka otoño",
      cuandoViajarTitle: "Cuándo viajar a Sri Lanka en otoño | Travel Hood",
      cuandoViajarDescription: "El otoño permite disfrutar de la costa este de Sri Lanka con menos turistas y buen clima.",
      presupuestoTitle: "Presupuesto Sri Lanka Otoño | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Sri Lanka en otoño? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "24-30°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Febrero", avgTemp: "24-31°C", rainfall: "Baja", recommendation: "Buena" },
      { month: "Marzo", avgTemp: "25-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Abril", avgTemp: "26-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Mayo", avgTemp: "27-31°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Junio", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Julio", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Agosto", avgTemp: "27-30°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Septiembre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Octubre", avgTemp: "26-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Noviembre", avgTemp: "25-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Diciembre", avgTemp: "24-30°C", rainfall: "Media", recommendation: "Buena" },
    ],
    hasCoordinator: true,
  },
  {
    id: "sri-lanka-invierno",
    name: "Sri Lanka — Invierno",
    slug: "sri-lanka-invierno",
    countryId: "lk",
    continentId: "asia",
    description: "La edición invernal de Sri Lanka recorre la costa sur: Mirissa, Hiriketiya y Galle. Snorkel con tortugas, surf en olas perfectas y los mismos safaris, templos y montañas de té que hacen de Sri Lanka un destino inigualable.",
    shortDescription: "Costa sur, surf en Mirissa y snorkel con tortugas en invierno.",
    heroImage: "",
    heroImageAlt: "Coconut Tree Hill al atardecer con palmeras sobre el mar en Mirissa, Sri Lanka",
    highlights: ["Yala Safari", "Pidurangala", "Mirissa", "Galle", "Nuwara Eliya"],
    idealFor: "Amantes del surf, las playas del sur y los paisajes de montaña",
    climate: "Tropical, 26-31°C, costa sur seca en invierno",
    categories: ["aventura", "naturaleza", "cultural", "playa"],
    extraIncluded: ["Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"],
    extraNotIncluded: ["Visado"],
    coordinates: { lat: 6.9271, lng: 79.8612 },
    budgetPerDay: { mealCostLow: "1-3€", mealCostMid: "4-8€", beerCost: "1-2€", dailyBudget: "12-22€/día", totalExtras: "120-240€ (11 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Sri Lanka", description: "Aeropuerto de Colombo y traslado a Negombo." },
      { day: 2, title: "Dambulla y safari en Sigiriya", description: "Templo de las Cuevas de Dambulla (Patrimonio). Safari en jeep para ver elefantes." },
      { day: 3, title: "Sigiriya y Pidurangala Rock", description: "Subida a Pidurangala con vistas a Lion Rock. Tienda de seda y tarde libre." },
      { day: 4, title: "Ruta cultural hacia Kandy", description: "Jardín de especias, museo gemológico, Gran Buda y Templo del Diente de Buda." },
      { day: 5, title: "Montañas y té en Nuwara Eliya", description: "Cascada Ramboda, plantaciones de té con degustación y Nuwara Eliya ('Pequeña Inglaterra')." },
      { day: 6, title: "Rumbo a Ella", description: "Monasterio Mahameunawa, Nine Arch Bridge y Little Adam's Peak. Opción Ravana Pool Club." },
      { day: 7, title: "Cascadas y safari en Yala", description: "Ravana Waterfall y safari en Yala (elefantes, leopardos y aves)." },
      { day: 8, title: "Costa sur y Mirissa", description: "Hiriketiya Beach y subida a Coconut Tree Hill al atardecer." },
      { day: 9, title: "Playa, snorkel y surf", description: "Snorkel con tortugas, Parrot Rock y surf en Weligama Beach." },
      { day: 10, title: "Galle y regreso", description: "Barca en lago Koggala, pescadores sobre zancos, centro de tortugas y Fuerte de Galle." },
      { day: 11, title: "Fin del viaje", description: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    faqs: [
      { question: "¿Es seguro viajar a Sri Lanka?", answer: "Sí, es un destino turístico en crecimiento y seguro. Viajarás acompañado durante todo el recorrido." },
      { question: "¿Hace falta visado?", answer: "Sí, pero es muy fácil. Se tramita online (ETA) en pocos minutos." },
      { question: "¿Es un viaje exigente físicamente?", answer: "No. Algunas caminatas como Pidurangala son accesibles para cualquier persona con forma física normal." },
      { question: "¿Cómo es el clima?", answer: "Tropical: calor y humedad durante todo el año. Ropa ligera y protección solar." },
      { question: "¿Se necesita experiencia para snorkel o surf?", answer: "No. Son aptos para principiantes, con opciones para todos los niveles." },
    ],
    seo: {
      title: "Viaje a Sri Lanka Invierno en grupo | Travel Hood",
      description: "Viaje en grupo a Sri Lanka en invierno para jóvenes. Costa sur, Mirissa, surf y safari. Coordinador 24/7.",
      keywords: "viaje sri lanka invierno, sri lanka en grupo, mirissa jóvenes, travel hood sri lanka invierno",
      cuandoViajarTitle: "Cuándo viajar a Sri Lanka en invierno | Travel Hood",
      cuandoViajarDescription: "El invierno es la mejor época para la costa sur de Sri Lanka: Mirissa, Galle, surf y snorkel.",
      presupuestoTitle: "Presupuesto Sri Lanka Invierno | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Sri Lanka en invierno? Gastos diarios y precios.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "24-30°C", rainfall: "Baja", recommendation: "Ideal", note: "Costa sur seca" },
      { month: "Febrero", avgTemp: "24-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Marzo", avgTemp: "25-31°C", rainfall: "Baja", recommendation: "Ideal" },
      { month: "Abril", avgTemp: "26-31°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Mayo", avgTemp: "27-31°C", rainfall: "Alta", recommendation: "No recomendado", note: "Monzón suroeste" },
      { month: "Junio", avgTemp: "27-30°C", rainfall: "Alta", recommendation: "No recomendado" },
      { month: "Julio", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Agosto", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Aceptable" },
      { month: "Septiembre", avgTemp: "27-30°C", rainfall: "Media", recommendation: "Buena" },
      { month: "Octubre", avgTemp: "26-30°C", rainfall: "Alta", recommendation: "Aceptable" },
      { month: "Noviembre", avgTemp: "25-30°C", rainfall: "Media", recommendation: "Buena", note: "Travel Hood opera" },
      { month: "Diciembre", avgTemp: "24-30°C", rainfall: "Baja", recommendation: "Ideal" },
    ],
    hasCoordinator: true,
  },
  {
    id: "japon",
    name: "Japón",
    slug: "japon",
    countryId: "jp",
    continentId: "asia",
    description:
      "Templos milenarios, neones de Tokio, trenes bala, gastronomía que enamora y paisajes que parecen sacados de un anime. Japón es puro contraste: tradición y futuro conviven en cada esquina.",
    shortDescription: "Tokio, Kioto, Osaka e Hiroshima. 12 días de historia, modernidad y cultura milenaria.",
    heroImage: "/images/hero-japon.jpg",
    heroImageAlt: "Templo tradicional japonés rodeado de cerezos en flor con el Monte Fuji al fondo",
    highlights: ["Tokio y Shibuya", "Kioto y Fushimi Inari", "Osaka y Universal Studios", "Hiroshima y Miyajima", "Monte Fuji desde Hakone"],
    idealFor: "Amantes de la cultura, la gastronomía y los contrastes entre lo ancestral y lo futurista",
    climate: "Templado, 10-30°C según época",
    categories: ["cultural", "aventura"],
    extraIncluded: ["Entrada al Universal Studios", "Guía en Kioto", "Entrada al Santuario de Fushimi", "Tasas turísticas y parques nacionales"],
    extraNotIncluded: ["Seguro médico de viaje", "Actividades no especificadas como incluido en el itinerario"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    budgetPerDay: { mealCostLow: "5-10€", mealCostMid: "12-25€", beerCost: "3-5€", dailyBudget: "30-50€/día", totalExtras: "360-600€ (12 días)" },
    itinerary: [
      { day: 1, title: "Llegada a Japón", description: "Recepción en el Aeropuerto Internacional de Tokio. Si el tiempo lo permite, comenzaremos a explorar Tokio. Por la noche, cena de bienvenida en el restaurante tradicional Hana no Mai." },
      { day: 2, title: "Explorando Tokio", description: "Salida en tren hacia Kamakura: Gran Buda, templo Engaku-ji, Hasedera y Kotoku-in. Si el tiempo lo permite, playa. Por la tarde, Shibuya Crossing y la estatua de Hachiko." },
      { day: 3, title: "Llegada a Kioto", description: "Tren bala hacia Kioto. Visitamos el famoso Santuario Fushimi Inari-taisha (incluido) y el Palacio Imperial. Opción de explorar el Museo del Manga o el Nishiki Market." },
      { day: 4, title: "Conociendo Kioto", description: "Visita al Kinkaku-ji (Templo de Oro) y al conjunto histórico de Kiyomizu-dera. Por la tarde, paseo por el barrio de Gion. Tour de 8 horas con guía." },
      { day: 5, title: "Kioto y alrededores", description: "Arashiyama: famoso bosque de bambú y templos como Tenryu-ji. Por la tarde, experiencia de kimono tradicional, té y opción de relajarse en un onsen." },
      { day: 6, title: "Camino a Hiroshima", description: "Tren bala hasta Miyajimaguchi y ferry hacia la isla sagrada de Miyajima. Regreso a Hiroshima: Parque Memorial de la Paz y su museo." },
      { day: 7, title: "Rumbo a Osaka", description: "Mercado de Kuromon para probar gastronomía local. Por la tarde, barrio futurista de Shinsekai y Torre Tsutenkaku. Noche en Dotonbori: izakayas, bares y karaokes." },
      { day: 8, title: "Universal Studios Japan", description: "Día completo en Universal Studios Japan (incluido). Zona mágica de Harry Potter y subzona de Super Mario Bros." },
      { day: 9, title: "Nara y Akihabara", description: "Parque de Nara con sus 1.300 ciervos sagrados. Templos Kofuku-ji, Tōdai-ji y Santuario Kasuga-taisha. Por la tarde, regreso a Tokio y barrio de Akihabara." },
      { day: 10, title: "La gran Tokio", description: "Museo TeamLab Borderless, barrio de Shinjuku y Edificio del Gobierno Metropolitano. Por la tarde, Asakusa y templo Senso-ji. Noche: Tokyo Skytree y recorrido en karts." },
      { day: 11, title: "Hakone y Monte Fuji", description: "Tren hacia Hakone para contemplar el Monte Fuji. Parque Nacional Fuji-Hakone-Izu, Lago Ashi y templo de Hakone. Opción de subir en funicular. Cena de despedida en Tokio." },
      { day: 12, title: "Se acaba la aventura", description: "Mañana libre para disfrutar los últimos momentos. Traslado al Aeropuerto Internacional de Tokio." },
    ],
    faqs: [
      { question: "¿Necesito visado para viajar a Japón?", answer: "No, si eres ciudadano español puedes entrar como turista hasta 90 días sin visado. Solo necesitas pasaporte en vigor." },
      { question: "¿Es caro viajar a Japón?", answer: "Japón tiene fama de caro, pero con el viaje organizado los mayores gastos están cubiertos. En el día a día puedes comer ramen por 5-8€ o sushi por 10-15€. El presupuesto diario extra ronda los 30-50€." },
      { question: "¿Necesito saber japonés?", answer: "No es necesario. En zonas turísticas hay señalización en inglés y los japoneses son muy serviciales. Además, viajas con coordinador y guía local." },
      { question: "¿Cómo funciona el transporte en Japón?", answer: "El sistema de trenes japonés es el mejor del mundo. Los trayectos entre ciudades se hacen en tren bala (Shinkansen) y todos los traslados están incluidos en el viaje." },
      { question: "¿Qué tipo de alojamiento está incluido?", answer: "Alojamiento en hoteles y alojamientos seleccionados en Tokio, Kioto, Osaka e Hiroshima, con ubicaciones céntricas para aprovechar al máximo cada ciudad." },
      { question: "¿Puedo viajar solo/a a Japón con Travel Hood?", answer: "Por supuesto. La mayoría de nuestros viajeros vienen solos y se van con amigos para toda la vida. El grupo y el coordinador hacen que te sientas acompañado desde el primer momento." },
      { question: "¿Cuál es la mejor época para viajar a Japón?", answer: "Primavera (marzo-mayo) para los cerezos en flor y otoño (octubre-noviembre) para los colores del momiji. Pero Japón es espectacular en cualquier época del año." },
      { question: "¿Hay tiempo libre durante el viaje?", answer: "Sí. Aunque el itinerario es muy completo, hay momentos libres para explorar a tu ritmo, hacer compras o simplemente perderte por las calles." },
      { question: "¿Qué ropa debo llevar?", answer: "Depende de la época. En general, ropa cómoda para caminar, calzado ligero y una chaqueta. Recuerda que en Japón se descalzan al entrar a templos y casas." },
      { question: "¿Cuántas personas viajan en el grupo?", answer: "Grupos reducidos de 12-13 personas para una experiencia cercana, divertida y personalizada." },
    ],
    seo: {
      title: "Viaje a Japón en grupo | Travel Hood",
      description: "Viaje en grupo a Japón para jóvenes. Tokio, Kioto, Osaka e Hiroshima en 12 días. Coordinador 24/7.",
      keywords: "viaje japon, viaje en grupo japon, japon jóvenes, travel hood japon, viaje japon grupo",
      cuandoViajarTitle: "Cuándo viajar a Japón | Travel Hood",
      cuandoViajarDescription: "Descubre la mejor época para viajar a Japón: cerezos en flor, momiji, clima y recomendaciones mes a mes.",
      presupuestoTitle: "Presupuesto Japón | Travel Hood",
      presupuestoDescription: "¿Cuánto cuesta viajar a Japón? Precios de comida, transporte y gastos diarios estimados.",
    },
    climateByMonth: [
      { month: "Enero", avgTemp: "2-10°C", rainfall: "Baja", recommendation: "Buena", note: "Frío pero soleado, pocos turistas" },
      { month: "Febrero", avgTemp: "3-11°C", rainfall: "Baja", recommendation: "Buena", note: "Primeros ciruelos en flor" },
      { month: "Marzo", avgTemp: "7-15°C", rainfall: "Media", recommendation: "Ideal", note: "Inicio de los cerezos en flor" },
      { month: "Abril", avgTemp: "12-20°C", rainfall: "Media", recommendation: "Ideal", note: "Sakura en plena floración" },
      { month: "Mayo", avgTemp: "16-24°C", rainfall: "Media", recommendation: "Ideal", note: "Clima perfecto, Golden Week" },
      { month: "Junio", avgTemp: "20-27°C", rainfall: "Alta", recommendation: "Aceptable", note: "Temporada de lluvias (tsuyu)" },
      { month: "Julio", avgTemp: "24-31°C", rainfall: "Media", recommendation: "Buena", note: "Verano, festivales matsuri" },
      { month: "Agosto", avgTemp: "25-32°C", rainfall: "Media", recommendation: "Buena", note: "Calor y festivales, Travel Hood opera" },
      { month: "Septiembre", avgTemp: "21-28°C", rainfall: "Media", recommendation: "Buena", note: "Fin del verano, menos turismo" },
      { month: "Octubre", avgTemp: "15-22°C", rainfall: "Media", recommendation: "Ideal", note: "Otoño, colores del momiji" },
      { month: "Noviembre", avgTemp: "10-17°C", rainfall: "Baja", recommendation: "Ideal", note: "Follaje otoñal espectacular" },
      { month: "Diciembre", avgTemp: "4-12°C", rainfall: "Baja", recommendation: "Buena", note: "Fresco, iluminaciones navideñas" },
    ],
    hasCoordinator: true,
  },
]

export const defaultIncluded = [
  "Alojamiento durante todo el viaje",
  "Desayunos incluidos",
  "Traslados principales",
  "Coordinador Travel Hood 24/7",
  "Tasas turísticas y entradas incluidas en el itinerario",
]
export const defaultNotIncluded = [
  "Vuelos internacionales",
  "Comidas y cenas no especificadas",
  "Seguro de viaje",
  "Actividades no incluidas en el itinerario",
  "Gastos personales y propinas",
]

export const trips: Trip[] = [
  // ─── TRIPS (fillDestination — fuente de la verdad) ───
  // ─── NUEVOS TRIPS (fillDestination) ───
  // Brasil
  { id: "brasil-2026-08-18", destinationId: "brasil", title: "Brasil — Agosto 2026", departureDate: "2026-08-18", returnDate: "2026-08-28", durationDays: 11, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 3, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Entradas a parques nacionales y propinas", "Actividades y excursiones (quads, snorkel)"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["verano"] },
  { id: "brasil-2026-11-08", destinationId: "brasil", title: "Brasil — Noviembre 2026", departureDate: "2026-11-08", returnDate: "2026-11-18", durationDays: 11, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entradas a parques nacionales y propinas", "Actividades y excursiones (quads, snorkel)"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-noviembre"] },
  { id: "brasil-2026-11-22", destinationId: "brasil", title: "Brasil — Nov-Dic 2026", departureDate: "2026-11-22", returnDate: "2026-12-02", durationDays: 11, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 3, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Entradas a parques nacionales y propinas", "Actividades y excursiones (quads, snorkel)"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-noviembre"] },
  { id: "brasil-2026-12-03", destinationId: "brasil", title: "Brasil — Diciembre 2026", departureDate: "2026-12-03", returnDate: "2026-12-13", durationDays: 11, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 0, coordinatorId: "carlos", status: "full", included: [...defaultIncluded, "Entradas a parques nacionales y propinas", "Actividades y excursiones (quads, snorkel)"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["navidad"] },
  // Colombia
  { id: "colombia-2026-07-03", destinationId: "colombia", title: "Colombia — Julio 2026", departureDate: "2026-07-03", returnDate: "2026-07-13", durationDays: 11, priceFrom: 1350, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos", "Traslados principales en furgoneta privada"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"], itinerary: [], tags: ["verano"] },
  { id: "colombia-2026-07-17", destinationId: "colombia", title: "Colombia — Julio 2026 (2)", departureDate: "2026-07-17", returnDate: "2026-07-27", durationDays: 11, priceFrom: 1350, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos", "Traslados principales en furgoneta privada"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"], itinerary: [], tags: ["verano"] },
  { id: "colombia-2026-08-03", destinationId: "colombia", title: "Colombia — Agosto 2026", departureDate: "2026-08-03", returnDate: "2026-08-13", durationDays: 11, priceFrom: 1350, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos", "Traslados principales en furgoneta privada"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"], itinerary: [], tags: ["verano"] },
  { id: "colombia-2026-08-17", destinationId: "colombia", title: "Colombia — Agosto 2026 (2)", departureDate: "2026-08-17", returnDate: "2026-08-27", durationDays: 11, priceFrom: 1350, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos", "Traslados principales en furgoneta privada"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"], itinerary: [], tags: ["verano"] },
  { id: "colombia-2026-09-02", destinationId: "colombia", title: "Colombia — Septiembre 2026", departureDate: "2026-09-02", returnDate: "2026-09-12", durationDays: 11, priceFrom: 1350, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos", "Traslados principales en furgoneta privada"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje", "Uber/taxi para desplazarte fuera del itinerario"], itinerary: [], tags: ["septiembre"] },
  // Maldivas
  { id: "maldivas-2026-07-16", destinationId: "maldivas", title: "Maldivas — Julio 2026", departureDate: "2026-07-16", returnDate: "2026-07-23", durationDays: 7, priceFrom: 950, flightEstimate: 850, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "maldivas-2026-08-19", destinationId: "maldivas", title: "Maldivas — Agosto 2026", departureDate: "2026-08-19", returnDate: "2026-08-26", durationDays: 7, priceFrom: 950, flightEstimate: 850, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "maldivas-2026-09-20", destinationId: "maldivas", title: "Maldivas — Septiembre 2026", departureDate: "2026-09-20", returnDate: "2026-09-27", durationDays: 7, priceFrom: 950, flightEstimate: 850, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["septiembre"] },
  { id: "maldivas-2026-10-31", destinationId: "maldivas", title: "Maldivas — Oct-Nov 2026", departureDate: "2026-10-31", returnDate: "2026-11-07", durationDays: 7, priceFrom: 950, flightEstimate: 850, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["puente-noviembre"] },
  { id: "maldivas-2026-12-05", destinationId: "maldivas", title: "Maldivas — Diciembre 2026", departureDate: "2026-12-05", returnDate: "2026-12-12", durationDays: 7, priceFrom: 950, flightEstimate: 850, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "2 excursiones de snorkel con comida", "Island Hopping con comida", "Equipo completo de snorkel", "Vídeos y fotos underwater", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["navidad"] },
  // Laponia
  { id: "laponia-2026-11-26", destinationId: "laponia", title: "Laponia — Noviembre 2026", departureDate: "2026-11-26", returnDate: "2026-11-30", durationDays: 5, priceFrom: 0, flightEstimate: 400, totalPlaces: 13, placesLeft: 6, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Paseo en trineo con huskies", "Paseo en moto de nieve", "Esquí/Snowboard con forfait y equipo", "Entrada a sauna con lago congelado"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-noviembre"] }, // TODO: precio pendiente
  { id: "laponia-2026-12-03", destinationId: "laponia", title: "Laponia — Diciembre 2026", departureDate: "2026-12-03", returnDate: "2026-12-07", durationDays: 5, priceFrom: 0, flightEstimate: 400, totalPlaces: 13, placesLeft: 5, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Paseo en trineo con huskies", "Paseo en moto de nieve", "Esquí/Snowboard con forfait y equipo", "Entrada a sauna con lago congelado"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["navidad"] }, // TODO: precio pendiente
  // Lofoten
  { id: "lofoten-2026-06-22", destinationId: "lofoten", title: "Lofoten — Junio 2026", departureDate: "2026-06-22", returnDate: "2026-06-30", durationDays: 9, priceFrom: 1250, flightEstimate: 350, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Traslados incluido ferry y gasolina", "Entrada al museo Vikingo", "Actividades (termas/sauna, kayaks)", "Itinerarios de trekking completos"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["verano"] },
  { id: "lofoten-2026-07-02", destinationId: "lofoten", title: "Lofoten — Julio 2026", departureDate: "2026-07-02", returnDate: "2026-07-10", durationDays: 9, priceFrom: 1250, flightEstimate: 350, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Traslados incluido ferry y gasolina", "Entrada al museo Vikingo", "Actividades (termas/sauna, kayaks)", "Itinerarios de trekking completos"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["verano"] },
  // Indonesia
  { id: "indonesia-2026-05-01", destinationId: "indonesia", title: "Indonesia — Mayo 2026", departureDate: "2026-05-01", returnDate: "2026-05-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 2, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["puente-mayo"] },
  { id: "indonesia-2026-05-16", destinationId: "indonesia", title: "Indonesia — Mayo 2026 (2)", departureDate: "2026-05-16", returnDate: "2026-05-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 4, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["puente-mayo"] },
  { id: "indonesia-2026-06-01", destinationId: "indonesia", title: "Indonesia — Junio 2026", departureDate: "2026-06-01", returnDate: "2026-06-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 3, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-06-16", destinationId: "indonesia", title: "Indonesia — Junio 2026 (2)", departureDate: "2026-06-16", returnDate: "2026-06-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 3, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-07-01", destinationId: "indonesia", title: "Indonesia — Julio 2026", departureDate: "2026-07-01", returnDate: "2026-07-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 7, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-07-16", destinationId: "indonesia", title: "Indonesia — Julio 2026 (2)", departureDate: "2026-07-16", returnDate: "2026-07-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 4, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-08-01", destinationId: "indonesia", title: "Indonesia — Agosto 2026", departureDate: "2026-08-01", returnDate: "2026-08-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-08-16", destinationId: "indonesia", title: "Indonesia — Agosto 2026 (2)", departureDate: "2026-08-16", returnDate: "2026-08-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 3, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["verano"] },
  { id: "indonesia-2026-09-01", destinationId: "indonesia", title: "Indonesia — Septiembre 2026", departureDate: "2026-09-01", returnDate: "2026-09-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 5, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["septiembre"] },
  { id: "indonesia-2026-09-16", destinationId: "indonesia", title: "Indonesia — Septiembre 2026 (2)", departureDate: "2026-09-16", returnDate: "2026-09-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 7, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["septiembre"] },
  { id: "indonesia-2026-10-01", destinationId: "indonesia", title: "Indonesia — Octubre 2026", departureDate: "2026-10-01", returnDate: "2026-10-15", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 6, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["puente-octubre"] },
  { id: "indonesia-2026-10-16", destinationId: "indonesia", title: "Indonesia — Octubre 2026 (2)", departureDate: "2026-10-16", returnDate: "2026-10-30", durationDays: 14, priceFrom: 1250, flightEstimate: 750, totalPlaces: 13, placesLeft: 6, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Traslados internos (fast boat, transporte entre islas, chófer local)", "Clases y experiencias (surf, yoga, snorkel)", "Entradas a templos y parques nacionales", "Guías locales"], notIncluded: [...defaultNotIncluded, "Traslados opcionales (motos, taxis)"], itinerary: [], tags: ["puente-octubre"] },
  // Azores
  { id: "azores-2026-06-29", destinationId: "azores", title: "Azores — Jun-Jul 2026", departureDate: "2026-06-29", returnDate: "2026-07-06", durationDays: 7, priceFrom: 900, flightEstimate: 200, totalPlaces: 13, placesLeft: 3, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Alojamiento en casa exclusiva con piscina", "Actividades y excursiones naturales y culturales cada día"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["verano"] },
  // Egipto
  { id: "egipto-2026-04-05", destinationId: "egipto", title: "Egipto — Abril 2026", departureDate: "2026-04-05", returnDate: "2026-04-12", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["semana-santa"] },
  { id: "egipto-2026-05-15", destinationId: "egipto", title: "Egipto — Mayo 2026", departureDate: "2026-05-15", returnDate: "2026-05-22", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["puente-mayo"] },
  { id: "egipto-2026-05-23", destinationId: "egipto", title: "Egipto — Mayo 2026 (2)", departureDate: "2026-05-23", returnDate: "2026-05-30", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["puente-mayo"] },
  { id: "egipto-2026-07-07", destinationId: "egipto", title: "Egipto — Julio 2026", departureDate: "2026-07-07", returnDate: "2026-07-14", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["verano"] },
  { id: "egipto-2026-07-15", destinationId: "egipto", title: "Egipto — Julio 2026 (2)", departureDate: "2026-07-15", returnDate: "2026-07-22", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["verano"] },
  { id: "egipto-2026-11-06", destinationId: "egipto", title: "Egipto — Noviembre 2026", departureDate: "2026-11-06", returnDate: "2026-11-13", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["puente-noviembre"] },
  { id: "egipto-2026-11-13", destinationId: "egipto", title: "Egipto — Noviembre 2026 (2)", departureDate: "2026-11-13", returnDate: "2026-11-20", durationDays: 8, priceFrom: 950, flightEstimate: 300, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Vuelo interno El Cairo–Luxor o tren nocturno", "Guía local en español", "4x4 y quads en el desierto", "Snorkel en el Mar Rojo con almuerzo", "Paseo por el Nilo con cena y espectáculo"], notIncluded: [...defaultNotIncluded, "Visado", "Propinas", "Entradas a monumentos", "Vuelo en Globo (opcional)"], itinerary: [], tags: ["puente-noviembre"] },
  // Islandia
  { id: "islandia-2026-09-28", destinationId: "islandia", title: "Islandia — Sep-Oct 2026", departureDate: "2026-09-28", returnDate: "2026-10-05", durationDays: 8, priceFrom: 1250, flightEstimate: 280, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Chófer durante todo el recorrido", "Gasolina y parking", "Entradas a termas"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["septiembre"] },
  { id: "islandia-2026-10-05", destinationId: "islandia", title: "Islandia — Octubre 2026", departureDate: "2026-10-05", returnDate: "2026-10-12", durationDays: 8, priceFrom: 1250, flightEstimate: 280, totalPlaces: 13, placesLeft: 5, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Chófer durante todo el recorrido", "Gasolina y parking", "Entradas a termas"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-octubre"] },
  { id: "islandia-2026-10-12", destinationId: "islandia", title: "Islandia — Octubre 2026 (2)", departureDate: "2026-10-12", returnDate: "2026-10-19", durationDays: 8, priceFrom: 1250, flightEstimate: 280, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Chófer durante todo el recorrido", "Gasolina y parking", "Entradas a termas"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-octubre"] },
  { id: "islandia-2026-10-19", destinationId: "islandia", title: "Islandia — Octubre 2026 (3)", departureDate: "2026-10-19", returnDate: "2026-10-26", durationDays: 8, priceFrom: 1250, flightEstimate: 280, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Chófer durante todo el recorrido", "Gasolina y parking", "Entradas a termas"], notIncluded: defaultNotIncluded, itinerary: [], tags: ["puente-octubre"] },
  // Zanzíbar
  { id: "zanzibar-2026-11-29", destinationId: "zanzibar", title: "Zanzíbar — Nov-Dic 2026", departureDate: "2026-11-29", returnDate: "2026-12-06", durationDays: 8, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 5, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "2 excursiones de snorkel con equipamiento y comida", "Visita a Mnemba y Prison Island", "Entrada a centro de conservación de tortugas", "Cena de bienvenida y despedida", "Guía local"], notIncluded: [...defaultNotIncluded, "Visado", "Safari en Mikumi (opcional)"], itinerary: [], tags: ["puente-noviembre"] },
  // Tailandia Verano
  { id: "tailandia-verano-2026-07-01", destinationId: "tailandia-verano", title: "Tailandia Verano — Julio 2026", departureDate: "2026-07-01", returnDate: "2026-07-14", durationDays: 14, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 5, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"], notIncluded: [...defaultNotIncluded, "Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"], itinerary: [], tags: ["verano"] },
  { id: "tailandia-verano-2026-07-16", destinationId: "tailandia-verano", title: "Tailandia Verano — Julio 2026 (2)", departureDate: "2026-07-16", returnDate: "2026-07-29", durationDays: 14, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 3, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"], notIncluded: [...defaultNotIncluded, "Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"], itinerary: [], tags: ["verano"] },
  { id: "tailandia-verano-2026-08-01", destinationId: "tailandia-verano", title: "Tailandia Verano — Agosto 2026", departureDate: "2026-08-01", returnDate: "2026-08-14", durationDays: 14, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"], notIncluded: [...defaultNotIncluded, "Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"], itinerary: [], tags: ["verano"] },
  { id: "tailandia-verano-2026-08-16", destinationId: "tailandia-verano", title: "Tailandia Verano — Agosto 2026 (2)", departureDate: "2026-08-16", returnDate: "2026-08-29", durationDays: 14, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"], notIncluded: [...defaultNotIncluded, "Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"], itinerary: [], tags: ["verano"] },
  { id: "tailandia-verano-2026-09-01", destinationId: "tailandia-verano", title: "Tailandia Verano — Septiembre 2026", departureDate: "2026-09-01", returnDate: "2026-09-14", durationDays: 14, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Ferrys entre islas", "Vuelos internos", "Excursión a santuario de elefantes + trekking + rafting", "Entrada al Parque Nacional Ang Thong con almuerzo", "Visita a templos en Chiang Mai", "Cena BBQ en Koh Tao", "Excursión a Koh Nang Yuan"], notIncluded: [...defaultNotIncluded, "Transportes no principales (taxis, tuk tuks, Grab)", "Transporte a Ayutthaya", "Entradas a templos (Ayutthaya y Bangkok)"], itinerary: [], tags: ["septiembre"] },
  // Filipinas Verano
  { id: "filipinas-verano-2026-07-01", destinationId: "filipinas-verano", title: "Filipinas Verano — Julio 2026", departureDate: "2026-07-01", returnDate: "2026-07-13", durationDays: 13, priceFrom: 1350, flightEstimate: 750, totalPlaces: 13, placesLeft: 5, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos y ferry", "Island Hopping tours con comida", "Tours de un día (Camiguin, Bohol, Anda)", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "filipinas-verano-2026-07-17", destinationId: "filipinas-verano", title: "Filipinas Verano — Julio 2026 (2)", departureDate: "2026-07-17", returnDate: "2026-07-29", durationDays: 13, priceFrom: 1350, flightEstimate: 750, totalPlaces: 13, placesLeft: 6, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Vuelos internos y ferry", "Island Hopping tours con comida", "Tours de un día (Camiguin, Bohol, Anda)", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "filipinas-verano-2026-08-01", destinationId: "filipinas-verano", title: "Filipinas Verano — Agosto 2026", departureDate: "2026-08-01", returnDate: "2026-08-13", durationDays: 13, priceFrom: 1350, flightEstimate: 750, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Vuelos internos y ferry", "Island Hopping tours con comida", "Tours de un día (Camiguin, Bohol, Anda)", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "filipinas-verano-2026-08-17", destinationId: "filipinas-verano", title: "Filipinas Verano — Agosto 2026 (2)", departureDate: "2026-08-17", returnDate: "2026-08-29", durationDays: 13, priceFrom: 1350, flightEstimate: 750, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Vuelos internos y ferry", "Island Hopping tours con comida", "Tours de un día (Camiguin, Bohol, Anda)", "Guías locales y guía español"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  // Filipinas Invierno
  { id: "filipinas-invierno-2026-11-13", destinationId: "filipinas-invierno", title: "Filipinas Invierno — Noviembre 2026", departureDate: "2026-11-13", returnDate: "2026-11-25", durationDays: 13, priceFrom: 1350, flightEstimate: 750, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Comidas indicadas", "Tours en privado (Bohol, Port Barton, El Nido, Coron)", "Guía de habla hispana/inglesa", "Tasas de puertos y aeropuertos"], notIncluded: [...defaultNotIncluded, "Gastos derivados de problemas externos"], itinerary: [], tags: ["puente-noviembre"] },
  // Puerto Rico
  { id: "puerto-rico-2026-04-29", destinationId: "puerto-rico", title: "Puerto Rico — Abr-May 2026", departureDate: "2026-04-29", returnDate: "2026-05-05", durationDays: 8, priceFrom: 1150, flightEstimate: 700, totalPlaces: 13, placesLeft: 3, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Ferry a Vieques", "Guías locales en español", "Entradas a lugares de interés"], notIncluded: [...defaultNotIncluded, "Visado (ESTA)", "Desayunos"], itinerary: [], tags: ["puente-mayo"] },
  { id: "puerto-rico-2026-08-27", destinationId: "puerto-rico", title: "Puerto Rico — Ago-Sep 2026", departureDate: "2026-08-27", returnDate: "2026-09-02", durationDays: 8, priceFrom: 1150, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Ferry a Vieques", "Guías locales en español", "Entradas a lugares de interés"], notIncluded: [...defaultNotIncluded, "Visado (ESTA)", "Desayunos"], itinerary: [], tags: ["verano"] },
  { id: "puerto-rico-2026-09-02", destinationId: "puerto-rico", title: "Puerto Rico — Septiembre 2026", departureDate: "2026-09-02", returnDate: "2026-09-08", durationDays: 8, priceFrom: 1150, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Ferry a Vieques", "Guías locales en español", "Entradas a lugares de interés"], notIncluded: [...defaultNotIncluded, "Visado (ESTA)", "Desayunos"], itinerary: [], tags: ["septiembre"] },
  // Tailandia Invierno
  { id: "tailandia-invierno-2026-04-16", destinationId: "tailandia-invierno", title: "Tailandia Invierno — Abril 2026", departureDate: "2026-04-16", returnDate: "2026-04-28", durationDays: 13, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 4, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Traslados principales y ferrys", "Vuelos internos", "Tren nocturno Bangkok→Chiang Mai", "Templos de Chiang Mai", "Santuario de elefantes + trekking + rafting + almuerzo", "Tour Hong Island en lancha + almuerzo", "Tour Phi Phi en barca + almuerzo + snorkel"], notIncluded: [...defaultNotIncluded, "Tuk tuk y grabs", "Templos de Ayutthaya y Bangkok"], itinerary: [], tags: ["semana-santa"] },
  { id: "tailandia-invierno-2026-11-16", destinationId: "tailandia-invierno", title: "Tailandia Invierno — Noviembre 2026", departureDate: "2026-11-16", returnDate: "2026-11-28", durationDays: 13, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Traslados principales y ferrys", "Vuelos internos", "Tren nocturno Bangkok→Chiang Mai", "Templos de Chiang Mai", "Santuario de elefantes + trekking + rafting + almuerzo", "Tour Hong Island en lancha + almuerzo", "Tour Phi Phi en barca + almuerzo + snorkel"], notIncluded: [...defaultNotIncluded, "Tuk tuk y grabs", "Templos de Ayutthaya y Bangkok"], itinerary: [], tags: ["puente-noviembre"] },
  { id: "tailandia-invierno-2026-12-01", destinationId: "tailandia-invierno", title: "Tailandia Invierno — Diciembre 2026", departureDate: "2026-12-01", returnDate: "2026-12-13", durationDays: 13, priceFrom: 1300, flightEstimate: 650, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Traslados principales y ferrys", "Vuelos internos", "Tren nocturno Bangkok→Chiang Mai", "Templos de Chiang Mai", "Santuario de elefantes + trekking + rafting + almuerzo", "Tour Hong Island en lancha + almuerzo", "Tour Phi Phi en barca + almuerzo + snorkel"], notIncluded: [...defaultNotIncluded, "Tuk tuk y grabs", "Templos de Ayutthaya y Bangkok"], itinerary: [], tags: ["navidad"] },
  // Sri Lanka Verano
  { id: "sri-lanka-verano-2026-06-12", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Junio 2026", departureDate: "2026-06-12", returnDate: "2026-06-20", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-06-22", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Junio 2026 (2)", departureDate: "2026-06-22", returnDate: "2026-06-30", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 4, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-07-12", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Julio 2026", departureDate: "2026-07-12", returnDate: "2026-07-20", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 5, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-07-22", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Julio 2026 (2)", departureDate: "2026-07-22", returnDate: "2026-07-30", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-08-01", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Agosto 2026", departureDate: "2026-08-01", returnDate: "2026-08-09", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-08-12", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Agosto 2026 (2)", departureDate: "2026-08-12", returnDate: "2026-08-20", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 4, coordinatorId: "carlos", status: "almost-full", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  { id: "sri-lanka-verano-2026-08-22", destinationId: "sri-lanka-verano", title: "Sri Lanka Verano — Agosto 2026 (3)", departureDate: "2026-08-22", returnDate: "2026-08-30", durationDays: 9, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["verano"] },
  // Sri Lanka Otoño
  { id: "sri-lanka-otono-2026-09-03", destinationId: "sri-lanka-otono", title: "Sri Lanka Otoño — Septiembre 2026", departureDate: "2026-09-03", returnDate: "2026-09-13", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["septiembre"] },
  { id: "sri-lanka-otono-2026-09-16", destinationId: "sri-lanka-otono", title: "Sri Lanka Otoño — Septiembre 2026 (2)", departureDate: "2026-09-16", returnDate: "2026-09-26", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["septiembre"] },
  { id: "sri-lanka-otono-2026-10-01", destinationId: "sri-lanka-otono", title: "Sri Lanka Otoño — Octubre 2026", departureDate: "2026-10-01", returnDate: "2026-10-11", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["puente-octubre"] },
  { id: "sri-lanka-otono-2026-10-16", destinationId: "sri-lanka-otono", title: "Sri Lanka Otoño — Octubre 2026 (2)", departureDate: "2026-10-16", returnDate: "2026-10-26", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 4, coordinatorId: "marta", status: "almost-full", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["puente-octubre"] },
  // Sri Lanka Invierno
  { id: "sri-lanka-invierno-2026-11-01", destinationId: "sri-lanka-invierno", title: "Sri Lanka Invierno — Noviembre 2026", departureDate: "2026-11-01", returnDate: "2026-11-11", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["puente-noviembre"] },
  { id: "sri-lanka-invierno-2026-11-16", destinationId: "sri-lanka-invierno", title: "Sri Lanka Invierno — Noviembre 2026 (2)", departureDate: "2026-11-16", returnDate: "2026-11-26", durationDays: 11, priceFrom: 1050, flightEstimate: 700, totalPlaces: 13, placesLeft: 13, coordinatorId: "marta", status: "open", included: [...defaultIncluded, "Entradas a templos", "Clases de surf", "2 safaris", "Snorkel"], notIncluded: [...defaultNotIncluded, "Visado"], itinerary: [], tags: ["puente-noviembre"] },
  // Japón
  { id: "japon-2026-08-01", destinationId: "japon", title: "Japón — Agosto 2026", departureDate: "2026-08-01", returnDate: "2026-08-12", durationDays: 12, priceFrom: 0, flightEstimate: 800, totalPlaces: 13, placesLeft: 13, coordinatorId: "carlos", status: "open", included: [...defaultIncluded, "Entrada al Universal Studios", "Guía en Kioto", "Entrada al Santuario de Fushimi", "Tasas turísticas y parques nacionales"], notIncluded: [...defaultNotIncluded, "Seguro médico de viaje"], itinerary: [], tags: ["verano"] }, // TODO: precio pendiente
]

export const coordinators: Coordinator[] = [
  {
    id: "marta",
    name: "Marta López",
    age: 29,
    role: "Coordinadora Senior",
    bio: "Lleva 4 años abriendo rutas por el mundo. Su especialidad: que el grupo se sienta familia desde el primer día.",
    destinations: ["brasil", "zanzibar", "egipto", "lofoten", "indonesia", "filipinas-verano", "puerto-rico", "sri-lanka-verano", "sri-lanka-invierno", "japon"],
    quote: "Lo mejor de un viaje no es el destino, es con quién lo compartes.",
    image: "/images/hero-brasil.jpg",
  },
  {
    id: "carlos",
    name: "Carlos Ruiz",
    age: 32,
    role: "Coordinador de Aventura",
    bio: "Experto en destinos fríos y experiencias extremas. Si hay nieve, huskies o auroras, él lo gestiona.",
    destinations: ["laponia", "maldivas", "islandia", "azores", "colombia", "tailandia-verano", "tailandia-invierno", "filipinas-invierno", "sri-lanka-otono"],
    quote: "El frío no existe cuando estás con buena gente.",
    image: "/images/hero-laponia.jpg",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Laura",
    age: 28,
    city: "Madrid",
    destinationId: "brasil",
    quote: "Fui sin conocer a nadie. Volví con gente que ya considero amigos.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t1; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "t2",
    name: "Pablo",
    age: 25,
    city: "Barcelona",
    destinationId: "laponia",
    quote: "Ver las auroras boreales con 13 personas más que sienten lo mismo que tú... no hay palabras.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t2; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "t3",
    name: "Ana",
    age: 31,
    city: "Valencia",
    destinationId: "indonesia",
    quote: "Indonesia me volaba la cabeza cada día. Y el grupo hizo que fuera 10 veces mejor.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t3; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 3,
  },
  {
    id: "t4",
    name: "Miguel",
    age: 27,
    city: "Sevilla",
    destinationId: "maldivas",
    quote: "Pensé que Maldivas en grupo sería raro. Fue la mejor decisión que he tomado.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t4; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 4,
  },
  {
    id: "t5",
    name: "Sara",
    age: 24,
    city: "Bilbao",
    destinationId: "zanzibar",
    quote: "Zanzíbar no estaba en mi radar. Ahora es mi viaje favorito de toda la vida.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t5; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 5,
  },
  {
    id: "t6",
    name: "David",
    age: 30,
    city: "Málaga",
    destinationId: "brasil",
    quote: "Repetí con Travel Hood. La primera vez fui solo, la segunda convencí a dos amigos.",
    rating: 5,
    image: "",
    featured: true,
    source: "editorial",
    verificationStatus: "pending-review",
    editorialReviewedAt: "2026-05-14T00:00:00Z",
    editorialEvidenceRef: "fallback:src/lib/travel-data.ts:testimonials.t6; testimonio editorial recopilado por Travel Hood",
    isVisible: true,
    sortOrder: 6,
  },
]

// --- TRIP CATEGORIES ---

// TODO: migrar a Sanity
export const tripCategories: TripCategoryData[] = [
  {
    name: "Aventura",
    slug: "aventura",
    editorial:
      "Los viajes de aventura de Travel Hood están diseñados para jóvenes de 20 a 35 años que quieren experiencias que les pongan la piel de gallina. No hablamos de turismo extremo, sino de vivir cada destino con intensidad: trekkings al amanecer, deportes acuáticos, rutas por la naturaleza y actividades que no harías por tu cuenta. Desde escalar volcanes en Bali hasta recorrer el desierto de Egipto en quad, nuestros viajes de aventura combinan adrenalina con seguridad, siempre con coordinador en destino y un grupo reducido de compañeros de viaje.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Viajeros activos que buscan experiencias intensas, no les importa madrugar para ver un amanecer desde un volcán y prefieren las rutas alternativas a los circuitos turísticos. No necesitas estar en forma de atleta, solo tener ganas de moverte y descubrir.",
    faqs: [
      { question: "¿Necesito experiencia previa en aventura?", answer: "No. Nuestros itinerarios están diseñados para todos los niveles. Las actividades son accesibles y siempre hay alternativas si algo no te convence." },
      { question: "¿Qué nivel de forma física necesito?", answer: "Moderado. Caminar varias horas al día, subir escalones de templos o hacer snorkel. Nada que requiera entrenamiento previo." },
      { question: "¿Qué destinos de aventura recomendáis para empezar?", answer: "Indonesia y Egipto son perfectos para un primer viaje de aventura: accesibles, variados y con una mezcla de naturaleza y cultura que engancha." },
    ],
    seoTitle: "Viajes de aventura en grupo para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes de aventura en grupo para jóvenes: trekkings, volcanes, desiertos y naturaleza salvaje. Grupos reducidos con coordinador.",
  },
  {
    name: "Playa",
    slug: "playa",
    editorial:
      "Los viajes de playa de Travel Hood no son vacaciones de tumbona y buffet. Son expediciones a las playas más espectaculares del mundo con un grupo de jóvenes de 20 a 35 años que quieren combinar arena blanca con experiencias reales. Desde las islas Phi Phi de Tailandia hasta las playas de Zanzíbar, pasando por las costas volcánicas de Azores, las islas de Filipinas y los arrecifes de Maldivas, nuestros viajes de playa incluyen snorkel, excursiones en barco, atardeceres en acantilados y noches bajo las estrellas. Todo con coordinador en destino y la logística resuelta.",
    heroImage: "/images/hero-maldivas.jpg",
    idealProfile: "Amantes del mar, el sol y los atardeceres épicos. Viajeros que quieren playas de postal pero también experiencias culturales y gastronomía local. No buscas un all-inclusive, buscas vivir el destino con los pies en la arena.",
    faqs: [
      { question: "¿Son playas masificadas?", answer: "No. Seleccionamos playas accesibles pero fuera de las rutas más turísticas. Nada de Benidorm: piensa en Nusa Penida, Nungwi o Phi Phi fuera de temporada." },
      { question: "¿Puedo hacer snorkel sin experiencia?", answer: "Sí. El snorkel no requiere ninguna experiencia previa y el equipo se proporciona en destino. Es una de las actividades más populares." },
      { question: "¿Cuál es el mejor destino de playa?", answer: "Depende de tu estilo: Maldivas para lujo accesible, Tailandia para playa + cultura, Zanzíbar para playas vírgenes, Bali para playa + espiritualidad." },
    ],
    seoTitle: "Viajes de playa en grupo para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes de playa en grupo para jóvenes: Tailandia, Maldivas, Zanzíbar, Bali y más. Playas paradisíacas, snorkel y aventura.",
  },
  {
    name: "Cultural",
    slug: "cultural",
    editorial:
      "Los viajes culturales de Travel Hood son para jóvenes curiosos de 20 a 35 años que quieren entender los lugares que visitan, no solo fotografiarlos. Desde las pirámides de Egipto hasta los templos de Tailandia, pasando por los palacios de Sri Lanka y la arquitectura colonial de Colombia, nuestros viajes culturales combinan historia, gastronomía, arte y tradiciones locales en itinerarios diseñados para vivir cada cultura desde dentro. No es un tour con audioguía: es una inmersión con coordinador local, cenas en restaurantes auténticos y experiencias que no encontrarías en ninguna guía.",
    heroImage: "/images/hero-japon.jpg",
    idealProfile: "Viajeros curiosos que disfrutan aprendiendo sobre otras culturas, probando platos locales y descubriendo la historia detrás de cada lugar. Les gustan los museos pero también los mercados callejeros, los templos y las conversaciones con locales.",
    faqs: [
      { question: "¿Necesito conocer la historia del destino antes de ir?", answer: "No. El coordinador y los guías locales te ponen en contexto durante el viaje. Pero si te gusta prepararte, te enviamos material previo." },
      { question: "¿Hay tiempo libre para explorar?", answer: "Sí. Todos nuestros itinerarios incluyen tiempo libre para que explores a tu ritmo, te pierdas por calles o descubras rincones por tu cuenta." },
      { question: "¿Cuál es el destino cultural más recomendado?", answer: "Egipto es imbatible para historia antigua. Sri Lanka para una experiencia sensorial completa. Colombia combina cultura, gastronomía y naturaleza." },
    ],
    seoTitle: "Viajes culturales en grupo para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes culturales en grupo para jóvenes: Egipto, Sri Lanka, Colombia y más. Inmersión cultural con coordinador.",
  },
  {
    name: "Naturaleza",
    slug: "naturaleza",
    editorial:
      "Los viajes de naturaleza de Travel Hood llevan a jóvenes de 20 a 35 años a los paisajes más impresionantes del planeta. Desde los glaciares de Islandia hasta la selva de Colombia, pasando por los volcanes de Bali y los arrozales de Sri Lanka, nuestros viajes de naturaleza son para quienes sienten que los mejores momentos de un viaje ocurren al aire libre. Trekkings entre arrozales, amaneceres volcánicos, avistamiento de fauna salvaje y noches bajo cielos estrellados: cada itinerario está diseñado para conectar con la naturaleza sin renunciar a la comodidad de un viaje organizado con coordinador.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Amantes de los paisajes dramáticos, los animales salvajes y las experiencias al aire libre. Prefieren un volcán al amanecer que un museo, y disfrutan tanto de una caminata entre arrozales como de un snorkel en arrecifes de coral.",
    faqs: [
      { question: "¿Son viajes de senderismo puro?", answer: "No. Combinamos naturaleza con cultura, gastronomía y relax. Hay caminatas, pero también playas, ciudades y experiencias variadas." },
      { question: "¿Veré animales salvajes?", answer: "Depende del destino. En Colombia es casi seguro (monos, tucanes, ballenas). En Zanzíbar puedes nadar con delfines. En Islandia hay ballenas y frailecillos." },
      { question: "¿Cuál es el mejor destino de naturaleza?", answer: "Colombia es biodiversidad pura. Islandia es paisaje extremo. Bali es naturaleza tropical con espiritualidad. Cada uno ofrece algo único." },
    ],
    seoTitle: "Viajes de naturaleza en grupo para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes de naturaleza en grupo para jóvenes: Islandia, Colombia, Bali y más. Volcanes, selvas y glaciares con coordinador.",
  },
  {
    name: "Nieve",
    slug: "nieve",
    editorial:
      "Los viajes de nieve de Travel Hood son la experiencia más mágica que puedes vivir en invierno. Auroras boreales en Laponia, glaciares en Islandia, trineos de huskies, motos de nieve y saunas bajo las estrellas árticas. Nuestros viajes de nieve llevan a jóvenes de 20 a 35 años a vivir el invierno de verdad, lejos de las pistas de esquí convencionales. No necesitas experiencia en frío extremo: te proporcionamos toda la información sobre equipamiento y los alojamientos son cálidos y acogedores. Lo que sí necesitas son ganas de vivir algo que no vas a olvidar jamás.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Viajeros que quieren experiencias únicas e irrepetibles. No les asusta el frío porque saben que la recompensa merece cada grado bajo cero. Buscan auroras, nieve virgen y noches árticas que quitan el aliento.",
    faqs: [
      { question: "¿Cuánto frío hace?", answer: "En Laponia puede bajar a -20°C, pero con la ropa adecuada (que puedes alquilar allí) no se pasa frío. En Islandia en invierno es más suave: -5 a 5°C." },
      { question: "¿Necesito ropa especial?", answer: "Sí, pero no necesitas comprarla. En Laponia puedes alquilar mono térmico, botas y guantes. Te enviamos una lista completa antes del viaje." },
      { question: "¿Veré auroras boreales seguro?", answer: "No hay garantía al 100% porque depende de la actividad solar, pero en diciembre-marzo las probabilidades son altísimas. Salimos varias noches a cazarlas." },
    ],
    seoTitle: "Viajes de nieve en grupo para jóvenes de 20 a 35 años | Travel Hood",
    seoDescription: "Viajes de nieve en grupo para jóvenes: Laponia e Islandia. Auroras boreales, huskies y experiencias árticas con coordinador.",
  },
]

// --- SEASONS ---

// TODO: migrar a Sanity
export const seasons: SeasonData[] = [
  {
    name: "Semana Santa",
    slug: "semana-santa",
    tags: ["semana-santa"],
    editorial:
      "Semana Santa es el primer gran viaje del año. Una semana entera (o casi) para escaparte con un grupo de jóvenes de 20 a 35 años a destinos increíbles. Es la temporada perfecta para Asia (Tailandia antes de las lluvias, Bali en su mejor momento) y para destinos cercanos como Egipto. En Travel Hood preparamos viajes de 9 a 14 días que aprovechan al máximo las vacaciones de Semana Santa, con coordinador en destino y todo organizado para que tú solo tengas que elegir destino y hacer la maleta.",
    heroImage: "/images/hero-japon.jpg",
    faqs: [
      { question: "¿Cuándo es Semana Santa 2026?", answer: "Del 28 de marzo al 6 de abril de 2026. Nuestros viajes salen entre el 27 y el 29 de marzo." },
      { question: "¿Hay que reservar con mucha antelación?", answer: "Sí. Los viajes de Semana Santa se llenan rápido porque las fechas son fijas y la demanda es alta. Recomendamos reservar al menos 2-3 meses antes." },
      { question: "¿Qué destino recomendáis para Semana Santa?", answer: "Tailandia es el destino más versátil. Egipto es perfecto si buscas algo cercano e histórico. Indonesia combina templos, playa y aventura." },
    ],
    seoTitle: "Viajes en grupo Semana Santa 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo para Semana Santa 2026: Tailandia, Bali y Egipto. Grupos de jóvenes 20-35 años con coordinador.",
  },
  {
    name: "Puentes",
    slug: "puentes",
    tags: ["puente-mayo", "puente-octubre", "puente-noviembre"],
    editorial:
      "Los puentes son la excusa perfecta para una escapada de 5 a 11 días sin gastar todas tus vacaciones. En Travel Hood organizamos viajes en grupo para jóvenes de 20 a 35 años en los tres grandes puentes del año: mayo, octubre y noviembre. Destinos cercanos como Egipto son ideales para puentes cortos, mientras que destinos como Tailandia, Indonesia o Sri Lanka son perfectos para puentes largos combinados con unos días de vacaciones. Cada puente tiene sus destinos estrella y todos incluyen coordinador en destino.",
    heroImage: "/images/hero-zanzibar.jpg",
    faqs: [
      { question: "¿Qué puentes hay en 2026?", answer: "Puente de mayo (1 de mayo), puente de octubre (12 de octubre) y puente de noviembre (1 de noviembre). Algunos incluyen el fin de semana, otros no." },
      { question: "¿Se puede ir lejos en un puente?", answer: "Sí. Nuestros viajes de puente van de 5 a 11 días, combinando el puente con unos días de vacaciones. Tailandia, Indonesia o Egipto son opciones reales." },
      { question: "¿Cuál es el puente más barato?", answer: "Mayo y octubre suelen tener los vuelos más baratos. Azores en puente de mayo es una de las opciones más económicas por su cercanía. Consulta precios actualizados en cada viaje." },
    ],
    seoTitle: "Viajes en grupo en puentes 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo para puentes 2026: mayo, octubre y noviembre. Escapadas de 5-11 días para jóvenes de 20-35 años con coordinador.",
  },
  {
    name: "Verano",
    slug: "verano",
    tags: ["verano"],
    editorial:
      "El verano es la temporada grande. De junio a agosto tienes semanas enteras para vivir el viaje de tu vida con un grupo de jóvenes de 20 a 35 años. En Travel Hood ofrecemos la mayor variedad de destinos en verano: desde Brasil hasta Tailandia, pasando por Colombia, Sri Lanka, Bali, Filipinas y Zanzíbar. Los viajes de verano son de 10 a 14 días y están diseñados para exprimir al máximo la temporada. El verano es también la época con más plazas disponibles, así que hay opciones para todos los gustos y presupuestos. Los grupos se llenan, pero siempre añadimos fechas nuevas si la demanda lo pide.",
    heroImage: "/images/hero-brasil.jpg",
    faqs: [
      { question: "¿No es mejor época para la playa que para viajar?", answer: "¿Por qué elegir? Nuestros viajes de verano combinan playa con aventura y cultura. Brasil tiene playas y samba. Sri Lanka tiene playas y templos. Bali tiene arrozales y volcanes." },
      { question: "¿Se llenan rápido los viajes de verano?", answer: "Sí. Julio y agosto son los meses de mayor demanda. Recomendamos reservar 3-4 meses antes para asegurar plaza." },
      { question: "¿Cuál es el destino de verano más económico?", answer: "Azores y Sri Lanka ofrecen la mejor relación calidad-precio en verano. Consulta precios actualizados en la ficha de cada viaje." },
    ],
    seoTitle: "Viajes en grupo verano 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo verano 2026 para jóvenes de 20-35 años: Brasil, Tailandia, Colombia, Bali, Sri Lanka y más. Coordinador en destino.",
  },
  {
    name: "Septiembre",
    slug: "septiembre",
    tags: ["septiembre"],
    editorial:
      "Septiembre es el mes inteligente para viajar. Los precios bajan, los destinos están menos masificados y el clima sigue siendo perfecto en la mayoría de lugares. En Travel Hood organizamos viajes en grupo para jóvenes de 20 a 35 años que aprovechan este mes dorado: Indonesia en su mejor momento, Sri Lanka con playas cristalinas, Islandia con auroras boreales y Maldivas con cielos despejados. Los viajes de septiembre son de 10 a 14 días y ofrecen la misma experiencia que en verano pero con menos gente y a menudo mejor precio. Es la opción preferida de quienes tienen flexibilidad de fechas.",
    heroImage: "/images/hero-japon.jpg",
    faqs: [
      { question: "¿Hace buen tiempo en septiembre?", answer: "En la mayoría de nuestros destinos, sí. Indonesia está en temporada seca, Sri Lanka ofrece un clima excelente en la costa este y Maldivas tiene cielos despejados." },
      { question: "¿Por qué es más barato viajar en septiembre?", answer: "Porque es temporada baja en muchos destinos. Los vuelos y alojamientos bajan de precio, y los lugares turísticos están menos masificados." },
      { question: "¿Qué destino recomendáis en septiembre?", answer: "Indonesia en septiembre es espectacular: templos, playas y volcanes con menos turistas. Sri Lanka e Islandia son también opciones imbatibles." },
    ],
    seoTitle: "Viajes en grupo septiembre 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo en septiembre 2026 para jóvenes: Indonesia, Sri Lanka, Islandia y Maldivas. Menos gente, mejores precios. Coordinador incluido.",
  },
  {
    name: "Navidad",
    slug: "navidad",
    tags: ["navidad"],
    editorial:
      "¿Y si estas Navidades haces algo diferente? En Travel Hood organizamos viajes de Navidad para jóvenes de 20 a 35 años que prefieren vivir la Navidad en un lugar extraordinario. Laponia es el destino estrella: auroras boreales, huskies, nieve y magia ártica. Maldivas es para quienes prefieren pasar la Nochebuena en una isla paradisíaca. Los viajes de Navidad salen alrededor del 20-22 de diciembre y duran 7-8 días, perfectos para combinar con las vacaciones. Son los viajes que antes se llenan porque las plazas son limitadas y la demanda es altísima.",
    heroImage: "/images/hero-laponia.jpg",
    faqs: [
      { question: "¿Se celebra la Navidad durante el viaje?", answer: "¡Por supuesto! Celebramos Nochebuena y Navidad con el grupo. En Laponia con cena especial bajo las auroras, en Maldivas con cena en la playa." },
      { question: "¿Con cuánta antelación hay que reservar?", answer: "Los viajes de Navidad se llenan 4-5 meses antes. Recomendamos reservar en verano para asegurar plaza." },
      { question: "¿Es muy caro viajar en Navidad?", answer: "Los vuelos suben en Navidad, pero el precio del viaje con Travel Hood es competitivo. Consulta precios actualizados en la ficha de cada viaje." },
    ],
    seoTitle: "Viajes en grupo Navidad 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo Navidad 2026 para jóvenes: Laponia y Maldivas. Auroras boreales, nieve y paraíso tropical. Coordinador incluido.",
  },
  {
    name: "Fin de Año",
    slug: "fin-de-anio",
    tags: ["fin-de-anio"],
    editorial:
      "Despedir el año viajando con un grupo de gente increíble es la mejor forma de empezar el siguiente. En Travel Hood organizamos viajes de Fin de Año para jóvenes de 20 a 35 años a destinos que hacen que la Nochevieja sea inolvidable: Tailandia con fiesta en la playa, Brasil con samba y playas paradisíacas, Colombia con café y Caribe. Los viajes salen entre el 26 y el 27 de diciembre y duran 12-13 días, combinando la última semana del año con la primera del siguiente. Son viajes perfectos para cerrar un capítulo y abrir otro con historias que contar.",
    heroImage: "/images/hero-brasil.jpg",
    faqs: [
      { question: "¿Dónde celebramos la Nochevieja?", answer: "Depende del destino. En Tailandia, fiesta en la playa. En Colombia, en Cartagena frente al Caribe. En Brasil, celebración con samba y playa." },
      { question: "¿Cuánto duran los viajes de Fin de Año?", answer: "12-13 días, del 26-27 de diciembre al 6-8 de enero. Necesitas vacaciones de Navidad completas." },
      { question: "¿Hay opción más corta para Fin de Año?", answer: "Actualmente nuestros viajes de Fin de Año son de 12-13 días. Si buscas algo más corto, Laponia en Navidad (7 días) es una opción cercana en fechas." },
    ],
    seoTitle: "Viajes en grupo Fin de Año 2026 para jóvenes | Travel Hood",
    seoDescription: "Viajes en grupo Fin de Año 2026 para jóvenes: Tailandia, Colombia y Brasil. Nochevieja viajando, 12-13 días con coordinador.",
  },
]

// --- HELPER FUNCTIONS ---

export function getDestinationsByContinent(continentId: string) {
  return destinations.filter((d) => d.continentId === continentId)
}

export function getTripsByDestination(destinationId: string) {
  return trips.filter((t) => t.destinationId === destinationId)
}

export function getTripsByTag(tag: TripTag) {
  return trips.filter((t) => t.tags.includes(tag))
}

export function getTripsByCategory(category: DestinationCategory) {
  const destIds = destinations.filter((d) => d.categories.includes(category)).map((d) => d.id)
  return trips.filter((t) => destIds.includes(t.destinationId))
}

export function getAlmostFullTrips() {
  return trips.filter((t) => t.status === "almost-full" || t.placesLeft <= 4)
}

export function getUpcomingTrips(limit = 6) {
  const now = new Date()
  return trips
    .filter((t) => new Date(t.departureDate) > now && t.status !== "full")
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .slice(0, limit)
}

export function getCoordinator(id: string) {
  return coordinators.find((c) => c.id === id)
}

export function getTestimonialsByDestination(destinationId: string) {
  return testimonials.filter((t) => t.destinationId === destinationId)
}

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug)
}

export function getCountry(id: string) {
  return countries.find((c) => c.id === id)
}

export function getContinent(id: string) {
  return continents.find((c) => c.id === id)
}

export function searchDestinations(query: string) {
  const q = query.toLowerCase()
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.shortDescription.toLowerCase().includes(q) ||
      d.highlights.some((h) => h.toLowerCase().includes(q))
  )
}

export function filterTrips({
  continent,
  month,
  maxPrice,
}: {
  continent?: string
  month?: string
  maxPrice?: number
}) {
  return trips.filter((trip) => {
    const dest = destinations.find((d) => d.id === trip.destinationId)
    if (!dest) return false

    if (continent && dest.continentId !== continent) return false

    if (month) {
      const tripMonth = new Date(trip.departureDate).toLocaleString("es-ES", { month: "long" }).toLowerCase()
      if (tripMonth !== month.toLowerCase()) return false
    }

    if (maxPrice && trip.priceFrom > maxPrice) return false

    return true
  })
}

export function filterTripsAdvanced({
  destinationId,
  continentId,
  tag,
  monthIndex,
  category,
  query,
}: {
  destinationId?: string
  continentId?: string
  tag?: TripTag
  monthIndex?: number
  category?: DestinationCategory
  query?: string
}) {
  let filtered = [...trips].filter((t) => t.status !== "full")

  if (destinationId) {
    filtered = filtered.filter((t) => t.destinationId === destinationId)
  }

  if (continentId) {
    const destIds = destinations.filter((d) => d.continentId === continentId).map((d) => d.id)
    filtered = filtered.filter((t) => destIds.includes(t.destinationId))
  }

  if (tag) {
    filtered = filtered.filter((t) => t.tags.includes(tag))
  }

  if (monthIndex !== undefined && monthIndex >= 0) {
    filtered = filtered.filter((t) => new Date(t.departureDate).getMonth() === monthIndex)
  }

  if (category) {
    const destIds = destinations.filter((d) => d.categories.includes(category)).map((d) => d.id)
    filtered = filtered.filter((t) => destIds.includes(t.destinationId))
  }

  if (query) {
    const q = query.toLowerCase()
    const matchingDests = destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        d.highlights.some((h) => h.toLowerCase().includes(q))
    )
    const destIds = matchingDests.map((d) => d.id)
    filtered = filtered.filter((t) => destIds.includes(t.destinationId))
  }

  return filtered.sort(
    (a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
  )
}
