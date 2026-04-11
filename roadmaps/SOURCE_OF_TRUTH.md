# Travelhood — Source of Truth

> Documento generado el 21/03/2026. Refleja el estado exacto de `travel-data.ts`, `comparisons.ts` y `blog-data.ts` tras la limpieza total de datos legacy.

## Resumen

| Tipo | Cantidad |
|---|---|
| Continentes | 6 |
| Países | 15 |
| Destinos | 19 (18 activos + 1 placeholder) |
| Viajes (trips) | 72 |
| Coordinadores | 2 |
| Testimonios | 6 |
| Comparaciones | 12 |
| Blog posts | 0 |

---

## 1. Continentes

| ID | Nombre | Slug |
|---|---|---|
| europe | Europa | europa |
| asia | Asia | asia |
| africa | África | africa |
| south-america | Sudamérica | sudamerica |
| central-america | Centroamérica | centroamerica |
| oceania | Oceanía | oceania |

---

## 2. Países

| ID | Nombre | Bandera | Continente | Moneda | Idioma | Zona horaria | Visa | Info visa | Vacunas |
|---|---|---|---|---|---|---|---|---|---|
| br | Brasil | 🇧🇷 | south-america | Real brasileño (BRL) — 1€ ≈ 5,5 BRL | Portugués | GMT-3 (4h menos) | No | Hasta 90 días sin visa (UE) | Fiebre amarilla y hepatitis A/B |
| co | Colombia | 🇨🇴 | south-america | Peso colombiano (COP) — 1€ ≈ 4.500 COP | Español | GMT-5 (6h menos) | No | Hasta 90 días sin visa (UE) | Fiebre amarilla recomendada en zonas de selva |
| fi | Finlandia | 🇫🇮 | europe | Euro (EUR) — 1€ = 1€ | Finés, sueco | GMT+2 (1h más) | No | Schengen, DNI o pasaporte | — |
| mv | Maldivas | 🇲🇻 | asia | Rufiyaa maldiva (MVR) — 1€ ≈ 16,5 MVR | Dhivehi, inglés | GMT+5 (4h más) | No | Visa on arrival gratuita 30 días | Hepatitis A y B |
| tz | Tanzania | 🇹🇿 | africa | Chelín tanzano (TZS) — 1€ ≈ 2.700 TZS | Suajili, inglés | GMT+3 (2h más) | Sí | E-visa ~50 USD | Fiebre amarilla, antimalárica |
| th | Tailandia | 🇹🇭 | asia | Baht (THB) — 1€ ≈ 37 THB | Tailandés | GMT+7 (6h más) | No | Hasta 30 días sin visa | — |
| is | Islandia | 🇮🇸 | europe | Corona islandesa (ISK) — 1€ ≈ 150 ISK | Islandés, inglés | GMT+0 (1h menos) | No | Schengen, DNI o pasaporte | — |
| id | Indonesia | 🇮🇩 | asia | Rupia indonesia (IDR) — 1€ ≈ 17.000 IDR | Bahasa Indonesia | GMT+8 (7h más) | Sí | VOA 30 días ~35 USD | Hepatitis A y B |
| eg | Egipto | 🇪🇬 | africa | Libra egipcia (EGP) — 1€ ≈ 52 EGP | Árabe | GMT+2 (1h más) | Sí | ~25 USD on arrival o e-visa | — |
| lk | Sri Lanka | 🇱🇰 | asia | Rupia (LKR) — 1€ ≈ 320 LKR | Cingalés, tamil, inglés | GMT+5:30 (4,5h más) | Sí | ETA online ~35 USD | Hepatitis A y B |
| pt | Portugal | 🇵🇹 | europe | Euro (EUR) — 1€ = 1€ | Portugués | GMT+0 (1h menos) | No | Schengen, DNI o pasaporte | — |
| no | Noruega | 🇳🇴 | europe | Corona noruega (NOK) — 1€ ≈ 11,5 NOK | Noruego, inglés | GMT+1 (misma hora) | No | Schengen, DNI o pasaporte | — |
| es | España | 🇪🇸 | europe | Euro (EUR) — 1€ = 1€ | Español | GMT+1 | No | Sin documentación especial | — |
| ph | Filipinas | 🇵🇭 | asia | Peso filipino (PHP) — 1€ ≈ 61 PHP | Filipino, inglés | GMT+8 (7h más) | No | Hasta 30 días sin visado | Hepatitis A y B |
| pr | Puerto Rico | 🇵🇷 | central-america | Dólar (USD) — 1€ ≈ 1,08 USD | Español, inglés | GMT-4 (5h menos) | Sí | ESTA obligatorio (14 USD) | — |

---

## 3. Destinos

### 3.1 Brasil
- **ID:** `brasil` — **País:** Brasil (br) — **Continente:** Sudamérica
- **Slug:** `/destino/brasil/`
- **Descripción corta:** Playas, ritmo y energía pura. Desde Rio hasta las mejores playas del norte.
- **Categorías:** playa, aventura, naturaleza
- **Coordenadas:** -22.9068, -43.1729
- **Presupuesto diario:** 20-35€/día (250-400€ total, 11 días)
- **Highlights:** Angra dos Reis, Rio de Janeiro, Arraial do Cabo, Búzios
- **Ideal para:** Amantes de la playa, la fiesta y la naturaleza salvaje
- **Clima:** Tropical, 25-35°C
- **Extra incluido:** Entradas a parques nacionales y propinas, Actividades y excursiones (quads, snorkel)
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (11 días) — **FAQs:** ✅ — **Galería:** ✅
- **Trips:** 4 (agosto, noviembre x2, diciembre)

