// Extended data for trip detail pages
// Photos, FAQs, coordinates, and promo pricing

export interface DestinationFAQ {
  question: string
  answer: string
}

export interface ItineraryCoord {
  day: number
  title: string
  description: string
  lat: number
  lng: number
}

export interface TripExtra {
  promoPrice?: number
  promoLabel?: string
  itinerary?: ItineraryCoord[]
}

const photo = (seed: string, i: number, w = 800, h = 600) =>
  `https://picsum.photos/seed/th-${seed}-${i}/${w}/${h}`

const photos = (seed: string, count = 8) =>
  Array.from({ length: count }, (_, i) => photo(seed, i + 1))

export const destinationPhotos: Record<string, string[]> = {
  brasil: photos("brasil"),
  laponia: photos("laponia"),
  maldivas: photos("maldivas"),
  japon: photos("japon"),
  zanzibar: photos("zanzibar"),
  tailandia: photos("tailandia"),
  marruecos: photos("marruecos"),
  islandia: photos("islandia"),
  peru: photos("peru"),
  bali: photos("bali"),
  "costa-rica": photos("costarica"),
  egipto: photos("egipto"),
  grecia: photos("grecia"),
  mexico: photos("mexico"),
  vietnam: photos("vietnam"),
  colombia: photos("colombia"),
  jordania: photos("jordania"),
  "sri-lanka": photos("srilanka"),
  india: photos("india"),
  turquia: photos("turquia"),
  portugal: photos("portugal"),
  cuba: photos("cuba"),
  "tanzania-safari": photos("tanzania"),
  namibia: photos("namibia"),
  argentina: photos("argentina"),
}

