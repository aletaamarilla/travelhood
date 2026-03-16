// Travelhood Data Graph
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
}

export type DestinationCategory = "playa" | "aventura" | "cultural" | "naturaleza" | "nieve"

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
  itinerary?: ItineraryDay[]
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

export interface Testimonial {
  id: string
  name: string
  age: number
  city: string
  destinationId: string
  quote: string
  rating: number
  image: string
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

export const continents: Continent[] = [
  {
    id: "europe",
    name: "Europa",
    slug: "europa",
    editorialIntro:
      "Europa es mucho más que monumentos y museos. Es perderse por calles empedradas de Grecia al atardecer, cazar auroras boreales en Islandia, recorrer los fiordos noruegos o descubrir la Laponia más salvaje bajo la nieve. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años por los rincones más auténticos del viejo continente, combinando cultura, naturaleza y experiencias que no encontrarías en una guía turística. Nuestros grupos reducidos de 12 a 18 personas viajan con coordinador en destino, alojamiento incluido y un itinerario diseñado para vivir cada país de verdad. Europa tiene destinos para todos los gustos: desde escapadas de puente de 5 días hasta aventuras de dos semanas. Y lo mejor: los vuelos son cortos y baratos, así que el presupuesto total es muy accesible.",
    heroImage: "/images/hero-laponia.jpg",
    bestMonths: "Grecia e Islandia: mayo-septiembre. Laponia: diciembre-marzo. Portugal: abril-octubre.",
    faqs: [
      { question: "¿Necesito pasaporte para viajar por Europa?", answer: "Si eres ciudadano de la UE, con el DNI es suficiente para la mayoría de destinos. Para Islandia (fuera de la UE pero en Schengen) también vale el DNI." },
      { question: "¿Cuál es el destino europeo más barato?", answer: "Grecia y Portugal ofrecen una relación calidad-precio excelente. Comer bien por 10-15€ y alojamientos de calidad a precios muy accesibles." },
      { question: "¿Merece la pena ir a Laponia en verano?", answer: "El verano en Laponia ofrece el sol de medianoche, pero la magia de las auroras y la nieve solo se vive en invierno (diciembre-marzo)." },
    ],
    seoTitle: "Viajes en grupo a Europa para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Descubre los mejores viajes en grupo a Europa para jóvenes: Grecia, Islandia, Laponia y Portugal. Grupos reducidos con coordinador, desde 790€.",
  },
  {
    id: "asia",
    name: "Asia",
    slug: "asia",
    editorialIntro:
      "Asia es el continente que te cambia la perspectiva. Desde los templos milenarios de Japón hasta las playas imposibles de Tailandia, pasando por los arrozales de Bali y el caos fascinante de Vietnam, cada destino asiático es una inmersión total en otra forma de entender la vida. En Travelhood llevamos grupos de jóvenes de 20 a 35 años a vivir Asia de verdad: no desde un resort, sino desde la calle, los mercados nocturnos, los templos al amanecer y las experiencias que solo un coordinador local puede abrir. Nuestros viajes por Asia combinan aventura, cultura y playa en itinerarios de 10 a 14 días que maximizan cada momento. El sudeste asiático ofrece además una relación calidad-precio difícil de superar: comidas por 2-3€, transportes económicos y alojamientos con encanto a precios accesibles.",
    heroImage: "/images/hero-japon.jpg",
    bestMonths: "Japón: marzo-mayo y sept-nov. Tailandia: nov-marzo. Bali: abril-octubre. Vietnam: sept-noviembre. Maldivas: dic-abril.",
    faqs: [
      { question: "¿Necesito vacunas para viajar a Asia?", answer: "Depende del destino. Para Japón no. Para el sudeste asiático se recomiendan hepatitis A y B. Consulta tu centro de vacunación internacional al menos 1 mes antes." },
      { question: "¿Es seguro para mujeres viajar solas a Asia?", answer: "El sudeste asiático es uno de los destinos más seguros del mundo para viajeras. Además, en Travelhood siempre viajas con grupo y coordinador." },
      { question: "¿Es muy caro viajar a Asia?", answer: "Los vuelos cuestan 500-900€ según destino, pero una vez allí todo es muy barato. Tailandia, Vietnam y Bali son de los destinos más económicos del mundo." },
    ],
    seoTitle: "Viajes en grupo a Asia para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes en grupo a Asia para jóvenes: Japón, Tailandia, Bali, Vietnam y Maldivas. Grupos reducidos de 12-18 personas con coordinador, desde 1.090€.",
  },
  {
    id: "africa",
    name: "África",
    slug: "africa",
    editorialIntro:
      "África es el continente que te sacude. Desde las pirámides de Egipto hasta las playas de Zanzíbar, pasando por las medinas de Marruecos y los safaris de Tanzania, cada destino africano ofrece una intensidad que no encontrarás en ningún otro lugar. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años a los destinos africanos más espectaculares, siempre con coordinador en destino y en grupos reducidos de 12 a 18 personas. África tiene opciones para todos: Marruecos está a solo 2 horas de vuelo y es perfecto para escapadas de puente, mientras que Zanzíbar, Egipto, Tanzania y Namibia ofrecen aventuras más largas e inmersivas. Los precios locales son muy accesibles y la experiencia cultural es incomparable.",
    heroImage: "/images/hero-zanzibar.jpg",
    bestMonths: "Marruecos: marzo-mayo y sept-nov. Egipto: oct-abril. Zanzíbar: junio-octubre. Tanzania Safari: junio-octubre. Namibia: mayo-octubre.",
    faqs: [
      { question: "¿Es seguro viajar a África?", answer: "Los destinos que operamos son muy seguros para turistas. Marruecos, Egipto, Zanzíbar y Tanzania son países con infraestructura turística consolidada. Además, siempre viajas con coordinador y grupo." },
      { question: "¿Necesito vacunas para África?", answer: "Depende del destino. Para Marruecos y Egipto no hay obligatorias. Para Zanzíbar y Tanzania se recomienda fiebre amarilla y profilaxis antimalárica." },
      { question: "¿Cuánto cuesta un viaje a África?", answer: "Desde 590€ para Marruecos en puente hasta 1.190€ para Zanzíbar o Egipto. Los vuelos a Marruecos son muy baratos (50-180€), los de África subsahariana algo más (500-700€)." },
    ],
    seoTitle: "Viajes en grupo a África para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes en grupo a África para jóvenes: Marruecos, Egipto, Zanzíbar, Tanzania y Namibia. Coordinador en destino, grupos reducidos, desde 590€.",
  },
  {
    id: "south-america",
    name: "Sudamérica",
    slug: "sudamerica",
    editorialIntro:
      "Sudamérica es pura intensidad. Desde las playas tropicales de Brasil hasta las cumbres andinas de Perú, pasando por los glaciares de Argentina y la salsa de Colombia, este continente tiene la energía de un volcán y la belleza de un cuadro. En Travelhood llevamos grupos de jóvenes de 20 a 35 años a descubrir la esencia de Sudamérica: no la versión turística, sino la real. Gastronomía de talla mundial en Lima, samba en Rio, Machu Picchu al amanecer, tango en Buenos Aires... Nuestros itinerarios de 12 a 14 días están diseñados para exprimir cada destino con coordinador en terreno y experiencias que solo un grupo puede desbloquear. Los precios locales son asequibles y la hospitalidad latinoamericana hace que cada viajero se sienta en casa desde el primer día.",
    heroImage: "/images/hero-brasil.jpg",
    bestMonths: "Brasil: junio-septiembre. Perú: mayo-septiembre. Colombia: dic-marzo y julio-agosto. Argentina: octubre-abril.",
    faqs: [
      { question: "¿Necesito visado para Sudamérica?", answer: "Los ciudadanos españoles no necesitan visado para Brasil, Perú, Colombia ni Argentina como turistas (90 días)." },
      { question: "¿Es seguro Sudamérica?", answer: "Las zonas turísticas son seguras, especialmente viajando en grupo con coordinador. Se aplica el sentido común habitual de cualquier gran ciudad." },
      { question: "¿Me afectará la altitud en Perú?", answer: "Cusco está a 3.400m y puede afectar los primeros días. Nuestros itinerarios incluyen aclimatación progresiva y el mate de coca ayuda mucho." },
    ],
    seoTitle: "Viajes en grupo a Sudamérica para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes en grupo a Sudamérica para jóvenes: Brasil, Perú, Colombia y Argentina. Grupos reducidos con coordinador, itinerarios de aventura, desde 1.190€.",
  },
  {
    id: "central-america",
    name: "Centroamérica",
    slug: "centroamerica",
    editorialIntro:
      "Centroamérica es el secreto mejor guardado de los viajeros. Desde los cenotes de México hasta la biodiversidad extrema de Costa Rica, pasando por la cultura vibrante de Cuba, esta región ofrece una mezcla única de playas caribeñas, selvas tropicales, ruinas mayas y una gastronomía que enamora. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años por los destinos más espectaculares de Centroamérica y el Caribe, con coordinador en destino y grupos reducidos. Los viajes combinan aventura, cultura y playa en itinerarios de 10 a 13 días diseñados para vivir cada país al máximo. La hospitalidad centroamericana, el ritmo relajado y los precios accesibles hacen de esta región una opción perfecta para todo tipo de viajeros.",
    heroImage: "/images/hero-brasil.jpg",
    bestMonths: "México: nov-abril. Costa Rica: dic-abril (seca) y julio-agosto (verde). Cuba: nov-abril.",
    faqs: [
      { question: "¿Necesito visado para México o Costa Rica?", answer: "Los ciudadanos españoles no necesitan visado para México (180 días) ni Costa Rica (90 días)." },
      { question: "¿Es caro Centroamérica?", answer: "Costa Rica es algo más cara que el resto, pero en general los precios son accesibles. México ofrece una relación calidad-precio excelente." },
      { question: "¿Qué diferencia hay entre Costa Rica y México?", answer: "Costa Rica es naturaleza pura (volcanes, selva, biodiversidad), mientras México combina cultura ancestral (pirámides, cenotes) con playa caribeña y gastronomía de nivel mundial." },
    ],
    seoTitle: "Viajes en grupo a Centroamérica para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes en grupo a Centroamérica y Caribe para jóvenes: México, Costa Rica y Cuba. Coordinador en destino, grupos reducidos, desde 1.290€.",
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
    seoTitle: "Viajes en grupo a Oceanía para jóvenes | Travelhood (Próximamente)",
    seoDescription: "Próximamente: viajes en grupo a Australia y Nueva Zelanda para jóvenes de 20 a 35 años. Apúntate a la lista de espera.",
  },
]

export const countries: Country[] = [
  { id: "br", name: "Brasil", slug: "brasil", continentId: "south-america", flag: "BR" },
  { id: "fi", name: "Finlandia", slug: "finlandia", continentId: "europe", flag: "FI" },
  { id: "mv", name: "Maldivas", slug: "maldivas", continentId: "asia", flag: "MV" },
  { id: "jp", name: "Japón", slug: "japon", continentId: "asia", flag: "JP" },
  { id: "tz", name: "Tanzania", slug: "tanzania", continentId: "africa", flag: "TZ" },
  { id: "th", name: "Tailandia", slug: "tailandia", continentId: "asia", flag: "TH" },
  { id: "ma", name: "Marruecos", slug: "marruecos", continentId: "africa", flag: "MA" },
  { id: "is", name: "Islandia", slug: "islandia", continentId: "europe", flag: "IS" },
  { id: "pe", name: "Perú", slug: "peru", continentId: "south-america", flag: "PE" },
  { id: "id", name: "Indonesia", slug: "indonesia", continentId: "asia", flag: "ID" },
  { id: "cr", name: "Costa Rica", slug: "costa-rica", continentId: "central-america", flag: "CR" },
  { id: "eg", name: "Egipto", slug: "egipto", continentId: "africa", flag: "EG" },
  { id: "gr", name: "Grecia", slug: "grecia", continentId: "europe", flag: "GR" },
  { id: "mx", name: "México", slug: "mexico", continentId: "central-america", flag: "MX" },
  { id: "vn", name: "Vietnam", slug: "vietnam", continentId: "asia", flag: "VN" },
  { id: "co", name: "Colombia", slug: "colombia", continentId: "south-america", flag: "CO" },
  { id: "jo", name: "Jordania", slug: "jordania", continentId: "asia", flag: "JO" },
  { id: "lk", name: "Sri Lanka", slug: "sri-lanka", continentId: "asia", flag: "LK" },
  { id: "in", name: "India", slug: "india", continentId: "asia", flag: "IN" },
  { id: "tr", name: "Turquía", slug: "turquia", continentId: "europe", flag: "TR" },
  { id: "pt", name: "Portugal", slug: "portugal", continentId: "europe", flag: "PT" },
  { id: "cu", name: "Cuba", slug: "cuba", continentId: "central-america", flag: "CU" },
  { id: "tz-safari", name: "Tanzania", slug: "tanzania-safari", continentId: "africa", flag: "TZ" },
  { id: "na", name: "Namibia", slug: "namibia", continentId: "africa", flag: "NA" },
  { id: "ar", name: "Argentina", slug: "argentina", continentId: "south-america", flag: "AR" },
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
    highlights: ["Rio de Janeiro", "Florianópolis", "Jericoacoara", "Lençóis Maranhenses"],
    idealFor: "Amantes de la playa, la fiesta y la naturaleza salvaje",
    climate: "Tropical, 25-35°C",
    categories: ["playa", "aventura"],
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
    highlights: ["Auroras boreales", "Trineo de huskies", "Sauna finlandesa", "Moto de nieve"],
    idealFor: "Quienes buscan experiencias únicas e irrepetibles",
    climate: "Ártico, -15 a -5°C",
    categories: ["nieve", "aventura", "naturaleza"],
    extraIncluded: ["Actividades árticas", "Trineo de huskies"],
    extraNotIncluded: ["Ropa térmica (alquilable)"],
  },
  {
    id: "maldivas",
    name: "Maldivas",
    slug: "maldivas",
    countryId: "mv",
    continentId: "asia",
    description:
      "Aguas cristalinas, bungalows sobre el agua, snorkel con mantas raya y atardeceres que parecen de película.",
    shortDescription: "Paraíso cristalino, bungalows y snorkel con mantas raya.",
    heroImage: "/images/hero-maldivas.jpg",
    highlights: ["Snorkel con tiburones", "Bungalow sobre el agua", "Excursión en dhoni", "Playa bioluminiscente"],
    idealFor: "Quienes sueñan con el paraíso y quieren vivirlo en buena compañía",
    climate: "Tropical, 27-31°C",
    categories: ["playa", "naturaleza"],
  },
  {
    id: "japon",
    name: "Japón",
    slug: "japon",
    countryId: "jp",
    continentId: "asia",
    description:
      "Templos, ramen, neón y tradición. Japón es el viaje que te cambia la perspectiva. Desde los cerezos en flor de Kioto hasta el caos controlado de Tokio.",
    shortDescription: "Tradición, neón y cerezos en flor. Una inmersión cultural total.",
    heroImage: "/images/hero-japon.jpg",
    highlights: ["Tokio", "Kioto", "Monte Fuji", "Osaka"],
    idealFor: "Curiosos culturales y foodies empedernidos",
    climate: "Templado, 10-25°C según temporada",
    categories: ["cultural", "aventura"],
    extraIncluded: ["Japan Rail Pass"],
  },
  {
    id: "zanzibar",
    name: "Zanzíbar",
    slug: "zanzibar",
    countryId: "tz",
    continentId: "africa",
    description:
      "La isla de las especias te sorprende con playas de arena blanca, aguas turquesa y una cultura que mezcla África con el Índico.",
    shortDescription: "La isla de las especias: playas blancas, cultura y aventura africana.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Stone Town", "Playa Nungwi", "Tour de especias", "Snorkel en Mnemba"],
    idealFor: "Aventureros que buscan destinos menos masificados",
    climate: "Tropical, 25-33°C",
    categories: ["playa", "cultural", "aventura"],
  },
  {
    id: "tailandia",
    name: "Tailandia",
    slug: "tailandia",
    countryId: "th",
    continentId: "asia",
    description:
      "Templos dorados, mercados flotantes, playas de película y la mejor comida callejera del mundo. Tailandia lo tiene todo.",
    shortDescription: "Templos, playas paradisíacas y la mejor street food del mundo.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Bangkok", "Chiang Mai", "Islas Phi Phi", "Koh Lanta"],
    idealFor: "Quienes buscan la mezcla perfecta de cultura, playa y gastronomía",
    climate: "Tropical, 28-35°C",
    categories: ["playa", "cultural"],
  },
  {
    id: "marruecos",
    name: "Marruecos",
    slug: "marruecos",
    countryId: "ma",
    continentId: "africa",
    description:
      "Medinas, desierto del Sahara, montañas del Atlas y una cultura milenaria. Marruecos es un viaje sensorial completo.",
    shortDescription: "Desierto, medinas y montañas. Un viaje a otro mundo a 2h de avión.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Marrakech", "Desierto del Sahara", "Fez", "Chefchaouen"],
    idealFor: "Exploradores culturales que quieren algo cercano pero exótico",
    climate: "Árido-templado, 15-35°C",
    categories: ["cultural", "aventura"],
    extraIncluded: ["Noche en jaima del desierto"],
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
    highlights: ["Círculo Dorado", "Glaciar Vatnajökull", "Blue Lagoon", "Cascada Skógafoss"],
    idealFor: "Amantes de la naturaleza salvaje y los paisajes dramáticos",
    climate: "Subártico, 0-15°C",
    categories: ["naturaleza", "aventura", "nieve"],
    extraNotIncluded: ["Ropa térmica (alquilable)"],
  },
  {
    id: "peru",
    name: "Perú",
    slug: "peru",
    countryId: "pe",
    continentId: "south-america",
    description:
      "Machu Picchu, el Valle Sagrado, la selva amazónica y una gastronomía de talla mundial. Perú es historia, aventura y sabor.",
    shortDescription: "Machu Picchu, selva amazónica y la mejor gastronomía de Sudamérica.",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["Machu Picchu", "Cusco", "Valle Sagrado", "Lima gastronómica"],
    idealFor: "Viajeros que buscan historia, trekking y experiencias gastronómicas",
    climate: "Variado, 10-28°C según altitud",
    categories: ["aventura", "cultural"],
    extraIncluded: ["Tren a Machu Picchu"],
  },
  {
    id: "bali",
    name: "Bali",
    slug: "bali",
    countryId: "id",
    continentId: "asia",
    description:
      "Arrozales infinitos, templos escondidos, volcanes al amanecer y atardeceres en acantilados. Bali es espiritualidad y aventura.",
    shortDescription: "Arrozales, templos y volcanes. La isla que conecta cuerpo y alma.",
    heroImage: "/images/hero-maldivas.jpg",
    highlights: ["Ubud", "Monte Batur", "Uluwatu", "Islas Nusa"],
    idealFor: "Viajeros espirituales, amantes del yoga y la naturaleza tropical",
    climate: "Tropical, 27-30°C",
    categories: ["playa", "cultural", "naturaleza"],
  },
  {
    id: "costa-rica",
    name: "Costa Rica",
    slug: "costa-rica",
    countryId: "cr",
    continentId: "central-america",
    description:
      "Volcanes activos, selvas de biodiversidad extrema, playas del Caribe y del Pacífico. Pura vida no es solo un eslogan.",
    shortDescription: "Volcanes, selva y playas. El país con más biodiversidad por km².",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["Volcán Arenal", "Monteverde", "Manuel Antonio", "Tortuguero"],
    idealFor: "Amantes de la naturaleza y el ecoturismo",
    climate: "Tropical, 24-30°C",
    categories: ["aventura", "naturaleza", "playa"],
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
    highlights: ["Pirámides de Giza", "Luxor", "Crucero por el Nilo", "Abu Simbel"],
    idealFor: "Apasionados de la historia y las civilizaciones antiguas",
    climate: "Desértico, 20-40°C",
    categories: ["cultural", "aventura"],
    extraIncluded: ["Crucero por el Nilo"],
  },
  {
    id: "grecia",
    name: "Grecia",
    slug: "grecia",
    countryId: "gr",
    continentId: "europe",
    description:
      "Islas de casas blancas, aguas imposiblemente azules, historia milenaria y atardeceres que quitan el aliento. Grecia es la esencia del Mediterráneo.",
    shortDescription: "Islas, atardeceres y ruinas. La esencia del Mediterráneo.",
    heroImage: "/images/hero-maldivas.jpg",
    highlights: ["Santorini", "Atenas", "Mykonos", "Meteora"],
    idealFor: "Quienes quieren combinar cultura, playa y gastronomía mediterránea",
    climate: "Mediterráneo, 20-35°C",
    categories: ["playa", "cultural"],
  },
  {
    id: "mexico",
    name: "México",
    slug: "mexico",
    countryId: "mx",
    continentId: "central-america",
    description:
      "Cenotes, pirámides mayas, playas del Caribe, tacos auténticos y una cultura que vibra. México es color, sabor y aventura sin límites.",
    shortDescription: "Cenotes, pirámides mayas y playas del Caribe. Puro sabor.",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["Tulum", "Chichén Itzá", "Oaxaca", "Ciudad de México"],
    idealFor: "Amantes de la aventura, la gastronomía y las culturas ancestrales",
    climate: "Tropical-templado, 22-33°C",
    categories: ["aventura", "cultural", "playa"],
  },
  {
    id: "vietnam",
    name: "Vietnam",
    slug: "vietnam",
    countryId: "vn",
    continentId: "asia",
    description:
      "Bahía de Ha Long, arrozales de Sapa, motocicletas en Hanoi y phở recién hecho. Vietnam es caos hermoso y hospitalidad infinita.",
    shortDescription: "Bahía de Ha Long, arrozales y street food. Asia auténtica.",
    heroImage: "/images/hero-japon.jpg",
    highlights: ["Bahía de Ha Long", "Hoi An", "Sapa", "Ho Chi Minh"],
    idealFor: "Viajeros intrépidos que buscan autenticidad y aventura",
    climate: "Tropical, 22-32°C",
    categories: ["aventura", "cultural"],
  },
  {
    id: "colombia",
    name: "Colombia",
    slug: "colombia",
    countryId: "co",
    continentId: "south-america",
    description:
      "Colombia es el país que lo tiene todo y que nadie espera. Desde el Caribe turquesa de Cartagena hasta las montañas cafeteras de Salento, pasando por la selva del Amazonas y la energía de Medellín, Colombia te recibe con los brazos abiertos, ritmo de cumbia y la hospitalidad más genuina de Sudamérica. La gastronomía es brutal, los paisajes cambian cada pocas horas de carretera y la gente convierte cada momento en una fiesta. Es el destino emergente que todos los viajeros jóvenes deberían conocer.",
    shortDescription: "Caribe, café, cumbia y montañas. El destino emergente que lo tiene todo.",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["Cartagena de Indias", "Eje Cafetero", "Medellín", "Parque Tayrona", "Guatapé", "Bogotá"],
    idealFor: "Viajeros que buscan ritmo, color, naturaleza y la mejor hospitalidad de Sudamérica",
    climate: "Tropical variado, 18-32°C según altitud",
    categories: ["aventura", "cultural"],
  },
  {
    id: "jordania",
    name: "Jordania",
    slug: "jordania",
    countryId: "jo",
    continentId: "asia",
    description:
      "Jordania es uno de esos destinos que te dejan sin aliento. Petra al atardecer, el desierto de Wadi Rum como si estuvieras en Marte, flotar en el Mar Muerto y descubrir mosaicos bizantinos en Madaba. Es historia viva, paisajes de película y una cultura beduina que te acoge como a un invitado de honor. A solo 4 horas de vuelo desde España, Jordania ofrece una experiencia épica en un país compacto, seguro y fácil de recorrer.",
    shortDescription: "Petra, Wadi Rum y el Mar Muerto. Historia épica a 4 horas de vuelo.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Petra", "Wadi Rum", "Mar Muerto", "Ammán", "Madaba", "Aqaba"],
    idealFor: "Exploradores culturales fascinados por la historia y los paisajes desérticos",
    climate: "Árido-templado, 10-35°C según zona y estación",
    categories: ["aventura", "cultural"],
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    slug: "sri-lanka",
    countryId: "lk",
    continentId: "asia",
    description:
      "Sri Lanka es la isla que condensa todo un continente en un espacio diminuto. Templos budistas milenarios, plantaciones de té infinitas, playas del sur con olas perfectas, safaris con elefantes salvajes y una gastronomía especiada que enamora. Es uno de los destinos más completos de Asia: en 12 días puedes pasar de trekkings entre montañas verdes a playas de arena dorada, de ciudades coloniales a parques nacionales. Y todo con una sonrisa cingalesa que lo hace aún mejor.",
    shortDescription: "Templos, té, playas y elefantes. Toda Asia condensada en una isla.",
    heroImage: "/images/hero-japon.jpg",
    highlights: ["Sigiriya", "Ella y plantaciones de té", "Yala Safari", "Galle", "Kandy", "Mirissa"],
    idealFor: "Viajeros que quieren variedad total: cultura, naturaleza, playa y fauna salvaje en un solo viaje",
    climate: "Tropical, 25-32°C, monzones variables según costa",
    categories: ["aventura", "naturaleza", "cultural"],
  },
  {
    id: "india",
    name: "India",
    slug: "india",
    countryId: "in",
    continentId: "asia",
    description:
      "India es el viaje que te transforma. El Taj Mahal al amanecer, los ghats de Varanasi, los palacios de Rajastán, los colores de Jaipur y el caos fascinante de Delhi. India no se visita, se vive con todos los sentidos a la vez. Es un destino que polariza: o lo amas o te desconcierta, pero nadie vuelve indiferente. La gastronomía es una de las más ricas del mundo, la espiritualidad impregna cada esquina y la diversidad cultural es inabarcable. En grupo, India se disfruta el doble y se sufre la mitad.",
    shortDescription: "Taj Mahal, Varanasi y Rajastán. El viaje que cambia tu perspectiva para siempre.",
    heroImage: "/images/hero-japon.jpg",
    highlights: ["Taj Mahal", "Varanasi", "Jaipur", "Delhi", "Udaipur", "Jodhpur"],
    idealFor: "Viajeros intrépidos con mente abierta que buscan una experiencia cultural profunda e inolvidable",
    climate: "Variado, 15-40°C. Mejor oct-marzo para evitar monzón y calor extremo",
    categories: ["cultural", "aventura"],
  },
  {
    id: "turquia",
    name: "Turquía",
    slug: "turquia",
    countryId: "tr",
    continentId: "europe",
    description:
      "Turquía es el puente entre Europa y Asia, y esa dualidad se siente en cada esquina. Los globos de Capadocia al amanecer, la majestuosidad de Santa Sofía, las playas turquesa de la costa licia, los bazares de Estambul y las ruinas de Éfeso. Es un destino que combina historia milenaria con vida moderna, gastronomía espectacular con paisajes de postal. El kebab que comes en Turquía no tiene nada que ver con el de tu barrio, y los atardeceres sobre el Bósforo son de otro nivel.",
    shortDescription: "Capadocia, Estambul y playas turquesa. Donde Europa se encuentra con Asia.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Capadocia (globos)", "Estambul", "Éfeso", "Pamukkale", "Costa Licia", "Antalya"],
    idealFor: "Viajeros que buscan la mezcla perfecta de historia, playa, gastronomía y paisajes únicos",
    climate: "Mediterráneo-continental, 10-35°C según zona",
    categories: ["cultural", "playa"],
  },
  {
    id: "portugal",
    name: "Portugal",
    slug: "portugal",
    countryId: "pt",
    continentId: "europe",
    description:
      "Portugal es el vecino que siempre subestimamos. Lisboa con sus tranvías y miradores, Oporto con su vino y puentes, el Algarve con sus acantilados y playas doradas, Sintra con sus palacios de cuento. La gastronomía es espectacular (bacalhau, pastéis de nata, vino verde), los precios son asequibles y la gente es increíblemente acogedora. A solo una hora de vuelo desde España, Portugal ofrece una escapada perfecta que combina cultura, playa, gastronomía y una vida nocturna vibrante.",
    shortDescription: "Lisboa, Oporto, Algarve y pastéis de nata. Europa con alma y a buen precio.",
    heroImage: "/images/hero-maldivas.jpg",
    highlights: ["Lisboa", "Oporto", "Sintra", "Algarve", "Nazaré", "Valle del Duero"],
    idealFor: "Viajeros que buscan un destino europeo asequible con cultura, playa y la mejor gastronomía",
    climate: "Mediterráneo-atlántico, 15-30°C",
    categories: ["playa", "cultural"],
  },
  {
    id: "cuba",
    name: "Cuba",
    slug: "cuba",
    countryId: "cu",
    continentId: "central-america",
    description:
      "Cuba es un viaje en el tiempo. Los coches clásicos americanos por las calles de La Habana, la música salsa en cada esquina, las playas de Varadero, los campos de tabaco de Viñales y una cultura que rezuma autenticidad. Cuba no se parece a ningún otro lugar del mundo: es un destino que hay que visitar ahora, antes de que cambie. La hospitalidad cubana es legendaria, el ron es excelente y la vida se vive en la calle, con música, baile y una alegría contagiosa.",
    shortDescription: "La Habana, coches clásicos, salsa y playas. Un viaje en el tiempo único.",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["La Habana Vieja", "Viñales", "Trinidad", "Varadero", "Cienfuegos", "Cayo Jutías"],
    idealFor: "Viajeros curiosos que buscan autenticidad, música, cultura caribeña y una experiencia fuera de lo convencional",
    climate: "Tropical, 25-32°C. Temporada seca: nov-abril",
    categories: ["cultural", "aventura"],
  },
  {
    id: "tanzania-safari",
    name: "Tanzania Safari",
    slug: "tanzania-safari",
    countryId: "tz-safari",
    continentId: "africa",
    description:
      "Tanzania Safari es la experiencia animal más impresionante del planeta. El Serengeti con la Gran Migración, el cráter del Ngorongoro como un Arca de Noé natural, el Kilimanjaro como telón de fondo y la sabana infinita llena de leones, elefantes, jirafas y cebras. No es un zoo: es la naturaleza en su estado más puro y salvaje. Cada amanecer en el safari es diferente, cada día trae un encuentro animal que te deja sin habla. Es el viaje que todo amante de la naturaleza debería hacer al menos una vez en la vida.",
    shortDescription: "Serengeti, Ngorongoro y la Gran Migración. La naturaleza en estado puro.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Serengeti", "Cráter del Ngorongoro", "Lago Manyara", "Tarangire", "Kilimanjaro (vistas)", "Masáis"],
    idealFor: "Amantes de la naturaleza salvaje y los animales que sueñan con una experiencia de safari auténtica",
    climate: "Tropical seco, 20-30°C. Mejor junio-octubre (temporada seca)",
    categories: ["aventura", "naturaleza"],
  },
  {
    id: "namibia",
    name: "Namibia",
    slug: "namibia",
    countryId: "na",
    continentId: "africa",
    description:
      "Namibia es el país más fotogénico de África. Las dunas rojas de Sossusvlei al amanecer, la costa de los esqueletos con sus naufragios, los elefantes del desierto en Damaraland, la vida salvaje de Etosha y los cielos estrellados más limpios del hemisferio sur. Es un destino para quienes buscan paisajes que parecen de otro planeta, fauna salvaje en libertad y una sensación de inmensidad que solo los grandes espacios africanos pueden dar. Namibia es aventura pura con una infraestructura turística excelente.",
    shortDescription: "Dunas rojas, costa de esqueletos y vida salvaje. África en su forma más épica.",
    heroImage: "/images/hero-zanzibar.jpg",
    highlights: ["Sossusvlei", "Etosha National Park", "Costa de los Esqueletos", "Damaraland", "Swakopmund", "Fish River Canyon"],
    idealFor: "Fotógrafos, aventureros y amantes de los paisajes extremos que buscan un destino africano fuera de lo común",
    climate: "Árido, 15-35°C. Mejor mayo-octubre (seco y fresco)",
    categories: ["aventura", "naturaleza"],
  },
  {
    id: "argentina",
    name: "Argentina",
    slug: "argentina",
    countryId: "ar",
    continentId: "south-america",
    description:
      "Argentina es un país de extremos: desde los glaciares de la Patagonia hasta las cataratas de Iguazú, pasando por el tango en Buenos Aires, los viñedos de Mendoza y la inmensidad de la Pampa. Es el país más europeo de Sudamérica pero con una identidad propia inconfundible: asados épicos, Malbec, fútbol como religión y una pasión por la vida que se contagia. Buenos Aires es una de las ciudades más vibrantes del mundo, y la naturaleza argentina compite con cualquier destino del planeta.",
    shortDescription: "Patagonia, Buenos Aires, Iguazú y asado. Extremos que enamoran.",
    heroImage: "/images/hero-brasil.jpg",
    highlights: ["Buenos Aires", "Glaciar Perito Moreno", "Cataratas de Iguazú", "Mendoza", "Ushuaia", "El Calafate"],
    idealFor: "Viajeros que buscan naturaleza épica, cultura urbana vibrante y la mejor carne del mundo",
    climate: "Variado: templado en Buenos Aires (10-28°C), frío en Patagonia (0-15°C)",
    categories: ["aventura", "naturaleza"],
  },
]