### 3.2 Laponia
- **ID:** `laponia` — **País:** Finlandia (fi) — **Continente:** Europa
- **Slug:** `/destino/laponia/`
- **Descripción corta:** Auroras boreales, huskies y magia bajo la nieve ártica.
- **Categorías:** nieve, aventura, naturaleza
- **Coordenadas:** 66.5039, 25.7294
- **Presupuesto diario:** 30-50€/día (180-300€ total, 5 días)
- **Highlights:** Auroras boreales, Trineo con huskies, Moto de nieve, Sauna finlandesa
- **Ideal para:** Soñadores de invierno y amantes de las auroras
- **Clima:** Subártico, -10 a -25°C en invierno
- **Extra incluido:** Seguro de viaje, Paseo en trineo con huskies, Paseo en moto de nieve, Esquí/Snowboard con forfait y equipo, Entrada a sauna con lago congelado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (5 días) — **FAQs:** ✅
- **Trips:** 2 (noviembre, diciembre) — ⚠️ Precio pendiente (0€)

### 3.3 Maldivas
- **ID:** `maldivas` — **País:** Maldivas (mv) — **Continente:** Asia
- **Slug:** `/destino/maldivas/`
- **Descripción corta:** Paraíso cristalino, bungalows y snorkel con mantas raya.
- **Categorías:** playa, naturaleza
- **Coordenadas:** 3.9417, 73.5331
- **Presupuesto diario:** 25-40€/día (200-320€ total, 7 días)
- **Highlights:** Atolones, Snorkel con mantas, Banco de arena, Bioluminiscencia
- **Ideal para:** Amantes del mar, el snorkel y el relax total
- **Clima:** Tropical, 27-31°C todo el año
- **Extra incluido:** 2 excursiones de snorkel con comida, Island Hopping con comida, Equipo completo de snorkel, Vídeos y fotos underwater, Guías locales y guía español
- **Extra no incluido:** Visado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (7 días) — **FAQs:** ✅
- **Trips:** 5 (julio, agosto, septiembre, oct-nov, diciembre) — Precio: 950€

### 3.4 Zanzíbar
- **ID:** `zanzibar` — **País:** Tanzania (tz) — **Continente:** África
- **Slug:** `/destino/zanzibar/`
- **Descripción corta:** La isla de las especias: playas blancas, cultura y aventura africana.
- **Categorías:** playa, naturaleza, aventura, cultural
- **Coordenadas:** -5.7264, 39.2983
- **Presupuesto diario:** 15-25€/día (120-200€ total, 8 días)
- **Highlights:** Nungwi, Mnemba Island, Stone Town, Bahía de Menai
- **Ideal para:** Aventureros que buscan destinos menos masificados
- **Clima:** Tropical, 25-33°C
- **Extra incluido:** 2 excursiones de snorkel con equipamiento y comida, Visita a Mnemba y Prison Island, Entrada a centro de conservación de tortugas, Cena de bienvenida y despedida, Guía local
- **Extra no incluido:** Visado, Safari en Mikumi (opcional)
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (8 días) — **FAQs:** ✅
- **Trips:** 1 (nov-dic) — Precio: 1.300€

### 3.5 Islandia
- **ID:** `islandia` — **País:** Islandia (is) — **Continente:** Europa
- **Slug:** `/destino/islandia/`
- **Descripción corta:** Cascadas, glaciares y aguas termales. Naturaleza extrema en Europa.
- **Categorías:** naturaleza, aventura, nieve
- **Coordenadas:** 64.1466, -21.9426
- **Presupuesto diario:** 40-60€/día (320-480€ total, 8 días)
- **Highlights:** Círculo Dorado, Diamond Beach, Glaciar Jökulsárlón, Skógafoss y Seljalandsfoss
- **Ideal para:** Amantes de la naturaleza salvaje y los paisajes dramáticos
- **Clima:** Subártico, 0-15°C
- **Extra incluido:** Chófer durante todo el recorrido, Gasolina y parking, Entradas a termas
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (8 días) — **FAQs:** ✅
- **Trips:** 4 (sep-oct, octubre x3) — Precio: 1.250€

### 3.6 Egipto
- **ID:** `egipto` — **País:** Egipto (eg) — **Continente:** África
- **Slug:** `/destino/egipto/`
- **Descripción corta:** Pirámides, el Nilo y 5.000 años de historia en un solo viaje.
- **Categorías:** cultural, aventura
- **Coordenadas:** 30.0444, 31.2357
- **Presupuesto diario:** 15-25€/día (120-200€ total, 8 días)
- **Highlights:** Pirámides de Giza, Valle de los Reyes, Luxor, Mar Rojo
- **Ideal para:** Apasionados de la historia y las civilizaciones antiguas
- **Clima:** Desértico, 20-40°C
- **Extra incluido:** Vuelo interno El Cairo–Luxor o tren nocturno, Guía local en español, 4x4 y quads en el desierto, Snorkel en el Mar Rojo con almuerzo, Paseo por el Nilo con cena y espectáculo
- **Extra no incluido:** Visado, Propinas, Entradas a monumentos, Vuelo en Globo (opcional)
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (8 días) — **FAQs:** ✅
- **Trips:** 7 (abril, mayo x2, julio x2, noviembre x2) — Precio: 950€