export const destinationFaqs: Record<string, DestinationFAQ[]> = {
  japon: [
    { question: "¿Necesito visado para Japón?", answer: "No. Los ciudadanos españoles pueden entrar sin visado para estancias de hasta 90 días como turistas." },
    { question: "¿Es caro comer en Japón?", answer: "Menos de lo que piensas. Los konbinis (tiendas 24h) y los restaurantes locales de ramen o curry ofrecen comidas completas por 5-10€. Comer bien y barato en Japón es facilísimo." },
    { question: "¿El Japan Rail Pass merece la pena?", answer: "Sí, y además está incluido en el precio del viaje. Cubre trenes bala y líneas locales por todo el país." },
    { question: "¿Qué nivel de forma física necesito?", answer: "No hace falta estar en forma. El ritmo del viaje es tranquilo con algunos días de más actividad (como visitar templos o subir miradores), pero nada extremo." },
    { question: "¿Puedo usar tarjeta en Japón?", answer: "Sí, cada vez más. Pero conviene llevar algo de efectivo (yenes) para templos, máquinas expendedoras y algunos restaurantes pequeños." },
  ],
  tailandia: [
    { question: "¿Necesito vacunas para Tailandia?", answer: "No hay vacunas obligatorias, pero se recomienda hepatitis A y B, y tétanos. Consulta con tu centro de vacunación internacional." },
    { question: "¿Se puede beber agua del grifo?", answer: "No. Siempre agua embotellada, que es muy barata y está disponible en todas partes." },
    { question: "¿Cómo es el calor en Tailandia?", answer: "Sí, hace calor (28-35°C), pero los templos tienen sombra, las playas tienen brisa y los alojamientos tienen aire acondicionado. Te acostumbras rápido." },
    { question: "¿Es seguro para viajar solo/a?", answer: "Tailandia es uno de los destinos más seguros del sudeste asiático para turistas. Y además, vas con grupo y coordinador." },
  ],
  marruecos: [
    { question: "¿Es seguro Marruecos?", answer: "Sí. Es uno de los destinos más visitados de África y muy acostumbrado al turismo. Con coordinador y grupo, cero preocupaciones." },
    { question: "¿Cómo es dormir en el desierto?", answer: "Dormimos en jaimas (tiendas bereberes) con camas, mantas y cena bajo las estrellas. Es una experiencia increíble." },
    { question: "¿Necesito visado?", answer: "No. Los ciudadanos españoles pueden entrar sin visado hasta 90 días." },
    { question: "¿Qué ropa debo llevar?", answer: "Ropa cómoda y ligera, pero también algo de abrigo para las noches en el desierto y montañas. Te enviaremos una lista completa antes del viaje." },
  ],
  brasil: [
    { question: "¿Necesito visado para Brasil?", answer: "No. Los ciudadanos españoles no necesitan visado para estancias turísticas de hasta 90 días." },
    { question: "¿Es peligroso Brasil?", answer: "Como en cualquier gran ciudad, hay que tener sentido común. Con coordinador local y moviéndote en grupo, es un destino muy disfrutable y seguro." },
    { question: "¿Qué moneda usan?", answer: "El real brasileño (BRL). Se puede cambiar en el aeropuerto o sacar de cajeros. Las tarjetas funcionan en la mayoría de sitios." },
    { question: "¿Cuál es la mejor época para ir?", answer: "El invierno brasileño (junio-agosto) tiene temperaturas agradables de 20-28°C y menos lluvias en el sur. Perfecto para nuestros viajes de verano." },
  ],
  laponia: [
    { question: "¿Cuánto frío hace en Laponia?", answer: "Puede bajar a -20°C o más, pero con la ropa adecuada (que puedes alquilar allí) no se pasa frío. El equipo te da la lista completa." },
    { question: "¿Seguro que veré auroras boreales?", answer: "No hay garantía al 100% porque depende de la actividad solar y el clima, pero en diciembre las probabilidades son altísimas. Salimos varias noches a cazarlas." },
    { question: "¿Es caro Finlandia?", answer: "Finlandia tiene precios algo más altos que España. Pero el alojamiento, actividades y transportes están incluidos, así que el gasto extra es muy controlable." },
    { question: "¿Qué actividades incluye?", answer: "Trineo de huskies, moto de nieve, sauna finlandesa, caza de auroras boreales y visita a una granja de renos. Todo incluido." },
  ],
  maldivas: [
    { question: "¿Maldivas en grupo no es raro?", answer: "Para nada. Es la mejor forma de disfrutarlo: compartes costes, experiencias y te diviertes mucho más que en un resort solo/a." },
    { question: "¿Se puede bucear sin experiencia?", answer: "Sí. El snorkel no requiere ninguna experiencia y ves tortugas, mantas y peces increíbles. Si quieres buceo con botella, hay cursos rápidos disponibles." },
    { question: "¿Cómo es el alojamiento?", answer: "Guest houses locales en islas habitadas por maldivos. Son cómodas, limpias y mucho más auténticas (y baratas) que los resorts." },
  ],
  islandia: [
    { question: "¿Necesito carné de conducir?", answer: "No. Todo el transporte está organizado. Viajamos en vehículos 4x4 o minibús con el coordinador." },
    { question: "¿Es posible ver auroras en octubre?", answer: "Sí, octubre es una época excelente. Las noches ya son largas y la actividad solar suele ser alta." },
    { question: "¿Puedo bañarme en aguas termales?", answer: "¡Sí! Incluimos la Blue Lagoon y visitamos piscinas termales naturales. Es una de las mejores experiencias del viaje." },
    { question: "¿Hace mucho frío?", answer: "En verano 5-15°C, en invierno -5 a 5°C. El viento es lo que más se nota. Te enviamos lista de ropa recomendada." },
  ],
  peru: [
    { question: "¿Me afectará la altitud?", answer: "Es posible. Cusco está a 3.400m. Por eso el itinerario está diseñado con aclimatación progresiva. Además, el mate de coca ayuda mucho." },
    { question: "¿Incluye el tren a Machu Picchu?", answer: "Sí. El tren panorámico y la entrada a Machu Picchu están incluidos en el precio." },
    { question: "¿Es seguro Perú?", answer: "Sí, especialmente en las zonas turísticas por las que nos movemos. Además, siempre vas con coordinador y grupo." },
    { question: "¿Cuál es la mejor época?", answer: "La temporada seca (mayo-septiembre) es ideal. Cielos despejados, sin lluvias y temperaturas agradables." },
  ],
  bali: [
    { question: "¿Necesito visado para Indonesia?", answer: "Los españoles pueden obtener visa on arrival de 30 días en el aeropuerto de Bali. Cuesta unos 35 USD y es un trámite rápido." },
    { question: "¿Es seguro nadar en Bali?", answer: "Sí, pero hay que respetar las corrientes. En las playas que visitamos las condiciones son buenas y siempre informamos al grupo." },
    { question: "¿Se puede hacer yoga sin experiencia?", answer: "Por supuesto. Las clases de yoga en Ubud son para todos los niveles. Es una experiencia relajante, no competitiva." },
    { question: "¿Cómo son las Islas Nusa?", answer: "Islas pequeñas cerca de Bali con acantilados impresionantes, aguas cristalinas y poca masificación. Son un paraíso." },
  ],
  "costa-rica": [
    { question: "¿Necesito vacunas?", answer: "No hay vacunas obligatorias. Se recomienda la de la fiebre amarilla si vienes de un país endémico, pero desde España no es necesario." },
    { question: "¿Veré animales salvajes?", answer: "Casi seguro. Costa Rica tiene una biodiversidad brutal: monos, tucanes, perezosos, ranas de colores... Los parques nacionales son increíbles." },
    { question: "¿Cómo es la comida?", answer: "Rica y variada. El gallo pinto (arroz con frijoles) es el rey. Mucha fruta tropical, casados (plato combinado) y mariscos frescos." },
  ],
  egipto: [
    { question: "¿Es seguro Egipto?", answer: "Las zonas turísticas (El Cairo, Luxor, Asuán) son muy seguras y están acostumbradas al turismo. Siempre con coordinador y guía local." },
    { question: "¿Hace mucho calor?", answer: "Depende de la época. En noviembre las temperaturas son perfectas (20-28°C). En verano puede superar los 40°C, por eso no programamos viajes en esa época." },
    { question: "¿Incluye el crucero por el Nilo?", answer: "Sí. El crucero de 3 noches con pensión completa, visitas guiadas a templos y traslados está incluido." },
    { question: "¿Necesito visado?", answer: "Sí, pero es muy sencillo. Se obtiene online (e-Visa) o directamente en el aeropuerto de El Cairo. Cuesta unos 25 USD." },
  ],
  grecia: [
    { question: "¿Cómo nos movemos entre islas?", answer: "En ferris rápidos. Los billetes están incluidos y organizamos los trayectos para que sean cómodos y con buenas vistas." },
    { question: "¿Es cara Grecia?", answer: "Tiene precios similares a España. Comer bien cuesta 10-15€ y las actividades son asequibles. El alojamiento ya está incluido." },
    { question: "¿Puedo bañarme en junio?", answer: "¡Sí! El agua está a 22-24°C y el clima es perfecto. Es la mejor época para visitar Grecia antes de la masificación de julio-agosto." },
  ],
  mexico: [
    { question: "¿Necesito visado para México?", answer: "No. Los ciudadanos españoles pueden entrar sin visado hasta 180 días como turistas." },
    { question: "¿Es picante toda la comida?", answer: "No toda, pero el picante es parte de la cultura. Siempre puedes pedir 'sin picante' y hay muchas opciones suaves. Te encantará la gastronomía." },
    { question: "¿Son seguros los cenotes?", answer: "Sí. Los cenotes que visitamos están preparados para turistas, con escaleras, chalecos y personal. Son experiencias mágicas." },
    { question: "¿Qué moneda usan?", answer: "El peso mexicano (MXN). Se puede pagar con tarjeta en muchos sitios y los cajeros están por todas partes." },
  ],
  vietnam: [
    { question: "¿Necesito visado para Vietnam?", answer: "Los españoles pueden entrar sin visado hasta 45 días. Más que suficiente para nuestros viajes de 14 días." },
    { question: "¿Cómo es el tráfico?", answer: "Caótico y fascinante. Miles de motos. Pero cruzar la calle se aprende el primer día: camina despacio y constante, ellos te esquivan." },
    { question: "¿Es barato Vietnam?", answer: "Muy barato. Una comida callejera increíble cuesta 1-3€, un café vietnamita 0,50€ y una cerveza local 0,60€." },
    { question: "¿Qué es el phở?", answer: "La sopa de fideos vietnamita. Se desayuna, se come y se cena. Es adictiva y la probarás en decenas de versiones." },
  ],
  zanzibar: [
    { question: "¿Necesito vacunas para Zanzíbar?", answer: "Se recomienda fiebre amarilla si vienes de un país endémico. También hepatitis A, fiebre tifoidea y profilaxis antimalárica. Consulta tu centro de vacunación." },
    { question: "¿Cómo es Stone Town?", answer: "Patrimonio de la Humanidad. Un laberinto de callejones con puertas talladas, mercados de especias y terrazas con vistas al mar. Fascinante." },
    { question: "¿Se puede nadar con delfines?", answer: "Sí, es una de las actividades más populares. Se hacen excursiones en barco por la mañana temprano y las probabilidades de verlos son muy altas." },
  ],
  colombia: [
    { question: "¿Es seguro viajar a Colombia?", answer: "Las zonas turísticas (Cartagena, Medellín, Eje Cafetero, Bogotá) son muy seguras. Colombia ha cambiado radicalmente y recibe millones de turistas al año. Con coordinador y grupo, cero preocupaciones." },
    { question: "¿Necesito visado?", answer: "No. Los ciudadanos españoles pueden entrar sin visado hasta 90 días como turistas." },
    { question: "¿Cuál es la mejor época para ir?", answer: "Diciembre-marzo y julio-agosto son las épocas secas. Pero Colombia tiene microclimas y se puede visitar todo el año." },
    { question: "¿Cómo es la gastronomía colombiana?", answer: "Variada y deliciosa. Arepas, bandeja paisa, ceviche caribeño, frutas tropicales que no conocías y el mejor café del mundo." },
  ],
  jordania: [
    { question: "¿Es seguro Jordania?", answer: "Sí. Jordania es uno de los países más estables y seguros de Oriente Medio. El turismo es una industria clave y los visitantes son muy bien recibidos." },
    { question: "¿Necesito visado?", answer: "Sí, pero se obtiene fácilmente a la llegada en el aeropuerto o con el Jordan Pass (que incluye entrada a Petra y otros sitios)." },
    { question: "¿Cuánto tiempo se necesita para ver Petra?", answer: "Mínimo un día completo, pero dos es lo ideal. El recorrido principal lleva 4-6 horas caminando. Es impresionante." },
    { question: "¿Se puede flotar en el Mar Muerto?", answer: "Sí, es una experiencia única. El agua tiene tanta sal que flotas sin esfuerzo. Incluimos esta actividad en el itinerario." },
  ],
  "sri-lanka": [
    { question: "¿Necesito visado para Sri Lanka?", answer: "Sí. Se obtiene online (ETA) antes del viaje. Es un trámite sencillo que cuesta unos 50 USD." },
    { question: "¿Se ven elefantes en libertad?", answer: "Sí. En el Parque Nacional de Yala y Udawalawe se ven elefantes, leopardos y decenas de especies en libertad." },
    { question: "¿Cómo es el tren por las montañas?", answer: "El tren de Kandy a Ella es considerado uno de los trayectos en tren más bonitos del mundo. Atraviesa plantaciones de té y montañas verdes." },
    { question: "¿Es picante la comida?", answer: "Sí, la cocina cingalesa es especiada. Pero siempre puedes pedir versiones suaves y hay opciones variadas para todos los paladares." },
  ],
  india: [
    { question: "¿Es seguro viajar a India?", answer: "Las zonas turísticas del norte (Delhi, Agra, Rajastán) son seguras, especialmente viajando en grupo con coordinador. India requiere sentido común y mente abierta." },
    { question: "¿Necesito visado?", answer: "Sí. Se obtiene online (e-Visa) antes del viaje. El trámite es sencillo y cuesta unos 25 USD." },
    { question: "¿Me pondrá enfermo la comida?", answer: "El famoso 'Delhi belly' es posible los primeros días. Nuestro coordinador te guía hacia restaurantes seguros y te damos consejos de higiene alimentaria." },
    { question: "¿Qué es el Triángulo Dorado?", answer: "La ruta Delhi-Agra-Jaipur, que concentra lo más icónico del norte de India: el Taj Mahal, los fuertes de Rajastán y la capital." },
  ],
  turquia: [
    { question: "¿Necesito visado para Turquía?", answer: "Sí. Se obtiene online (e-Visa) en minutos. Cuesta unos 50 USD para ciudadanos españoles." },
    { question: "¿Cuánto cuesta un vuelo en globo en Capadocia?", answer: "Entre 150-250€ dependiendo de la empresa y la temporada. No está incluido en el viaje pero lo organizamos para quien quiera." },
    { question: "¿Es caro Turquía?", answer: "No. Turquía ofrece precios muy asequibles. Comer bien por 5-10€, transportes baratos y alojamientos con encanto a buen precio." },
  ],
  portugal: [
    { question: "¿Necesito pasaporte?", answer: "No. Con el DNI español es suficiente para viajar a Portugal." },
    { question: "¿Es caro Portugal?", answer: "Es uno de los países más asequibles de Europa occidental. Comer bien por 8-15€, buen vino por 3-5€ y alojamiento de calidad a precios razonables." },
    { question: "¿Cuál es la mejor época?", answer: "Abril-octubre es ideal. El Algarve tiene sol casi todo el año. Lisboa y Oporto son agradables en primavera y otoño." },
  ],
  cuba: [
    { question: "¿Necesito visado para Cuba?", answer: "Sí. Los ciudadanos españoles necesitan una tarjeta de turista (visado) que se puede obtener en la embajada o en el aeropuerto. También necesitas seguro médico obligatorio." },
    { question: "¿Funcionan las tarjetas de crédito?", answer: "Muy limitadamente. Cuba es un país de efectivo. Recomendamos llevar euros y cambiar allí. Las tarjetas de bancos estadounidenses no funcionan." },
    { question: "¿Cómo es internet en Cuba?", answer: "Limitado. Hay WiFi en hoteles y zonas públicas, pero no esperes conexión constante. Es parte de la experiencia de desconexión." },
    { question: "¿Es seguro Cuba?", answer: "Muy seguro. Cuba tiene índices de criminalidad muy bajos. Es un destino tranquilo y la gente es extremadamente amable con los turistas." },
  ],
  "tanzania-safari": [
    { question: "¿Necesito vacunas?", answer: "Se recomienda fiebre amarilla (obligatoria si vienes de país endémico), hepatitis A y B, y profilaxis antimalárica. Consulta tu centro de vacunación." },
    { question: "¿Qué animales veré en el safari?", answer: "Los Big Five (león, leopardo, elefante, búfalo, rinoceronte) más jirafas, cebras, hipopótamos, ñus y cientos de especies de aves. El Serengeti y Ngorongoro son de los mejores parques del mundo." },
    { question: "¿Cuál es la mejor época para safari?", answer: "Junio-octubre (temporada seca) es ideal para avistamientos. La Gran Migración del Serengeti ocurre entre julio y octubre." },
    { question: "¿Se puede combinar con Zanzíbar?", answer: "Sí, y es lo más habitual. Safari + playa es la combinación perfecta. Ofrecemos extensiones a Zanzíbar desde el safari." },
  ],
  namibia: [
    { question: "¿Necesito visado para Namibia?", answer: "No. Los ciudadanos españoles pueden entrar sin visado hasta 90 días." },
    { question: "¿Es un destino caro?", answer: "Moderado. Los alojamientos tipo lodge son algo caros, pero el resto (comida, gasolina, actividades) es asequible. En grupo, los costes se comparten." },
    { question: "¿Hace falta 4x4?", answer: "Para llegar a muchos puntos de interés sí, pero eso está incluido en el viaje. Nuestro coordinador gestiona todo el transporte." },
    { question: "¿Cómo son las dunas de Sossusvlei?", answer: "Impresionantes. Dunas rojas de hasta 300 metros de altura. Subir la Duna 45 al amanecer es una de las experiencias más fotogénicas de África." },
  ],
  argentina: [
    { question: "¿Necesito visado?", answer: "No. Los ciudadanos españoles pueden entrar sin visado hasta 90 días como turistas." },
    { question: "¿Cuál es la mejor época para la Patagonia?", answer: "Octubre-abril (primavera-verano austral). En invierno muchos caminos están cerrados por nieve. El Perito Moreno es impresionante todo el año." },
    { question: "¿Es caro Argentina?", answer: "Actualmente es muy asequible para europeos. Comer un asado espectacular por 10-15€, vino Malbec excelente por 3-5€ y Buenos Aires tiene una oferta cultural inagotable." },
    { question: "¿Se puede ver las Cataratas de Iguazú?", answer: "Sí, es una de las experiencias más impresionantes del viaje. Las cataratas son patrimonio de la humanidad y se pueden ver desde el lado argentino y brasileño." },
  ],
}