// Helper to make itinerary
const makeItinerary = (days: [string, string][]): ItineraryDay[] =>
  days.map(([title, description], i) => ({ day: i + 1, title, description }))

export const defaultIncluded = [
  "Alojamiento",
  "Transporte interno",
  "Actividades incluidas",
  "Coordinador Travelhood",
]
export const defaultNotIncluded = ["Vuelo internacional", "Comidas no especificadas", "Gastos personales"]

export const trips: Trip[] = [
  // ─── SEMANA SANTA 2026 ───
  {
    id: "japon-ss-2026",
    destinationId: "japon",
    title: "Japón — Semana Santa 2026",
    departureDate: "2026-03-28",
    returnDate: "2026-04-10",
    durationDays: 14,
    priceFrom: 1590,
    flightEstimate: 900,
    totalPlaces: 16,
    placesLeft: 2,
    coordinatorId: "marta",
    status: "almost-full",
    included: [...defaultIncluded, "Japan Rail Pass"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Tokio", "Llegada, Shibuya y cena de bienvenida"], ["Akihabara", "Templos y barrio otaku"], ["Monte Fuji", "Excursión al Fuji y lago Kawaguchi"]]),
    tags: ["semana-santa"],
  },
  {
    id: "tailandia-ss-2026",
    destinationId: "tailandia",
    title: "Tailandia — Semana Santa 2026",
    departureDate: "2026-03-29",
    returnDate: "2026-04-09",
    durationDays: 12,
    priceFrom: 1290,
    promoPrice: 1090,
    promoLabel: "-15% Early Bird",
    flightEstimate: 650,
    totalPlaces: 18,
    placesLeft: 5,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Bangkok", "Templos y mercados flotantes"], ["Chiang Mai", "Templos dorados y street food"], ["Phi Phi", "Playas paradisíacas"]]),
    tags: ["semana-santa"],
  },
  {
    id: "marruecos-ss-2026",
    destinationId: "marruecos",
    title: "Marruecos — Semana Santa 2026",
    departureDate: "2026-03-28",
    returnDate: "2026-04-05",
    durationDays: 9,
    priceFrom: 890,
    flightEstimate: 180,
    totalPlaces: 16,
    placesLeft: 3,
    coordinatorId: "marta",
    status: "almost-full",
    included: [...defaultIncluded, "Noche en jaima del desierto"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Marrakech", "Medina, zocos y Jemaa el-Fna"], ["Sahara", "Ruta al desierto, noche en jaima"], ["Fez", "Medina medieval y artesanía"]]),
    tags: ["semana-santa"],
  },
  {
    id: "bali-ss-2026",
    destinationId: "bali",
    title: "Bali — Semana Santa 2026",
    departureDate: "2026-03-27",
    returnDate: "2026-04-08",
    durationDays: 13,
    priceFrom: 1390,
    flightEstimate: 800,
    totalPlaces: 14,
    placesLeft: 4,
    coordinatorId: "carlos",
    status: "almost-full",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Ubud", "Arrozales, yoga y templo del mono"], ["Monte Batur", "Trekking al volcán al amanecer"], ["Nusa Penida", "Acantilados y snorkel"]]),
    tags: ["semana-santa"],
  },
  {
    id: "egipto-ss-2026",
    destinationId: "egipto",
    title: "Egipto — Semana Santa 2026",
    departureDate: "2026-03-28",
    returnDate: "2026-04-06",
    durationDays: 10,
    priceFrom: 1190,
    promoPrice: 990,
    promoLabel: "-17% Oferta flash",
    flightEstimate: 350,
    totalPlaces: 16,
    placesLeft: 7,
    coordinatorId: "marta",
    status: "open",
    included: [...defaultIncluded, "Crucero por el Nilo 3 noches"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["El Cairo", "Pirámides de Giza y Esfinge"], ["Luxor", "Valle de los Reyes"], ["Nilo", "Crucero y templos de Edfu"]]),
    tags: ["semana-santa"],
  },

  // ─── PUENTE DE MAYO ───
  {
    id: "islandia-mayo-2026",
    destinationId: "islandia",
    title: "Islandia — Puente de mayo 2026",
    departureDate: "2026-04-30",
    returnDate: "2026-05-05",
    durationDays: 6,
    priceFrom: 1090,
    promoPrice: 890,
    promoLabel: "-18% Reserva anticipada",
    flightEstimate: 300,
    totalPlaces: 14,
    placesLeft: 6,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: [...defaultNotIncluded, "Ropa térmica (alquilable)"],
    itinerary: makeItinerary([["Reikiavik", "Llegada y Blue Lagoon"], ["Círculo Dorado", "Géiseres y cascadas"], ["Sur de Islandia", "Glaciar y playas negras"]]),
    tags: ["puente-mayo"],
  },
  {
    id: "marruecos-mayo-2026",
    destinationId: "marruecos",
    title: "Marruecos — Puente de mayo 2026",
    departureDate: "2026-04-30",
    returnDate: "2026-05-04",
    durationDays: 5,
    priceFrom: 590,
    flightEstimate: 150,
    totalPlaces: 18,
    placesLeft: 10,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Marrakech", "Medina y zocos"], ["Atlas", "Trekking en el Atlas"], ["Essaouira", "Costa atlántica"]]),
    tags: ["puente-mayo"],
  },
  {
    id: "grecia-mayo-2026",
    destinationId: "grecia",
    title: "Grecia — Puente de mayo 2026",
    departureDate: "2026-04-30",
    returnDate: "2026-05-05",
    durationDays: 6,
    priceFrom: 790,
    flightEstimate: 200,
    totalPlaces: 16,
    placesLeft: 8,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Atenas", "Acrópolis y barrio de Plaka"], ["Santorini", "Atardeceres y vino"], ["Mykonos", "Playas y vida nocturna"]]),
    tags: ["puente-mayo"],
  },

  // ─── VERANO 2026 ───
  {
    id: "brasil-verano-2026",
    destinationId: "brasil",
    title: "Brasil — Agosto 2026",
    departureDate: "2026-08-10",
    returnDate: "2026-08-22",
    durationDays: 12,
    priceFrom: 1290,
    flightEstimate: 750,
    totalPlaces: 18,
    placesLeft: 4,
    coordinatorId: "marta",
    status: "almost-full",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Rio de Janeiro", "Cristo Redentor y Copacabana"], ["Favela y Samba", "Tour guiado y noche de samba"], ["Florianópolis", "Playas del sur"]]),
    tags: ["verano"],
  },
  {
    id: "tailandia-julio-2026",
    destinationId: "tailandia",
    title: "Tailandia — Julio 2026",
    departureDate: "2026-07-05",
    returnDate: "2026-07-17",
    durationDays: 12,
    priceFrom: 1190,
    flightEstimate: 650,
    totalPlaces: 18,
    placesLeft: 9,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Bangkok", "Gran Palacio y Khao San"], ["Norte", "Chiang Mai y Pai"], ["Islas", "Koh Lanta y Phi Phi"]]),
    tags: ["verano"],
  },
  {
    id: "peru-julio-2026",
    destinationId: "peru",
    title: "Perú — Julio 2026",
    departureDate: "2026-07-12",
    returnDate: "2026-07-26",
    durationDays: 14,
    priceFrom: 1490,
    flightEstimate: 850,
    totalPlaces: 14,
    placesLeft: 6,
    coordinatorId: "marta",
    status: "open",
    included: [...defaultIncluded, "Tren a Machu Picchu"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Lima", "Gastronomía y Miraflores"], ["Cusco", "Plaza de Armas y San Pedro"], ["Machu Picchu", "Ciudadela inca al amanecer"]]),
    tags: ["verano"],
  },
  {
    id: "costa-rica-agosto-2026",
    destinationId: "costa-rica",
    title: "Costa Rica — Agosto 2026",
    departureDate: "2026-08-01",
    returnDate: "2026-08-13",
    durationDays: 12,
    priceFrom: 1390,
    flightEstimate: 800,
    totalPlaces: 16,
    placesLeft: 7,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["San José", "Llegada y mercado central"], ["Arenal", "Volcán y aguas termales"], ["Manuel Antonio", "Parque nacional y playas"]]),
    tags: ["verano"],
  },
  {
    id: "grecia-junio-2026",
    destinationId: "grecia",
    title: "Grecia — Junio 2026",
    departureDate: "2026-06-20",
    returnDate: "2026-06-30",
    durationDays: 10,
    priceFrom: 990,
    flightEstimate: 200,
    totalPlaces: 18,
    placesLeft: 11,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Atenas", "Acrópolis y Plaka"], ["Islas", "Santorini y Naxos"], ["Mykonos", "Playas y atardeceres"]]),
    tags: ["verano"],
  },
  {
    id: "mexico-julio-2026",
    destinationId: "mexico",
    title: "México — Julio 2026",
    departureDate: "2026-07-15",
    returnDate: "2026-07-28",
    durationDays: 13,
    priceFrom: 1290,
    flightEstimate: 750,
    totalPlaces: 16,
    placesLeft: 8,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["CDMX", "Teotihuacán y tacos al pastor"], ["Oaxaca", "Mercados y mezcal"], ["Tulum", "Cenotes y ruinas mayas"]]),
    tags: ["verano"],
  },
  {
    id: "bali-agosto-2026",
    destinationId: "bali",
    title: "Bali — Agosto 2026",
    departureDate: "2026-08-05",
    returnDate: "2026-08-17",
    durationDays: 12,
    priceFrom: 1290,
    flightEstimate: 750,
    totalPlaces: 14,
    placesLeft: 5,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Ubud", "Arrozales y templos"], ["Monte Batur", "Volcán al amanecer"], ["Gili Islands", "Snorkel y relax"]]),
    tags: ["verano"],
  },
  {
    id: "zanzibar-agosto-2026",
    destinationId: "zanzibar",
    title: "Zanzíbar — Agosto 2026",
    departureDate: "2026-08-15",
    returnDate: "2026-08-25",
    durationDays: 10,
    priceFrom: 1190,
    flightEstimate: 650,
    totalPlaces: 16,
    placesLeft: 9,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Stone Town", "Patrimonio de la Humanidad"], ["Especias", "Tour plantaciones"], ["Nungwi", "Playas del norte"]]),
    tags: ["verano"],
  },
  {
    id: "vietnam-agosto-2026",
    destinationId: "vietnam",
    title: "Vietnam — Agosto 2026",
    departureDate: "2026-08-08",
    returnDate: "2026-08-22",
    durationDays: 14,
    priceFrom: 1190,
    flightEstimate: 700,
    totalPlaces: 16,
    placesLeft: 10,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Hanoi", "Casco antiguo y street food"], ["Ha Long", "Crucero por la bahía"], ["Hoi An", "Ciudad de los farolillos"]]),
    tags: ["verano"],
  },

  // ─── SEPTIEMBRE ───
  {
    id: "japon-sept-2026",
    destinationId: "japon",
    title: "Japón — Septiembre 2026",
    departureDate: "2026-09-05",
    returnDate: "2026-09-19",
    durationDays: 14,
    priceFrom: 1490,
    flightEstimate: 850,
    totalPlaces: 16,
    placesLeft: 8,
    coordinatorId: "marta",
    status: "open",
    included: [...defaultIncluded, "Japan Rail Pass"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Tokio", "Shibuya, Akihabara y ramen"], ["Kioto", "Templos y geishas"], ["Osaka", "Street food y castillo"]]),
    tags: ["septiembre"],
  },
  {
    id: "bali-sept-2026",
    destinationId: "bali",
    title: "Bali — Septiembre 2026",
    departureDate: "2026-09-12",
    returnDate: "2026-09-24",
    durationDays: 12,
    priceFrom: 1250,
    flightEstimate: 750,
    totalPlaces: 14,
    placesLeft: 7,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Ubud", "Cascadas y arrozales"], ["Nusa Penida", "Acantilados y snorkel"], ["Uluwatu", "Atardecer y danza Kecak"]]),
    tags: ["septiembre"],
  },
  {
    id: "zanzibar-sept-2026",
    destinationId: "zanzibar",
    title: "Zanzíbar — Septiembre 2026",
    departureDate: "2026-09-05",
    returnDate: "2026-09-15",
    durationDays: 10,
    priceFrom: 1190,
    flightEstimate: 650,
    totalPlaces: 16,
    placesLeft: 8,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Stone Town", "Historia y cultura"], ["Mnemba", "Snorkel en atolón"], ["Nungwi", "Playa y atardecer"]]),
    tags: ["septiembre"],
  },

  // ─── PUENTE DE OCTUBRE ───
  {
    id: "marruecos-oct-2026",
    destinationId: "marruecos",
    title: "Marruecos — Puente octubre 2026",
    departureDate: "2026-10-09",
    returnDate: "2026-10-13",
    durationDays: 5,
    priceFrom: 590,
    flightEstimate: 150,
    totalPlaces: 18,
    placesLeft: 12,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Marrakech", "Medina y Jemaa el-Fna"], ["Ouarzazate", "Kasbahs y cine"], ["Desierto", "Noche en el Sahara"]]),
    tags: ["puente-octubre"],
  },
  {
    id: "islandia-oct-2026",
    destinationId: "islandia",
    title: "Islandia — Puente octubre 2026",
    departureDate: "2026-10-09",
    returnDate: "2026-10-14",
    durationDays: 6,
    priceFrom: 1090,
    flightEstimate: 280,
    totalPlaces: 14,
    placesLeft: 5,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: [...defaultNotIncluded, "Ropa térmica"],
    itinerary: makeItinerary([["Reikiavik", "Blue Lagoon y bienvenida"], ["Sur", "Cascadas y playas negras"], ["Auroras", "Caza de auroras boreales"]]),
    tags: ["puente-octubre"],
  },

  // ─── PUENTE DE NOVIEMBRE ───
  {
    id: "tailandia-nov-2026",
    destinationId: "tailandia",
    title: "Tailandia — Puente noviembre 2026",
    departureDate: "2026-10-31",
    returnDate: "2026-11-09",
    durationDays: 10,
    priceFrom: 1090,
    flightEstimate: 600,
    totalPlaces: 18,
    placesLeft: 11,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Bangkok", "Templos y Khao San Road"], ["Chiang Mai", "Montañas y elefantes"], ["Krabi", "Playas y kayak"]]),
    tags: ["puente-noviembre"],
  },
  {
    id: "peru-nov-2026",
    destinationId: "peru",
    title: "Perú — Puente noviembre 2026",
    departureDate: "2026-10-31",
    returnDate: "2026-11-10",
    durationDays: 11,
    priceFrom: 1390,
    flightEstimate: 800,
    totalPlaces: 14,
    placesLeft: 6,
    coordinatorId: "marta",
    status: "open",
    included: [...defaultIncluded, "Tren a Machu Picchu"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Lima", "Miraflores y ceviche"], ["Cusco", "Ciudad imperial"], ["Machu Picchu", "La ciudadela inca"]]),
    tags: ["puente-noviembre"],
  },
  {
    id: "egipto-nov-2026",
    destinationId: "egipto",
    title: "Egipto — Puente noviembre 2026",
    departureDate: "2026-10-31",
    returnDate: "2026-11-08",
    durationDays: 9,
    priceFrom: 1090,
    flightEstimate: 300,
    totalPlaces: 16,
    placesLeft: 9,
    coordinatorId: "carlos",
    status: "open",
    included: [...defaultIncluded, "Crucero por el Nilo"],
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["El Cairo", "Pirámides y museo"], ["Luxor", "Valle de los Reyes"], ["Asuán", "Templo de Philae"]]),
    tags: ["puente-noviembre"],
  },

  // ─── NAVIDAD / FIN DE AÑO ───
  {
    id: "laponia-navidad-2026",
    destinationId: "laponia",
    title: "Laponia — Navidad 2026",
    departureDate: "2026-12-20",
    returnDate: "2026-12-27",
    durationDays: 7,
    priceFrom: 1590,
    flightEstimate: 400,
    totalPlaces: 14,
    placesLeft: 3,
    coordinatorId: "carlos",
    status: "almost-full",
    included: [...defaultIncluded, "Actividades árticas", "Trineo de huskies"],
    notIncluded: [...defaultNotIncluded, "Ropa térmica (alquilable)"],
    itinerary: makeItinerary([["Rovaniemi", "Bienvenida navideña"], ["Huskies", "Trineo y sauna"], ["Auroras", "Caza de auroras boreales"]]),
    tags: ["navidad"],
  },
  {
    id: "maldivas-navidad-2026",
    destinationId: "maldivas",
    title: "Maldivas — Navidad 2026",
    departureDate: "2026-12-22",
    returnDate: "2026-12-30",
    durationDays: 8,
    priceFrom: 1490,
    flightEstimate: 900,
    totalPlaces: 12,
    placesLeft: 2,
    coordinatorId: "marta",
    status: "almost-full",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Malé", "Llegada y traslado en lancha"], ["Snorkel", "Mantas y tortugas"], ["Isla desierta", "Picnic en banco de arena"]]),
    tags: ["navidad"],
  },
  {
    id: "tailandia-fda-2026",
    destinationId: "tailandia",
    title: "Tailandia — Fin de Año 2026",
    departureDate: "2026-12-27",
    returnDate: "2027-01-07",
    durationDays: 12,
    priceFrom: 1290,
    flightEstimate: 700,
    totalPlaces: 18,
    placesLeft: 6,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Bangkok", "Nochevieja en la capital"], ["Norte", "Templos de Chiang Mai"], ["Sur", "Islas del sur"]]),
    tags: ["fin-de-anio"],
  },
  {
    id: "costa-rica-fda-2026",
    destinationId: "costa-rica",
    title: "Costa Rica — Fin de Año 2026",
    departureDate: "2026-12-26",
    returnDate: "2027-01-06",
    durationDays: 12,
    priceFrom: 1490,
    flightEstimate: 850,
    totalPlaces: 16,
    placesLeft: 7,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["San José", "Llegada y bienvenida"], ["Arenal", "Volcán y aguas termales"], ["Caribe", "Nochevieja en la costa"]]),
    tags: ["fin-de-anio"],
  },
  {
    id: "mexico-fda-2026",
    destinationId: "mexico",
    title: "México — Fin de Año 2026",
    departureDate: "2026-12-27",
    returnDate: "2027-01-08",
    durationDays: 13,
    priceFrom: 1390,
    flightEstimate: 750,
    totalPlaces: 16,
    placesLeft: 5,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["CDMX", "Pirámides y mezcal"], ["Oaxaca", "Nochevieja oaxaqueña"], ["Tulum", "Cenotes y playa"]]),
    tags: ["fin-de-anio"],
  },

  // ─── EXTRA / MULTI-SEASON ───
  {
    id: "maldivas-junio-2026",
    destinationId: "maldivas",
    title: "Maldivas — Junio 2026",
    departureDate: "2026-06-15",
    returnDate: "2026-06-23",
    durationDays: 8,
    priceFrom: 1390,
    flightEstimate: 850,
    totalPlaces: 12,
    placesLeft: 5,
    coordinatorId: "carlos",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Malé", "Traslado y bienvenida"], ["Snorkel", "Mantas raya y arrecifes"], ["Isla desierta", "Día en una isla desierta"]]),
    tags: ["verano"],
  },
  {
    id: "laponia-dic-2026",
    destinationId: "laponia",
    title: "Laponia — Diciembre 2026",
    departureDate: "2026-12-05",
    returnDate: "2026-12-12",
    durationDays: 7,
    priceFrom: 1490,
    flightEstimate: 400,
    totalPlaces: 14,
    placesLeft: 6,
    coordinatorId: "carlos",
    status: "open",
    included: [...defaultIncluded, "Actividades árticas"],
    notIncluded: [...defaultNotIncluded, "Ropa térmica (alquilable)"],
    itinerary: makeItinerary([["Rovaniemi", "Bienvenida y primera aurora"], ["Huskies", "Trineo y sauna finlandesa"], ["Moto de nieve", "Excursión por el Ártico"]]),
    tags: ["navidad"],
  },
  {
    id: "vietnam-sept-2026",
    destinationId: "vietnam",
    title: "Vietnam — Septiembre 2026",
    departureDate: "2026-09-10",
    returnDate: "2026-09-24",
    durationDays: 14,
    priceFrom: 1150,
    flightEstimate: 680,
    totalPlaces: 16,
    placesLeft: 10,
    coordinatorId: "marta",
    status: "open",
    included: defaultIncluded,
    notIncluded: defaultNotIncluded,
    itinerary: makeItinerary([["Hanoi", "Barrio antiguo y phở"], ["Sapa", "Arrozales y trekking"], ["Hoi An", "Farolillos y sastre"]]),
    tags: ["septiembre"],
  },
]