### 3.7 Lofoten
- **ID:** `lofoten` — **País:** Noruega (no) — **Continente:** Europa
- **Slug:** `/destino/lofoten/`
- **Descripción corta:** Fiordos, playas árticas y pueblos de postal en el norte de Noruega.
- **Categorías:** naturaleza, aventura, playa, cultural
- **Coordenadas:** 68.2342, 14.5684
- **Presupuesto diario:** 30-50€/día (270-450€ total, 9 días)
- **Highlights:** Reinebringen, Reine, Henningsvær, Museo Vikingo
- **Ideal para:** Amantes de la naturaleza, el trekking y los paisajes épicos
- **Clima:** Subártico oceánico, 8-15°C en verano
- **Extra incluido:** Traslados incluido ferry y gasolina, Entrada al museo Vikingo, Actividades (termas/sauna, kayaks), Itinerarios de trekking completos
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (9 días) — **FAQs:** ✅
- **Trips:** 2 (junio, julio) — Precio: 1.250€

### 3.8 Azores
- **ID:** `azores` — **País:** Portugal (pt) — **Continente:** Europa
- **Slug:** `/destino/azores/`
- **Descripción corta:** Lagos volcánicos, termas naturales y cascadas en el Atlántico.
- **Categorías:** naturaleza, aventura, playa
- **Coordenadas:** 37.7483, -25.6666
- **Presupuesto diario:** 20-35€/día (160-280€ total, 7 días)
- **Highlights:** Sete Cidades, Termas de Furnas, Lagoa do Fogo, Piscinas naturales
- **Ideal para:** Amantes de la naturaleza y los paisajes volcánicos
- **Clima:** Oceánico templado, 16-25°C
- **Extra incluido:** Alojamiento en casa exclusiva con piscina, Actividades y excursiones naturales y culturales cada día
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (7 días) — **FAQs:** ✅
- **Trips:** 1 (jun-jul) — Precio: 900€

### 3.9 Camino de Santiago (placeholder)
- **ID:** `camino-de-santiago` — **País:** España (es) — **Continente:** Europa
- **Slug:** `/destino/camino-de-santiago/`
- **Descripción corta:** Próximamente
- **Categorías:** aventura, cultural, naturaleza
- **Coordenadas:** 42.8782, -8.5448
- **Estado:** ⚠️ Placeholder — sin itinerario, sin FAQs, sin SEO, sin clima
- **Trips:** 0

### 3.10 Indonesia
- **ID:** `indonesia` — **País:** Indonesia (id) — **Continente:** Asia
- **Slug:** `/destino/indonesia/`
- **Descripción corta:** Templos, volcanes, surf y playas de ensueño en el corazón de Asia.
- **Categorías:** playa, cultural, naturaleza, aventura
- **Coordenadas:** -8.5069, 115.2625
- **Presupuesto diario:** 15-25€/día (240-400€ total, 14 días)
- **Highlights:** Templos de Ubud, Monte Batur, Nusa Penida, Komodo, Gili Islands
- **Ideal para:** Viajeros que buscan variedad total: templos, volcanes, surf y playas
- **Clima:** Tropical, 27-30°C
- **Extra incluido:** Traslados internos (fast boat, transporte entre islas, chófer local), Clases y experiencias (surf, yoga, snorkel), Entradas a templos y parques nacionales, Guías locales
- **Extra no incluido:** Traslados opcionales (motos, taxis)
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (14 días) — **FAQs:** ✅
- **Trips:** 12 (mayo x2, junio x2, julio x2, agosto x2, septiembre x2, octubre x2) — Precio: 1.250€

### 3.11 Tailandia — Verano
- **ID:** `tailandia-verano` — **País:** Tailandia (th) — **Continente:** Asia
- **Slug:** `/destino/tailandia-verano/`
- **Descripción corta:** Bangkok, Chiang Mai, Koh Samui y Koh Tao en la edición veraniega.
- **Categorías:** playa, cultural, aventura
- **Coordenadas:** 13.7563, 100.5018
- **Presupuesto diario:** 15-25€/día (240-400€ total, 14 días)
- **Highlights:** Bangkok, Chiang Mai, Koh Samui, Koh Tao, Ang Thong
- **Ideal para:** Viajeros que buscan la mezcla perfecta de cultura, playa y gastronomía en la época cálida
- **Clima:** Tropical, 28-35°C
- **Extra incluido:** Ferrys entre islas, Vuelos internos, Excursión a santuario de elefantes + trekking + rafting, Entrada al Parque Nacional Ang Thong con almuerzo, Visita a templos en Chiang Mai, Cena BBQ en Koh Tao, Excursión a Koh Nang Yuan
- **Extra no incluido:** Transportes no principales (taxis, tuk tuks, Grab), Transporte a Ayutthaya, Entradas a templos (Ayutthaya y Bangkok)
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (14 días) — **FAQs:** ✅
- **Trips:** 5 (julio x2, agosto x2, septiembre) — Precio: 1.300€