export const tripExtras: Record<string, TripExtra> = {
  "japon-ss-2026": {
    promoPrice: 1390,
    promoLabel: "Early bird -200€",
    itinerary: [
      { day: 1, title: "Tokio", description: "Llegada a Narita, traslado al hotel y primer paseo por Shibuya. Cena de bienvenida con ramen auténtico.", lat: 35.6595, lng: 139.7004 },
      { day: 2, title: "Tokio — Asakusa y Akihabara", description: "Templo Senso-ji, barrio otaku de Akihabara y atardecer desde Skytree.", lat: 35.7148, lng: 139.7967 },
      { day: 3, title: "Tokio — Harajuku y Shinjuku", description: "Moda callejera en Harajuku, Meiji Jingu y noche en Golden Gai.", lat: 35.6702, lng: 139.7027 },
      { day: 4, title: "Monte Fuji y Kawaguchiko", description: "Excursión al lago Kawaguchi con vistas al Fuji. Onsen tradicional.", lat: 35.3606, lng: 138.7274 },
      { day: 5, title: "Hakone", description: "Valle volcánico de Owakudani, crucero por el lago Ashi y teleférico con vistas al Fuji.", lat: 35.2329, lng: 139.1070 },
      { day: 6, title: "Kioto — llegada", description: "Tren bala a Kioto. Fushimi Inari (los mil torii rojos) y barrio de Gion al atardecer.", lat: 34.9671, lng: 135.7727 },
      { day: 7, title: "Kioto — templos y bambú", description: "Bosque de bambú de Arashiyama, Kinkaku-ji (Pabellón Dorado) y ceremonia del té.", lat: 35.0094, lng: 135.6672 },
      { day: 8, title: "Nara", description: "Ciervos de Nara, Gran Buda de Todai-ji y calles tradicionales de Naramachi.", lat: 34.6851, lng: 135.8048 },
      { day: 9, title: "Osaka", description: "Castillo de Osaka, barrio de Dotonbori y la mejor street food de Japón.", lat: 34.6937, lng: 135.5023 },
      { day: 10, title: "Hiroshima y Miyajima", description: "Memorial de la Paz, torii flotante de Miyajima y okonomiyaki estilo Hiroshima.", lat: 34.3853, lng: 132.4553 },
      { day: 11, title: "Kioto — día libre", description: "Explora a tu ritmo: mercado Nishiki, barrios de geishas o excursión al Monkey Park.", lat: 35.0116, lng: 135.7681 },
      { day: 12, title: "Koyasan", description: "Cementerio budista Okunoin, templos en la montaña sagrada y alojamiento en templo.", lat: 34.2130, lng: 135.5805 },
      { day: 13, title: "Tokio — despedida", description: "Vuelta a Tokio. Teamlab Borderless, compras en Shibuya y cena de despedida.", lat: 35.6762, lng: 139.6503 },
      { day: 14, title: "Vuelta a casa", description: "Traslado al aeropuerto de Narita. Sayōnara, Japón. Hasta la próxima.", lat: 35.7720, lng: 140.3929 },
    ],
  },
  "tailandia-ss-2026": {
    itinerary: [
      { day: 1, title: "Bangkok", description: "Llegada, traslado y primer paseo por Khao San Road. Cena callejera.", lat: 13.7563, lng: 100.5018 },
      { day: 2, title: "Bangkok — templos", description: "Gran Palacio, Wat Pho (Buda reclinado) y Wat Arun al atardecer.", lat: 13.7468, lng: 100.4927 },
      { day: 3, title: "Mercado flotante y tren", description: "Damnoen Saduak, mercado del tren de Maeklong y comida callejera.", lat: 13.5244, lng: 99.9579 },
      { day: 4, title: "Vuelo a Chiang Mai", description: "Templo Doi Suthep, mercado nocturno y khao soi (curry del norte).", lat: 18.7883, lng: 98.9853 },
      { day: 5, title: "Chiang Mai — naturaleza", description: "Santuario de elefantes ético, cascadas y clase de cocina thai.", lat: 18.8400, lng: 98.9500 },
      { day: 6, title: "Chiang Rai", description: "Templo Blanco, Templo Azul y mercado de artesanía local.", lat: 19.9105, lng: 99.8406 },
      { day: 7, title: "Vuelo a Krabi", description: "Traslado y llegada a Ao Nang. Atardecer en la playa.", lat: 8.0863, lng: 98.9063 },
      { day: 8, title: "Islas Phi Phi", description: "Excursión en longtail boat, snorkel en Maya Bay y playas paradisíacas.", lat: 7.7407, lng: 98.7784 },
      { day: 9, title: "Four Islands Tour", description: "Railay Beach, cueva de Princess Lagoon y snorkel en aguas cristalinas.", lat: 8.0100, lng: 98.8373 },
      { day: 10, title: "Día libre en Krabi", description: "Relax, masaje thai, kayak o Tiger Cave Temple para los más aventureros.", lat: 8.0863, lng: 98.9063 },
      { day: 11, title: "Bangkok — último día", description: "Vuelta a Bangkok. Chatuchak Market y cena de despedida en rooftop bar.", lat: 13.7563, lng: 100.5018 },
      { day: 12, title: "Vuelta a casa", description: "Traslado al aeropuerto. Khob khun kha, Tailandia.", lat: 13.6900, lng: 100.7501 },
    ],
  },
  "marruecos-ss-2026": {
    promoPrice: 790,
    promoLabel: "-100€ early bird",
    itinerary: [
      { day: 1, title: "Marrakech", description: "Llegada, riad en la medina y primer paseo por Jemaa el-Fna.", lat: 31.6295, lng: -7.9811 },
      { day: 2, title: "Marrakech — medina", description: "Zocos, Jardín Majorelle, Bahia Palace y hammam tradicional.", lat: 31.6340, lng: -7.9813 },
      { day: 3, title: "Atlas y Ait Benhaddou", description: "Trekking suave por el Atlas, kasba de Ait Benhaddou (Juego de Tronos).", lat: 31.0470, lng: -7.1297 },
      { day: 4, title: "Ruta al desierto", description: "Garganta del Todra, Valle del Dades y paisajes de película.", lat: 31.5870, lng: -5.5632 },
      { day: 5, title: "Desierto del Sahara", description: "Camellos al atardecer, noche en jaima bereber y cena bajo las estrellas.", lat: 31.0801, lng: -4.0133 },
      { day: 6, title: "Sahara — amanecer", description: "Amanecer en las dunas de Merzouga. Ruta hacia Fez.", lat: 31.0801, lng: -4.0133 },
      { day: 7, title: "Fez", description: "Medina medieval (la más grande del mundo), curtidurías y artesanía.", lat: 34.0181, lng: -5.0078 },
      { day: 8, title: "Chefchaouen", description: "La ciudad azul. Paseo por calles de ensueño y vistas desde la montaña.", lat: 35.1688, lng: -5.2636 },
      { day: 9, title: "Vuelta a casa", description: "Traslado al aeropuerto de Tánger o Casablanca. Bslama, Marruecos.", lat: 33.5731, lng: -7.5898 },
    ],
  },
  "bali-ss-2026": {
    promoPrice: 1250,
    promoLabel: "-140€ promo",
  },
  "brasil-verano-2026": {
    promoPrice: 1150,
    promoLabel: "Verano -140€",
  },
  "laponia-navidad-2026": {
    promoPrice: 1390,
    promoLabel: "-200€ Navidad",
  },
  "maldivas-navidad-2026": {
    promoPrice: 1350,
    promoLabel: "-140€ early",
  },
}