export const coordinators: Coordinator[] = [
  {
    id: "marta",
    name: "Marta López",
    age: 29,
    role: "Coordinadora Senior",
    bio: "Lleva 4 años abriendo rutas por el mundo. Su especialidad: que el grupo se sienta familia desde el primer día.",
    destinations: ["brasil", "japon", "zanzibar", "peru", "bali", "egipto"],
    quote: "Lo mejor de un viaje no es el destino, es con quién lo compartes.",
    image: "/images/hero-brasil.jpg",
  },
  {
    id: "carlos",
    name: "Carlos Ruiz",
    age: 32,
    role: "Coordinador de Aventura",
    bio: "Experto en destinos fríos y experiencias extremas. Si hay nieve, huskies o auroras, él lo gestiona.",
    destinations: ["laponia", "maldivas", "islandia", "tailandia", "costa-rica", "marruecos"],
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
  },
  {
    id: "t3",
    name: "Ana",
    age: 31,
    city: "Valencia",
    destinationId: "japon",
    quote: "Japón me volaba la cabeza cada día. Y el grupo hizo que fuera 10 veces mejor.",
    rating: 5,
    image: "",
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
  },
  {
    id: "t6",
    name: "David",
    age: 30,
    city: "Málaga",
    destinationId: "brasil",
    quote: "Repetí con Travelhood. La primera vez fui solo, la segunda convencí a dos amigos.",
    rating: 5,
    image: "",
  },
]