### 3.12 Tailandia — Invierno
- **ID:** `tailandia-invierno` — **País:** Tailandia (th) — **Continente:** Asia
- **Slug:** `/destino/tailandia-invierno/`
- **Descripción corta:** Bangkok, Chiang Mai, Krabi y Phi Phi en la edición invernal.
- **Categorías:** playa, cultural, aventura
- **Coordenadas:** 13.7563, 100.5018
- **Presupuesto diario:** 15-25€/día (210-350€ total, 13 días)
- **Highlights:** Bangkok, Chiang Mai, Krabi, Phi Phi, Hong Island
- **Ideal para:** Viajeros que buscan la mezcla perfecta de cultura, playa y gastronomía en temporada seca
- **Clima:** Tropical, 28-35°C
- **Extra incluido:** Traslados principales y ferrys, Vuelos internos, Tren nocturno Bangkok→Chiang Mai, Templos de Chiang Mai, Santuario de elefantes + trekking + rafting + almuerzo, Tour Hong Island en lancha + almuerzo, Tour Phi Phi en barca + almuerzo + snorkel
- **Extra no incluido:** Tuk tuk y grabs, Templos de Ayutthaya y Bangkok
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (13 días) — **FAQs:** ✅
- **Trips:** 3 (abril, noviembre, diciembre) — Precio: 1.300€

### 3.13 Filipinas — Verano
- **ID:** `filipinas-verano` — **País:** Filipinas (ph) — **Continente:** Asia
- **Slug:** `/destino/filipinas-verano/`
- **Descripción corta:** Siargao, Camiguin y Bohol: la Filipinas más salvaje y auténtica.
- **Categorías:** playa, naturaleza, aventura
- **Coordenadas:** 14.5995, 120.9842
- **Presupuesto diario:** 15-25€/día (210-350€ total, 13 días)
- **Highlights:** Siargao, Camiguin, Bohol, Anda, Cloud 9
- **Ideal para:** Viajeros que buscan playas paradisíacas y experiencias auténticas fuera de ruta
- **Clima:** Tropical, 28-33°C
- **Extra incluido:** Vuelos internos y ferry, Island Hopping tours con comida, Tours de un día (Camiguin, Bohol, Anda), Guías locales y guía español
- **Extra no incluido:** Visado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (13 días) — **FAQs:** ✅
- **Trips:** 4 (julio x2, agosto x2) — Precio: 1.350€

### 3.14 Filipinas — Invierno
- **ID:** `filipinas-invierno` — **País:** Filipinas (ph) — **Continente:** Asia
- **Slug:** `/destino/filipinas-invierno/`
- **Descripción corta:** El Nido, Coron y Palawan: las islas más bonitas del mundo.
- **Categorías:** playa, naturaleza, aventura
- **Coordenadas:** 14.5995, 120.9842
- **Presupuesto diario:** 15-25€/día (210-350€ total, 13 días)
- **Highlights:** El Nido, Coron, Port Barton, Bohol, Puerto Princesa
- **Ideal para:** Viajeros que buscan las islas más espectaculares de Asia en la mejor temporada
- **Clima:** Tropical, 28-33°C
- **Extra incluido:** Comidas indicadas, Tours en privado (Bohol, Port Barton, El Nido, Coron), Guía de habla hispana/inglesa, Tasas de puertos y aeropuertos
- **Extra no incluido:** Gastos derivados de problemas externos
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (13 días) — **FAQs:** ✅
- **Trips:** 1 (noviembre) — Precio: 1.350€

### 3.15 Puerto Rico
- **ID:** `puerto-rico` — **País:** Puerto Rico (pr) — **Continente:** Centroamérica
- **Slug:** `/destino/puerto-rico/`
- **Descripción corta:** Playas vírgenes, salsa, cultura y cascadas en el Caribe latino.
- **Categorías:** playa, cultural, aventura, naturaleza
- **Coordenadas:** 18.4655, -66.1057
- **Presupuesto diario:** 25-40€/día (200-320€ total, 8 días)
- **Highlights:** Viejo San Juan, El Yunque, Vieques, Fajardo, Cueva Ventana
- **Ideal para:** Viajeros que buscan Caribe auténtico con cultura latina y naturaleza
- **Clima:** Tropical, 27-32°C todo el año
- **Extra incluido:** Ferry a Vieques, Guías locales en español, Entradas a lugares de interés
- **Extra no incluido:** Visado (ESTA), Desayunos
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (8 días) — **FAQs:** ✅
- **Trips:** 3 (abr-may, ago-sep, septiembre) — Precio: 1.150€

### 3.16 Sri Lanka — Verano
- **ID:** `sri-lanka-verano` — **País:** Sri Lanka (lk) — **Continente:** Asia
- **Slug:** `/destino/sri-lanka-verano/`
- **Descripción corta:** Safari, tren panorámico y playas de Trincomalee en la edición verano.
- **Categorías:** aventura, naturaleza, cultural, playa
- **Coordenadas:** 7.8731, 80.7718
- **Presupuesto diario:** 12-20€/día (120-200€ total, 9 días)
- **Highlights:** Sigiriya, Ella (tren), Trincomalee, Yala Safari, Kandy
- **Ideal para:** Viajeros que quieren variedad total: cultura, naturaleza, playa y fauna
- **Clima:** Tropical, 25-32°C
- **Extra incluido:** Entradas a templos, Clases de surf, 2 safaris, Snorkel
- **Extra no incluido:** Visado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (9 días) — **FAQs:** ✅
- **Trips:** 7 (junio x2, julio x2, agosto x3) — Precio: 1.050€