// Coordinate lookup for itinerary locations (city/place → lat/lng)
const LOCATION_COORDS: Record<string, [number, number]> = {
  "Tokio": [35.6762, 139.6503],
  "Akihabara": [35.6984, 139.7731],
  "Monte Fuji": [35.3606, 138.7274],
  "Kioto": [35.0116, 135.7681],
  "Osaka": [34.6937, 135.5023],
  "Bangkok": [13.7563, 100.5018],
  "Chiang Mai": [18.7883, 98.9853],
  "Phi Phi": [7.7407, 98.7784],
  "Marrakech": [31.6295, -7.9811],
  "Sahara": [31.0801, -4.0133],
  "Fez": [34.0181, -5.0078],
  "Rio de Janeiro": [-22.9068, -43.1729],
  "Favela y Samba": [-22.9500, -43.1900],
  "Florianópolis": [-27.5954, -48.5480],
  "Rovaniemi": [66.5039, 25.7294],
  "Huskies": [66.5200, 25.8000],
  "Auroras": [66.5500, 25.7500],
  "Malé": [4.1755, 73.5093],
  "Snorkel": [4.2000, 73.5500],
  "Isla desierta": [4.1000, 73.4500],
  "Stone Town": [-6.1622, 39.1921],
  "Especias": [-6.1200, 39.2200],
  "Nungwi": [-5.7269, 39.2986],
  "Mnemba": [-5.8167, 39.3833],
  "Reikiavik": [64.1466, -21.9426],
  "Círculo Dorado": [64.3143, -20.2986],
  "Sur de Islandia": [63.5321, -19.5115],
  "Sur": [63.5321, -19.5115],
  "Lima": [-12.0464, -77.0428],
  "Cusco": [-13.5319, -71.9675],
  "Machu Picchu": [-13.1631, -72.5450],
  "Ubud": [-8.5069, 115.2625],
  "Monte Batur": [-8.2415, 115.3752],
  "Nusa Penida": [-8.7275, 115.5444],
  "Uluwatu": [-8.8291, 115.0849],
  "Gili Islands": [-8.3500, 116.0500],
  "San José": [9.9281, -84.0907],
  "Arenal": [10.4626, -84.7033],
  "Manuel Antonio": [9.3923, -84.1365],
  "Caribe": [9.7489, -82.8497],
  "El Cairo": [30.0444, 31.2357],
  "Luxor": [25.6872, 32.6396],
  "Nilo": [25.0000, 32.8998],
  "Asuán": [24.0889, 32.8998],
  "Atenas": [37.9838, 23.7275],
  "Santorini": [36.3932, 25.4615],
  "Mykonos": [37.4467, 25.3289],
  "Naxos": [37.1036, 25.3762],
  "CDMX": [19.4326, -99.1332],
  "Oaxaca": [17.0732, -96.7266],
  "Tulum": [20.2115, -87.4654],
  "Hanoi": [21.0285, 105.8542],
  "Ha Long": [20.9101, 107.1839],
  "Hoi An": [15.8801, 108.3380],
  "Sapa": [22.3363, 103.8438],
  "Ho Chi Minh": [10.8231, 106.6297],
  "Norte": [18.7883, 98.9853],
  "Islas": [36.3932, 25.4615],
  "Krabi": [8.0863, 98.9063],
  "Atlas": [31.0470, -7.1297],
  "Desierto": [31.0801, -4.0133],
  "Ouarzazate": [30.9189, -6.8936],
  "Chefchaouen": [35.1688, -5.2636],
  "Moto de nieve": [66.5500, 25.9000],
  "Pirámides de Giza": [29.9792, 31.1342],
}

export function lookupCoords(title: string): [number, number] | null {
  const key = Object.keys(LOCATION_COORDS).find(
    (k) => title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(title.toLowerCase())
  )
  return key ? LOCATION_COORDS[key] : null
}

export function getDestinationPhotos(destinationId: string): string[] {
  return destinationPhotos[destinationId] || photos(destinationId)
}

export function getDestinationFaqs(destinationId: string): DestinationFAQ[] {
  return destinationFaqs[destinationId] || []
}

export function getTripExtra(tripId: string): TripExtra {
  return tripExtras[tripId] || {}
}