// --- TRIP CATEGORIES ---

export const tripCategories: TripCategoryData[] = [
  {
    name: "Aventura",
    slug: "aventura",
    editorial:
      "Los viajes de aventura de Travelhood están diseñados para jóvenes de 20 a 35 años que quieren experiencias que les pongan la piel de gallina. No hablamos de turismo extremo, sino de vivir cada destino con intensidad: trekkings al amanecer, deportes acuáticos, rutas por la naturaleza y actividades que no harías por tu cuenta. Desde escalar volcanes en Bali hasta recorrer el desierto del Sahara en camello, nuestros viajes de aventura combinan adrenalina con seguridad, siempre con coordinador en destino y un grupo reducido de compañeros de viaje.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Viajeros activos que buscan experiencias intensas, no les importa madrugar para ver un amanecer desde un volcán y prefieren las rutas alternativas a los circuitos turísticos. No necesitas estar en forma de atleta, solo tener ganas de moverte y descubrir.",
    faqs: [
      { question: "¿Necesito experiencia previa en aventura?", answer: "No. Nuestros itinerarios están diseñados para todos los niveles. Las actividades son accesibles y siempre hay alternativas si algo no te convence." },
      { question: "¿Qué nivel de forma física necesito?", answer: "Moderado. Caminar varias horas al día, subir escalones de templos o hacer snorkel. Nada que requiera entrenamiento previo." },
      { question: "¿Qué destinos de aventura recomendáis para empezar?", answer: "Costa Rica y Marruecos son perfectos para un primer viaje de aventura: accesibles, variados y con una mezcla de naturaleza y cultura que engancha." },
    ],
    seoTitle: "Viajes de aventura en grupo para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes de aventura en grupo para jóvenes: trekkings, volcanes, desiertos y naturaleza salvaje. Grupos reducidos con coordinador, desde 590€.",
  },
  {
    name: "Playa",
    slug: "playa",
    editorial:
      "Los viajes de playa de Travelhood no son vacaciones de tumbona y buffet. Son expediciones a las playas más espectaculares del mundo con un grupo de jóvenes de 20 a 35 años que quieren combinar arena blanca con experiencias reales. Desde las islas Phi Phi de Tailandia hasta las playas de Zanzíbar, pasando por las calas de Grecia, los cenotes de México y los arrecifes de Maldivas, nuestros viajes de playa incluyen snorkel, excursiones en barco, atardeceres en acantilados y noches bajo las estrellas. Todo con coordinador en destino y la logística resuelta.",
    heroImage: "/images/hero-maldivas.jpg",
    idealProfile: "Amantes del mar, el sol y los atardeceres épicos. Viajeros que quieren playas de postal pero también experiencias culturales y gastronomía local. No buscas un all-inclusive, buscas vivir el destino con los pies en la arena.",
    faqs: [
      { question: "¿Son playas masificadas?", answer: "No. Seleccionamos playas accesibles pero fuera de las rutas más turísticas. Nada de Benidorm: piensa en Nusa Penida, Nungwi o Phi Phi fuera de temporada." },
      { question: "¿Puedo hacer snorkel sin experiencia?", answer: "Sí. El snorkel no requiere ninguna experiencia previa y el equipo se proporciona en destino. Es una de las actividades más populares." },
      { question: "¿Cuál es el mejor destino de playa?", answer: "Depende de tu estilo: Maldivas para lujo accesible, Tailandia para playa + cultura, Grecia para Mediterráneo, Bali para playa + espiritualidad." },
    ],
    seoTitle: "Viajes de playa en grupo para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes de playa en grupo para jóvenes: Tailandia, Maldivas, Grecia, Bali y más. Playas paradisíacas, snorkel y aventura. Desde 790€.",
  },
  {
    name: "Cultural",
    slug: "cultural",
    editorial:
      "Los viajes culturales de Travelhood son para jóvenes curiosos de 20 a 35 años que quieren entender los lugares que visitan, no solo fotografiarlos. Desde los templos de Japón hasta las pirámides de Egipto, pasando por las medinas de Marruecos y las ruinas mayas de México, nuestros viajes culturales combinan historia, gastronomía, arte y tradiciones locales en itinerarios diseñados para vivir cada cultura desde dentro. No es un tour con audioguía: es una inmersión con coordinador local, cenas en restaurantes auténticos y experiencias que no encontrarías en ninguna guía.",
    heroImage: "/images/hero-japon.jpg",
    idealProfile: "Viajeros curiosos que disfrutan aprendiendo sobre otras culturas, probando platos locales y descubriendo la historia detrás de cada lugar. Les gustan los museos pero también los mercados callejeros, los templos y las conversaciones con locales.",
    faqs: [
      { question: "¿Necesito conocer la historia del destino antes de ir?", answer: "No. El coordinador y los guías locales te ponen en contexto durante el viaje. Pero si te gusta prepararte, te enviamos material previo." },
      { question: "¿Hay tiempo libre para explorar?", answer: "Sí. Todos nuestros itinerarios incluyen tiempo libre para que explores a tu ritmo, te pierdas por calles o descubras rincones por tu cuenta." },
      { question: "¿Cuál es el destino cultural más recomendado?", answer: "Japón es imbatible para una inmersión cultural total. Egipto para historia antigua. Marruecos para una experiencia sensorial completa." },
    ],
    seoTitle: "Viajes culturales en grupo para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes culturales en grupo para jóvenes: Japón, Egipto, Marruecos, México y más. Inmersión cultural con coordinador, desde 590€.",
  },
  {
    name: "Naturaleza",
    slug: "naturaleza",
    editorial:
      "Los viajes de naturaleza de Travelhood llevan a jóvenes de 20 a 35 años a los paisajes más impresionantes del planeta. Desde los glaciares de Islandia hasta la selva de Costa Rica, pasando por los volcanes de Bali y los arrozales de Vietnam, nuestros viajes de naturaleza son para quienes sienten que los mejores momentos de un viaje ocurren al aire libre. Trekkings entre arrozales, amaneceres volcánicos, avistamiento de fauna salvaje y noches bajo cielos estrellados: cada itinerario está diseñado para conectar con la naturaleza sin renunciar a la comodidad de un viaje organizado con coordinador.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Amantes de los paisajes dramáticos, los animales salvajes y las experiencias al aire libre. Prefieren un volcán al amanecer que un museo, y disfrutan tanto de una caminata entre arrozales como de un snorkel en arrecifes de coral.",
    faqs: [
      { question: "¿Son viajes de senderismo puro?", answer: "No. Combinamos naturaleza con cultura, gastronomía y relax. Hay caminatas, pero también playas, ciudades y experiencias variadas." },
      { question: "¿Veré animales salvajes?", answer: "Depende del destino. En Costa Rica es casi seguro (monos, tucanes, perezosos). En Zanzíbar puedes nadar con delfines. En Islandia hay ballenas y frailecillos." },
      { question: "¿Cuál es el mejor destino de naturaleza?", answer: "Costa Rica es biodiversidad pura. Islandia es paisaje extremo. Bali es naturaleza tropical con espiritualidad. Cada uno ofrece algo único." },
    ],
    seoTitle: "Viajes de naturaleza en grupo para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes de naturaleza en grupo para jóvenes: Islandia, Costa Rica, Bali y más. Volcanes, selvas y glaciares con coordinador, desde 1.090€.",
  },
  {
    name: "Nieve",
    slug: "nieve",
    editorial:
      "Los viajes de nieve de Travelhood son la experiencia más mágica que puedes vivir en invierno. Auroras boreales en Laponia, glaciares en Islandia, trineos de huskies, motos de nieve y saunas bajo las estrellas árticas. Nuestros viajes de nieve llevan a jóvenes de 20 a 35 años a vivir el invierno de verdad, lejos de las pistas de esquí convencionales. No necesitas experiencia en frío extremo: te proporcionamos toda la información sobre equipamiento y los alojamientos son cálidos y acogedores. Lo que sí necesitas son ganas de vivir algo que no vas a olvidar jamás.",
    heroImage: "/images/hero-laponia.jpg",
    idealProfile: "Viajeros que quieren experiencias únicas e irrepetibles. No les asusta el frío porque saben que la recompensa merece cada grado bajo cero. Buscan auroras, nieve virgen y noches árticas que quitan el aliento.",
    faqs: [
      { question: "¿Cuánto frío hace?", answer: "En Laponia puede bajar a -20°C, pero con la ropa adecuada (que puedes alquilar allí) no se pasa frío. En Islandia en invierno es más suave: -5 a 5°C." },
      { question: "¿Necesito ropa especial?", answer: "Sí, pero no necesitas comprarla. En Laponia puedes alquilar mono térmico, botas y guantes. Te enviamos una lista completa antes del viaje." },
      { question: "¿Veré auroras boreales seguro?", answer: "No hay garantía al 100% porque depende de la actividad solar, pero en diciembre-marzo las probabilidades son altísimas. Salimos varias noches a cazarlas." },
    ],
    seoTitle: "Viajes de nieve en grupo para jóvenes de 20 a 35 años | Travelhood",
    seoDescription: "Viajes de nieve en grupo para jóvenes: Laponia e Islandia. Auroras boreales, huskies y experiencias árticas con coordinador, desde 1.090€.",
  },
]