### 3.17 Sri Lanka — Otoño
- **ID:** `sri-lanka-otono` — **País:** Sri Lanka (lk) — **Continente:** Asia
- **Slug:** `/destino/sri-lanka-otono/`
- **Descripción corta:** Safari, tren panorámico y playas del sur en la edición otoño.
- **Categorías:** aventura, naturaleza, cultural, playa
- **Coordenadas:** 7.8731, 80.7718
- **Presupuesto diario:** 12-20€/día (140-230€ total, 11 días)
- **Highlights:** Sigiriya, Ella, Yala, Mirissa, Galle, Kandy
- **Ideal para:** Viajeros que quieren Sri Lanka con el equilibrio perfecto de clima y menos turistas
- **Clima:** Tropical, 25-32°C
- **Extra incluido:** Entradas a templos, Clases de surf, 2 safaris, Snorkel
- **Extra no incluido:** Visado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (11 días) — **FAQs:** ✅
- **Trips:** 4 (septiembre x2, octubre x2) — Precio: 1.050€

### 3.18 Sri Lanka — Invierno
- **ID:** `sri-lanka-invierno` — **País:** Sri Lanka (lk) — **Continente:** Asia
- **Slug:** `/destino/sri-lanka-invierno/`
- **Descripción corta:** Safari, tren panorámico y la costa sur en temporada seca.
- **Categorías:** aventura, naturaleza, cultural, playa
- **Coordenadas:** 7.8731, 80.7718
- **Presupuesto diario:** 12-20€/día (140-230€ total, 11 días)
- **Highlights:** Sigiriya, Ella, Yala, Mirissa, Galle, Kandy
- **Ideal para:** Viajeros que quieren disfrutar Sri Lanka en la mejor temporada con clima seco
- **Clima:** Tropical, 25-32°C
- **Extra incluido:** Entradas a templos, Clases de surf, 2 safaris, Snorkel
- **Extra no incluido:** Visado
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (11 días) — **FAQs:** ✅
- **Trips:** 2 (noviembre x2) — Precio: 1.050€

### 3.19 Colombia
- **ID:** `colombia` — **País:** Colombia (co) — **Continente:** Sudamérica
- **Slug:** `/destino/colombia/`
- **Descripción corta:** Medellín, café, Caribe y aventura. Colombia en estado puro.
- **Categorías:** aventura, cultural, naturaleza, playa
- **Coordenadas:** 6.2442, -75.5812
- **Presupuesto diario:** 20-35€/día (220-385€ total, 11 días)
- **Highlights:** Medellín y Comuna 13, Valle del Cocora, Eje Cafetero, Islas del Rosario
- **Ideal para:** Viajeros que buscan variedad total: ciudad, naturaleza, café y playa caribeña
- **Clima:** Tropical variado, 20-32°C según región
- **Extra incluido:** Vuelos internos, Traslados principales en furgoneta privada
- **Extra no incluido:** Seguro médico de viaje, Uber/taxi para desplazarte fuera del itinerario
- **SEO:** ✅ — **Clima mensual:** ✅ — **Itinerario:** ✅ (11 días) — **FAQs:** ✅
- **Trips:** 5 (julio x2, agosto x2, septiembre) — Precio: 1.350€

---

## 4. Calendario completo de viajes (72 trips)

### Semana Santa (abril 2026)
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| egipto-2026-04-05 | Egipto | 05/04 → 12/04 | 8 | 950€ | 300€ | 15 (4 left) | almost-full | Marta |
| tailandia-invierno-2026-04-16 | Tailandia Invierno | 16/04 → 28/04 | 13 | 1.300€ | 650€ | 15 (4 left) | almost-full | Carlos |

### Puente de Mayo (abril-mayo 2026)
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| puerto-rico-2026-04-29 | Puerto Rico | 29/04 → 05/05 | 8 | 1.150€ | 700€ | 15 (3 left) | almost-full | Marta |
| indonesia-2026-05-01 | Indonesia | 01/05 → 15/05 | 14 | 1.250€ | 750€ | 15 (2 left) | almost-full | Marta |
| indonesia-2026-05-16 | Indonesia (2) | 16/05 → 30/05 | 14 | 1.250€ | 750€ | 15 (4 left) | almost-full | Carlos |
| egipto-2026-05-15 | Egipto | 15/05 → 22/05 | 8 | 950€ | 300€ | 15 (15 left) | open | Carlos |
| egipto-2026-05-23 | Egipto (2) | 23/05 → 30/05 | 8 | 950€ | 300€ | 15 (15 left) | open | Marta |

### Verano (junio-agosto 2026)
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| indonesia-2026-06-01 | Indonesia | 01/06 → 15/06 | 14 | 1.250€ | 750€ | 15 (3 left) | almost-full | Marta |
| sri-lanka-verano-2026-06-12 | Sri Lanka Verano | 12/06 → 20/06 | 9 | 1.050€ | 700€ | 15 (4 left) | almost-full | Marta |
| indonesia-2026-06-16 | Indonesia (2) | 16/06 → 30/06 | 14 | 1.250€ | 750€ | 15 (3 left) | almost-full | Carlos |
| lofoten-2026-06-22 | Lofoten | 22/06 → 30/06 | 9 | 1.250€ | 350€ | 15 (15 left) | open | Marta |
| sri-lanka-verano-2026-06-22 | Sri Lanka Verano (2) | 22/06 → 30/06 | 9 | 1.050€ | 700€ | 15 (4 left) | almost-full | Carlos |
| azores-2026-06-29 | Azores | 29/06 → 06/07 | 7 | 900€ | 200€ | 15 (3 left) | almost-full | Marta |
| indonesia-2026-07-01 | Indonesia | 01/07 → 15/07 | 14 | 1.250€ | 750€ | 15 (7 left) | open | Marta |
| filipinas-verano-2026-07-01 | Filipinas Verano | 01/07 → 13/07 | 13 | 1.350€ | 750€ | 15 (5 left) | open | Carlos |
| tailandia-verano-2026-07-01 | Tailandia Verano | 01/07 → 14/07 | 14 | 1.300€ | 650€ | 15 (5 left) | open | Marta |
| lofoten-2026-07-02 | Lofoten (2) | 02/07 → 10/07 | 9 | 1.250€ | 350€ | 15 (15 left) | open | Carlos |
| colombia-2026-07-03 | Colombia | 03/07 → 13/07 | 11 | 1.350€ | 650€ | 15 (15 left) | open | Carlos |
| egipto-2026-07-07 | Egipto | 07/07 → 14/07 | 8 | 950€ | 300€ | 15 (15 left) | open | Carlos |
| sri-lanka-verano-2026-07-12 | Sri Lanka Verano | 12/07 → 20/07 | 9 | 1.050€ | 700€ | 15 (5 left) | open | Marta |
| egipto-2026-07-15 | Egipto (2) | 15/07 → 22/07 | 8 | 950€ | 300€ | 15 (15 left) | open | Marta |
| maldivas-2026-07-16 | Maldivas | 16/07 → 23/07 | 7 | 950€ | 850€ | 15 (4 left) | almost-full | Marta |
| tailandia-verano-2026-07-16 | Tailandia Verano (2) | 16/07 → 29/07 | 14 | 1.300€ | 650€ | 15 (3 left) | almost-full | Carlos |
| indonesia-2026-07-16 | Indonesia (2) | 16/07 → 30/07 | 14 | 1.250€ | 750€ | 15 (4 left) | almost-full | Carlos |
| colombia-2026-07-17 | Colombia (2) | 17/07 → 27/07 | 11 | 1.350€ | 650€ | 15 (15 left) | open | Carlos |
| filipinas-verano-2026-07-17 | Filipinas Verano (2) | 17/07 → 29/07 | 13 | 1.350€ | 750€ | 15 (6 left) | open | Marta |
| sri-lanka-verano-2026-07-22 | Sri Lanka Verano (2) | 22/07 → 30/07 | 9 | 1.050€ | 700€ | 15 (15 left) | open | Carlos |
| tailandia-verano-2026-08-01 | Tailandia Verano | 01/08 → 14/08 | 14 | 1.300€ | 650€ | 15 (4 left) | almost-full | Marta |
| indonesia-2026-08-01 | Indonesia | 01/08 → 15/08 | 14 | 1.250€ | 750€ | 15 (4 left) | almost-full | Marta |
| filipinas-verano-2026-08-01 | Filipinas Verano | 01/08 → 13/08 | 13 | 1.350€ | 750€ | 15 (15 left) | open | Carlos |
| sri-lanka-verano-2026-08-01 | Sri Lanka Verano | 01/08 → 09/08 | 9 | 1.050€ | 700€ | 15 (15 left) | open | Marta |
| colombia-2026-08-03 | Colombia | 03/08 → 13/08 | 11 | 1.350€ | 650€ | 15 (15 left) | open | Carlos |
| sri-lanka-verano-2026-08-12 | Sri Lanka Verano (2) | 12/08 → 20/08 | 9 | 1.050€ | 700€ | 15 (4 left) | almost-full | Carlos |
| tailandia-verano-2026-08-16 | Tailandia Verano (2) | 16/08 → 29/08 | 14 | 1.300€ | 650€ | 15 (15 left) | open | Carlos |
| indonesia-2026-08-16 | Indonesia (2) | 16/08 → 30/08 | 14 | 1.250€ | 750€ | 15 (3 left) | almost-full | Carlos |
| colombia-2026-08-17 | Colombia (2) | 17/08 → 27/08 | 11 | 1.350€ | 650€ | 15 (15 left) | open | Carlos |
| filipinas-verano-2026-08-17 | Filipinas Verano (2) | 17/08 → 29/08 | 13 | 1.350€ | 750€ | 15 (15 left) | open | Marta |
| brasil-2026-08-18 | Brasil | 18/08 → 28/08 | 11 | 1.250€ | 750€ | 15 (3 left) | almost-full | Marta |
| maldivas-2026-08-19 | Maldivas | 19/08 → 26/08 | 7 | 950€ | 850€ | 15 (15 left) | open | Carlos |
| sri-lanka-verano-2026-08-22 | Sri Lanka Verano (3) | 22/08 → 30/08 | 9 | 1.050€ | 700€ | 15 (15 left) | open | Marta |
| puerto-rico-2026-08-27 | Puerto Rico | 27/08 → 02/09 | 8 | 1.150€ | 700€ | 15 (15 left) | open | Carlos |