// --- SEASONS ---

export const seasons: SeasonData[] = [
  {
    name: "Semana Santa",
    slug: "semana-santa",
    tags: ["semana-santa"],
    editorial:
      "Semana Santa es el primer gran viaje del año. Una semana entera (o casi) para escaparte con un grupo de jóvenes de 20 a 35 años a destinos increíbles. Es la temporada perfecta para Asia (Japón con los cerezos en flor, Tailandia antes de las lluvias, Bali en su mejor momento) y para destinos cercanos como Marruecos o Egipto. En Travelhood preparamos viajes de 9 a 14 días que aprovechan al máximo las vacaciones de Semana Santa, con coordinador en destino y todo organizado para que tú solo tengas que elegir destino y hacer la maleta.",
    heroImage: "/images/hero-japon.jpg",
    faqs: [
      { question: "¿Cuándo es Semana Santa 2026?", answer: "Del 28 de marzo al 6 de abril de 2026. Nuestros viajes salen entre el 27 y el 29 de marzo." },
      { question: "¿Hay que reservar con mucha antelación?", answer: "Sí. Los viajes de Semana Santa se llenan rápido porque las fechas son fijas y la demanda es alta. Recomendamos reservar al menos 2-3 meses antes." },
      { question: "¿Qué destino recomendáis para Semana Santa?", answer: "Japón con los cerezos en flor es mágico. Tailandia es el más versátil. Marruecos es perfecto si buscas algo cercano y económico." },
    ],
    seoTitle: "Viajes en grupo Semana Santa 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo para Semana Santa 2026: Japón, Tailandia, Bali, Marruecos y Egipto. Grupos de jóvenes 20-35 años con coordinador, desde 890€.",
  },
  {
    name: "Puentes",
    slug: "puentes",
    tags: ["puente-mayo", "puente-octubre", "puente-noviembre"],
    editorial:
      "Los puentes son la excusa perfecta para una escapada de 5 a 11 días sin gastar todas tus vacaciones. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años en los tres grandes puentes del año: mayo, octubre y noviembre. Destinos cercanos como Marruecos (2h de vuelo, desde 590€) son ideales para puentes cortos, mientras que destinos como Tailandia, Perú o Egipto son perfectos para puentes largos combinados con unos días de vacaciones. Cada puente tiene sus destinos estrella y todos incluyen coordinador en destino.",
    heroImage: "/images/hero-zanzibar.jpg",
    faqs: [
      { question: "¿Qué puentes hay en 2026?", answer: "Puente de mayo (1 de mayo), puente de octubre (12 de octubre) y puente de noviembre (1 de noviembre). Algunos incluyen el fin de semana, otros no." },
      { question: "¿Se puede ir lejos en un puente?", answer: "Sí. Nuestros viajes de puente van de 5 a 11 días, combinando el puente con unos días de vacaciones. Tailandia, Perú o Egipto son opciones reales." },
      { question: "¿Cuál es el puente más barato?", answer: "Mayo y octubre suelen tener los vuelos más baratos. Marruecos en puente de mayo (desde 590€ + vuelo 50-150€) es la opción más económica." },
    ],
    seoTitle: "Viajes en grupo en puentes 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo para puentes 2026: mayo, octubre y noviembre. Escapadas de 5-11 días para jóvenes de 20-35 años con coordinador, desde 590€.",
  },
  {
    name: "Verano",
    slug: "verano",
    tags: ["verano"],
    editorial:
      "El verano es la temporada grande. De junio a agosto tienes semanas enteras para vivir el viaje de tu vida con un grupo de jóvenes de 20 a 35 años. En Travelhood ofrecemos la mayor variedad de destinos en verano: desde Brasil hasta Vietnam, pasando por Tailandia, Perú, Costa Rica, Grecia, México, Bali y Zanzíbar. Los viajes de verano son de 10 a 14 días y están diseñados para exprimir al máximo la temporada. El verano es también la época con más plazas disponibles, así que hay opciones para todos los gustos y presupuestos. Los grupos se llenan, pero siempre añadimos fechas nuevas si la demanda lo pide.",
    heroImage: "/images/hero-brasil.jpg",
    faqs: [
      { question: "¿No es mejor época para la playa que para viajar?", answer: "¿Por qué elegir? Nuestros viajes de verano combinan playa con aventura y cultura. Brasil tiene playas y samba. Grecia tiene calas e historia. Bali tiene arrozales y volcanes." },
      { question: "¿Se llenan rápido los viajes de verano?", answer: "Sí. Julio y agosto son los meses de mayor demanda. Recomendamos reservar 3-4 meses antes para asegurar plaza." },
      { question: "¿Cuál es el destino de verano más económico?", answer: "Grecia (desde 990€ + vuelo 200€) y Vietnam (desde 1.150€) ofrecen la mejor relación calidad-precio en verano." },
    ],
    seoTitle: "Viajes en grupo verano 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo verano 2026 para jóvenes de 20-35 años: Brasil, Tailandia, Grecia, Bali, Perú y más. Coordinador en destino, desde 990€.",
  },
  {
    name: "Septiembre",
    slug: "septiembre",
    tags: ["septiembre"],
    editorial:
      "Septiembre es el mes inteligente para viajar. Los precios bajan, los destinos están menos masificados y el clima sigue siendo perfecto en la mayoría de lugares. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años que aprovechan este mes dorado: Japón sin las hordas de verano, Bali en su mejor momento, Zanzíbar con cielos despejados y Vietnam con temperaturas ideales. Los viajes de septiembre son de 10 a 14 días y ofrecen la misma experiencia que en verano pero con menos gente y a menudo mejor precio. Es la opción preferida de quienes tienen flexibilidad de fechas.",
    heroImage: "/images/hero-japon.jpg",
    faqs: [
      { question: "¿Hace buen tiempo en septiembre?", answer: "En la mayoría de nuestros destinos, sí. Japón tiene temperaturas perfectas, Bali está en temporada seca y Zanzíbar tiene el mejor clima del año." },
      { question: "¿Por qué es más barato viajar en septiembre?", answer: "Porque es temporada baja en muchos destinos. Los vuelos y alojamientos bajan de precio, y los lugares turísticos están menos masificados." },
      { question: "¿Qué destino recomendáis en septiembre?", answer: "Japón en septiembre es espectacular: templos sin aglomeraciones y clima perfecto. Bali es otra opción imbatible." },
    ],
    seoTitle: "Viajes en grupo septiembre 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo en septiembre 2026 para jóvenes: Japón, Bali, Zanzíbar y Vietnam. Menos gente, mejores precios. Coordinador incluido, desde 1.150€.",
  },
  {
    name: "Navidad",
    slug: "navidad",
    tags: ["navidad"],
    editorial:
      "¿Y si estas Navidades haces algo diferente? En Travelhood organizamos viajes de Navidad para jóvenes de 20 a 35 años que prefieren vivir la Navidad en un lugar extraordinario. Laponia es el destino estrella: auroras boreales, huskies, nieve y magia ártica. Maldivas es para quienes prefieren pasar la Nochebuena en una isla paradisíaca. Los viajes de Navidad salen alrededor del 20-22 de diciembre y duran 7-8 días, perfectos para combinar con las vacaciones. Son los viajes que antes se llenan porque las plazas son limitadas y la demanda es altísima.",
    heroImage: "/images/hero-laponia.jpg",
    faqs: [
      { question: "¿Se celebra la Navidad durante el viaje?", answer: "¡Por supuesto! Celebramos Nochebuena y Navidad con el grupo. En Laponia con cena especial bajo las auroras, en Maldivas con cena en la playa." },
      { question: "¿Con cuánta antelación hay que reservar?", answer: "Los viajes de Navidad se llenan 4-5 meses antes. Recomendamos reservar en verano para asegurar plaza." },
      { question: "¿Es muy caro viajar en Navidad?", answer: "Los vuelos suben en Navidad, pero el precio del viaje con Travelhood es competitivo. Laponia desde 1.390€ y Maldivas desde 1.350€ (sin vuelo)." },
    ],
    seoTitle: "Viajes en grupo Navidad 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo Navidad 2026 para jóvenes: Laponia y Maldivas. Auroras boreales, nieve y paraíso tropical. Coordinador incluido, desde 1.350€.",
  },
  {
    name: "Fin de Año",
    slug: "fin-de-anio",
    tags: ["fin-de-anio"],
    editorial:
      "Despedir el año viajando con un grupo de gente increíble es la mejor forma de empezar el siguiente. En Travelhood organizamos viajes de Fin de Año para jóvenes de 20 a 35 años a destinos que hacen que la Nochevieja sea inolvidable: Tailandia con fiesta en la playa, Costa Rica con volcanes y Caribe, México con cenotes y pirámides. Los viajes salen entre el 26 y el 27 de diciembre y duran 12-13 días, combinando la última semana del año con la primera del siguiente. Son viajes perfectos para cerrar un capítulo y abrir otro con historias que contar.",
    heroImage: "/images/hero-brasil.jpg",
    faqs: [
      { question: "¿Dónde celebramos la Nochevieja?", answer: "Depende del destino. En Tailandia, fiesta en la playa de Koh Lanta. En Costa Rica, en la costa caribeña. En México, Nochevieja oaxaqueña con mezcal y tradición." },
      { question: "¿Cuánto duran los viajes de Fin de Año?", answer: "12-13 días, del 26-27 de diciembre al 6-8 de enero. Necesitas vacaciones de Navidad completas." },
      { question: "¿Hay opción más corta para Fin de Año?", answer: "Actualmente nuestros viajes de Fin de Año son de 12-13 días. Si buscas algo más corto, Laponia en Navidad (7 días) es una opción cercana en fechas." },
    ],
    seoTitle: "Viajes en grupo Fin de Año 2026 para jóvenes | Travelhood",
    seoDescription: "Viajes en grupo Fin de Año 2026 para jóvenes: Tailandia, Costa Rica y México. Nochevieja viajando, 12-13 días con coordinador, desde 1.290€.",
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