### Septiembre 2026
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| tailandia-verano-2026-09-01 | Tailandia Verano | 01/09 → 14/09 | 14 | 1.300€ | 650€ | 15 (15 left) | open | Marta |
| indonesia-2026-09-01 | Indonesia | 01/09 → 15/09 | 14 | 1.250€ | 750€ | 15 (5 left) | open | Marta |
| puerto-rico-2026-09-02 | Puerto Rico | 02/09 → 08/09 | 8 | 1.150€ | 700€ | 15 (15 left) | open | Marta |
| colombia-2026-09-02 | Colombia | 02/09 → 12/09 | 11 | 1.350€ | 650€ | 15 (15 left) | open | Carlos |
| sri-lanka-otono-2026-09-03 | Sri Lanka Otoño | 03/09 → 13/09 | 11 | 1.050€ | 700€ | 15 (15 left) | open | Carlos |
| indonesia-2026-09-16 | Indonesia (2) | 16/09 → 30/09 | 14 | 1.250€ | 750€ | 15 (7 left) | open | Carlos |
| sri-lanka-otono-2026-09-16 | Sri Lanka Otoño (2) | 16/09 → 26/09 | 11 | 1.050€ | 700€ | 15 (15 left) | open | Marta |
| maldivas-2026-09-20 | Maldivas | 20/09 → 27/09 | 7 | 950€ | 850€ | 15 (15 left) | open | Marta |
| islandia-2026-09-28 | Islandia | 28/09 → 05/10 | 8 | 1.250€ | 280€ | 15 (4 left) | almost-full | Marta |

### Puente de Octubre 2026
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| sri-lanka-otono-2026-10-01 | Sri Lanka Otoño | 01/10 → 11/10 | 11 | 1.050€ | 700€ | 15 (15 left) | open | Carlos |
| indonesia-2026-10-01 | Indonesia | 01/10 → 15/10 | 14 | 1.250€ | 750€ | 15 (6 left) | open | Marta |
| islandia-2026-10-05 | Islandia | 05/10 → 12/10 | 8 | 1.250€ | 280€ | 15 (5 left) | open | Carlos |
| islandia-2026-10-12 | Islandia (2) | 12/10 → 19/10 | 8 | 1.250€ | 280€ | 15 (15 left) | open | Marta |
| sri-lanka-otono-2026-10-16 | Sri Lanka Otoño (2) | 16/10 → 26/10 | 11 | 1.050€ | 700€ | 15 (4 left) | almost-full | Marta |
| indonesia-2026-10-16 | Indonesia (2) | 16/10 → 30/10 | 14 | 1.250€ | 750€ | 15 (6 left) | open | Carlos |
| islandia-2026-10-19 | Islandia (3) | 19/10 → 26/10 | 8 | 1.250€ | 280€ | 15 (15 left) | open | Carlos |

### Puente de Noviembre 2026
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| maldivas-2026-10-31 | Maldivas | 31/10 → 07/11 | 7 | 950€ | 850€ | 15 (15 left) | open | Carlos |
| sri-lanka-invierno-2026-11-01 | Sri Lanka Invierno | 01/11 → 11/11 | 11 | 1.050€ | 700€ | 15 (15 left) | open | Carlos |
| egipto-2026-11-06 | Egipto | 06/11 → 13/11 | 8 | 950€ | 300€ | 15 (15 left) | open | Carlos |
| brasil-2026-11-08 | Brasil | 08/11 → 18/11 | 11 | 1.250€ | 750€ | 15 (15 left) | open | Carlos |
| filipinas-invierno-2026-11-13 | Filipinas Invierno | 13/11 → 25/11 | 13 | 1.350€ | 750€ | 15 (15 left) | open | Carlos |
| egipto-2026-11-13 | Egipto (2) | 13/11 → 20/11 | 8 | 950€ | 300€ | 15 (15 left) | open | Marta |
| tailandia-invierno-2026-11-16 | Tailandia Invierno | 16/11 → 28/11 | 13 | 1.300€ | 650€ | 15 (15 left) | open | Marta |
| sri-lanka-invierno-2026-11-16 | Sri Lanka Invierno (2) | 16/11 → 26/11 | 11 | 1.050€ | 700€ | 15 (15 left) | open | Marta |
| brasil-2026-11-22 | Brasil (2) | 22/11 → 02/12 | 11 | 1.250€ | 750€ | 15 (3 left) | almost-full | Marta |
| laponia-2026-11-26 | Laponia | 26/11 → 30/11 | 5 | ⚠️ 0€ | 400€ | 15 (6 left) | open | Marta |
| zanzibar-2026-11-29 | Zanzíbar | 29/11 → 06/12 | 8 | 1.300€ | 650€ | 15 (5 left) | open | Marta |

### Navidad / Fin de Año 2026
| Trip | Destino | Fechas | Días | Precio | Vuelo | Plazas | Estado | Coord. |
|---|---|---|---|---|---|---|---|---|
| tailandia-invierno-2026-12-01 | Tailandia Invierno | 01/12 → 13/12 | 13 | 1.300€ | 650€ | 15 (15 left) | open | Carlos |
| brasil-2026-12-03 | Brasil | 03/12 → 13/12 | 11 | 1.250€ | 750€ | 15 (0 left) | full | Carlos |
| laponia-2026-12-03 | Laponia | 03/12 → 07/12 | 5 | ⚠️ 0€ | 400€ | 15 (5 left) | open | Carlos |
| maldivas-2026-12-05 | Maldivas | 05/12 → 12/12 | 7 | 950€ | 850€ | 15 (15 left) | open | Marta |

---

## 5. Resumen de precios por destino

| Destino | Precio | Vuelo estimado | Duración | Total estimado |
|---|---|---|---|---|
| Azores | 900€ | 200€ | 7 días | ~1.100€ |
| Egipto | 950€ | 300€ | 8 días | ~1.250€ |
| Maldivas | 950€ | 850€ | 7 días | ~1.800€ |
| Sri Lanka (3 ediciones) | 1.050€ | 700€ | 9-11 días | ~1.750€ |
| Puerto Rico | 1.150€ | 700€ | 8 días | ~1.850€ |
| Brasil | 1.250€ | 750€ | 11 días | ~2.000€ |
| Indonesia | 1.250€ | 750€ | 14 días | ~2.000€ |
| Islandia | 1.250€ | 280€ | 8 días | ~1.530€ |
| Lofoten | 1.250€ | 350€ | 9 días | ~1.600€ |
| Tailandia (2 ediciones) | 1.300€ | 650€ | 13-14 días | ~1.950€ |
| Zanzíbar | 1.300€ | 650€ | 8 días | ~1.950€ |
| Filipinas (2 ediciones) | 1.350€ | 750€ | 13 días | ~2.100€ |
| Colombia | 1.350€ | 650€ | 11 días | ~2.000€ |
| Laponia | ⚠️ pendiente | 400€ | 5 días | — |

---

## 6. Coordinadores

### Marta López (marta)
- **Rol:** Coordinadora Senior — **Edad:** 29
- **Destinos asignados:** Brasil, Zanzíbar, Egipto, Lofoten, Indonesia, Filipinas Verano, Puerto Rico, Sri Lanka Verano, Sri Lanka Invierno
- **Trips asignados:** 34

### Carlos Ruiz (carlos)
- **Rol:** Coordinador — **Edad:** 27
- **Destinos asignados:** Laponia, Maldivas, Islandia, Azores, Colombia, Tailandia Verano, Tailandia Invierno, Filipinas Invierno, Sri Lanka Otoño
- **Trips asignados:** 38

---

## 7. Testimonios

| ID | Nombre | Destino |
|---|---|---|
| t1 | Laura | Brasil |
| t2 | Pablo | Laponia |
| t3 | Ana | Indonesia |
| t4 | Miguel | Maldivas |
| t5 | Sara | Zanzíbar |
| t6 | David | Brasil |

---

## 8. Incluido / No incluido por defecto

### Siempre incluido
1. Alojamiento durante todo el viaje
2. Desayunos incluidos
3. Traslados principales
4. Coordinador Travelhood 24/7
5. Tasas turísticas y entradas incluidas en el itinerario

### Nunca incluido (por defecto)
1. Vuelos internacionales
2. Comidas y cenas no especificadas
3. Seguro de viaje
4. Actividades no incluidas en el itinerario
5. Gastos personales y propinas

---

## 9. Comparaciones

| Destino A | Destino B |
|---|---|
| Islandia | Laponia |
| Indonesia | Tailandia |
| Indonesia | Sri Lanka |
| Tailandia | Filipinas |
| Sri Lanka | Filipinas |
| Egipto | Zanzíbar |
| Azores | Islandia |
| Azores | Lofoten |
| Brasil | Puerto Rico |
| Brasil | Colombia |
| Maldivas | Zanzíbar |
| Laponia | Lofoten |

---

## 10. Notas y pendientes

- **Laponia:** Precio aún en 0€ (pendiente de definir)
- **Camino de Santiago:** Placeholder sin contenido (próximamente)
- **SEO completado:** Todos los continentes, países, categorías, temporadas y comparativas tienen campos SEO rellenos.
- **Galería Colombia:** Galería de imágenes subida correctamente.
- **Error TS pre-existente:** `data-provider.ts(187)` mapea `included`/`notIncluded` a la interfaz `Destination` que ya no tiene esas propiedades (usa `extraIncluded`/`extraNotIncluded`). Pendiente de corregir en roadmap `fixSanityFields`.

---

## 11. Documentos eliminados de Sanity (limpieza 21/03/2026)

### Destinos eliminados (18)
argentina, bali, costa-rica, cuba, grecia, india, japon, jordania, marruecos, mexico, namibia, peru, portugal, sri-lanka, tailandia, tanzania-safari, turquia, vietnam

### Países eliminados (14)
argentina, costa-rica, cuba, grecia, india, japon, jordania, marruecos, mexico, namibia, peru, tanzania-safari, turquia, vietnam

### Trips eliminados (31)
Todos los trips pre-fillDestination que referenciaban destinos eliminados o duplicaban fechas cubiertas por los nuevos trips.

### Comparaciones eliminadas (6)
tailandia-vs-bali, marruecos-vs-egipto, japon-vs-tailandia, grecia-vs-turquia, peru-vs-colombia, costa-rica-vs-mexico
