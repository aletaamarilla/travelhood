# CONCEPT: refactor — Arquitectura SEO/GEO para 70-100 páginas indexadas

> **Contexto:** Equipo de una persona. Los datos actuales viven en `travel-data.ts` y `blog-data.ts`. Después de la aprobación del cliente, todo migra a Sanity CMS. La arquitectura se diseña para que cada tipo de página sea un "content type" en Sanity que el cliente pueda escalar sin tocar código.

---

## 1. Estado actual vs. Objetivo

### Páginas actuales: 25
| Ruta | Páginas | Fuente de datos |
|------|---------|-----------------|
| `/` | 1 | Estática |
| `/viajes` | 1 | `travel-data.ts` |
| `/travelhood` | 1 | Estática |
| `/destino/[slug]` | 15 | `destinations[]` |
| `/blog` | 1 | `blog-data.ts` |
| `/blog/[slug]` | 6 | `blogPosts[]` |
| **Total** | **25** | |

### Objetivo: 75-85 páginas (con capacidad de llegar a 100+ desde Sanity)

---

## 2. Mapa completo de páginas — Desglose a 80 URLs indexables

| Grupo | Ruta | Páginas | Fuente | Esfuerzo dev | Mantenimiento |
|-------|------|---------|--------|-------------|---------------|
| **Existentes** | | | | | |
| Home | `/` | 1 | Estática | Ya hecho | — |
| Catálogo | `/viajes` | 1 | travel-data | Ya hecho | — |
| About | `/travelhood` | 1 | Estática | Ya hecho | — |
| Destinos actuales | `/destino/[slug]` | 15 | destinations[] | Ya hecho | — |
| Blog index | `/blog` | 1 | blog-data | Ya hecho | — |
| Blog posts actuales | `/blog/[slug]` | 6 | blogPosts[] | Ya hecho | — |
| **Nuevas — Auto-generadas** | | | | | |
| Continentes | `/destinos/[slug]` | 5 | continents[] | 1 plantilla | Cero |
| Tipos de viaje | `/tipos/[slug]` | 5 | categories | 1 plantilla | Cero |
| Temporadas | `/temporada/[slug]` | 6 | tripTags | 1 plantilla | Cero |
| Ofertas | `/ofertas` | 1 | promoPrice filter | 1 página | Cero |
| **Nuevas — Editorial (1 vez)** | | | | | |
| Cómo funciona | `/como-funciona` | 1 | Estática | 1 página | 1x/año |
| Viajar sola | `/viajar-sola` | 1 | Estática | 1 página | 1x/año |
| FAQ | `/preguntas-frecuentes` | 1 | Estática | 1 página | Cuando surjan dudas |
| **Nuevas — Contenido expandido** | | | | | |
| Destinos nuevos | `/destino/[slug]` | +10 | destinations[] | Datos + imágenes | Cero |
| Blog posts nuevos | `/blog/[slug]` | +15 | blogPosts[] | Redacción | Evergreen |
| **TOTAL** | | **~80** | | | |

---

## 3. Detalle de cada grupo de páginas

### A) Continentes — 5 páginas auto-generadas
**Ruta:** `/destinos/[slug]`
**Plantilla Astro:** `src/pages/destinos/[slug].astro`

Generadas desde `continents[]` en `travel-data.ts`. Solo se renderizan los continentes que tengan al menos 1 destino (Oceanía no tiene destinos ahora, no se genera).

| Slug | Página | Destinos que agrupa |
|------|--------|---------------------|
| `europa` | Viajes en grupo a Europa para jóvenes | Laponia, Islandia, Grecia + nuevos |
| `asia` | Viajes en grupo a Asia para jóvenes | Japón, Tailandia, Bali, Maldivas, Vietnam + nuevos |
| `africa` | Viajes en grupo a África para jóvenes | Marruecos, Egipto, Zanzíbar + nuevos |
| `sudamerica` | Viajes en grupo a Sudamérica para jóvenes | Brasil, Perú + nuevos |
| `centroamerica` | Viajes en grupo a Centroamérica y Caribe | Costa Rica, México + nuevos |

**Contenido de cada página:**
- Hero con imagen + H1 optimizado: "Viajes en grupo a [Continente] para jóvenes de 20 a 35 años"
- Introducción editorial (250-350 palabras): por qué ese continente, qué esperar, nivel de dificultad, presupuesto orientativo. Se almacena como campo nuevo `editorialIntro` en el objeto `Continent`.
- Tabla "Mejor época para cada destino" (meses × destinos del continente)
- Grid de destinos con cards que enlazan a `/destino/[slug]`
- Viajes próximos en ese continente (auto-filtrados)
- FAQ del continente (3-5 preguntas, schema FAQPage). Campo `faqs` en el objeto.
- CTA: "Explora todos los viajes en [Continente]" → `/viajes` prefiltrado

**Keywords que captura:** "viajes en grupo a Asia", "viajes para jóvenes Europa", "viajes organizados África"

**Preparación para Sanity:** Cada continente será un document type con campos `name`, `slug`, `editorialIntro`, `heroImage`, `bestMonths`, `faqs[]`. El cliente podrá editar todo el contenido editorial desde Sanity.

---

### B) Tipos de viaje — 5 páginas auto-generadas
**Ruta:** `/tipos/[slug]`
**Plantilla Astro:** `src/pages/tipos/[slug].astro`

Generadas desde `DestinationCategory`. Añadir `nieve` como categoría activa (Laponia ya la tiene).

| Slug | Página | Destinos |
|------|--------|----------|
| `aventura` | Viajes de aventura en grupo | Laponia, Zanzíbar, Islandia, Perú, Costa Rica, Marruecos, México, Vietnam... |
| `playa` | Viajes de playa en grupo | Brasil, Maldivas, Tailandia, Bali, Grecia, Zanzíbar, Costa Rica, México... |
| `cultural` | Viajes culturales en grupo | Japón, Tailandia, Marruecos, Bali, Egipto, Grecia, México, Zanzíbar, Vietnam... |
| `naturaleza` | Viajes de naturaleza en grupo | Laponia, Maldivas, Islandia, Bali, Costa Rica... |
| `nieve` | Viajes de nieve y frío en grupo | Laponia, Islandia |

**Contenido de cada página:**
- Hero + H1: "Viajes de [tipo] en grupo para jóvenes"
- Editorial (200 palabras): qué significa ese tipo de experiencia en Travelhood
- "¿Para quién es este tipo de viaje?" — perfil del viajero ideal
- Grid de destinos filtrados por categoría
- Próximos viajes de este tipo
- FAQ (3-4 preguntas, schema FAQPage)
- CTA

**Keywords que captura:** "viajes de aventura para jóvenes", "viajes de playa en grupo", "viajes culturales organizados"

**Preparación para Sanity:** Document type `TripCategory` con `slug`, `title`, `editorial`, `heroImage`, `idealProfile`, `faqs[]`.

---

### C) Temporadas — 6 páginas auto-generadas
**Ruta:** `/temporada/[slug]`
**Plantilla Astro:** `src/pages/temporada/[slug].astro`

Generadas desde los `TripTag` existentes. Agrupamos los 8 tags en 6 páginas para evitar fragmentación:

| Slug | Tags que agrega | Página |
|------|----------------|--------|
| `semana-santa` | `semana-santa` | Viajes en grupo Semana Santa |
| `puentes` | `puente-mayo`, `puente-octubre`, `puente-noviembre` | Viajes en grupo en puentes y festivos |
| `verano` | `verano` | Viajes en grupo verano |
| `septiembre` | `septiembre` | Viajes en grupo septiembre |
| `navidad` | `navidad` | Viajes en grupo Navidad |
| `fin-de-anio` | `fin-de-anio` | Viajes en grupo Fin de Año |

**Contenido de cada página:**
- Hero estacional + H1: "Viajes en grupo [Temporada] 2026 para jóvenes"
- Editorial evergreen (150-200 palabras): "¿Por qué [temporada] es el momento perfecto para tu primer viaje en grupo?"
- Viajes filtrados por los tags correspondientes, con plazas restantes visibles
- Tabla de fechas × destinos × precios
- Si no hay viajes con ese tag: formulario de captación "Déjanos tu email y te avisamos"
- FAQ estacional (3 preguntas, schema FAQPage)
- CTA de urgencia

**Keywords que captura:** "viajes semana santa jóvenes 2026", "viajes grupo verano", "viajes fin de año en grupo", "viajes puente mayo grupo"

**Preparación para Sanity:** Document type `Season` con `slug`, `title`, `tags[]`, `editorial`, `heroImage`, `faqs[]`. Los viajes se filtran automáticamente por tag.

---

### D) Ofertas — 1 página auto-generada
**Ruta:** `/ofertas`
**Plantilla Astro:** `src/pages/ofertas.astro`

Filtra automáticamente trips donde `promoPrice` o `promoLabel` existen.

**Contenido:**
- Hero: "Últimas plazas con descuento — Viajes en grupo para jóvenes"
- Grid de viajes con descuento, ordenados por % de descuento
- Cada card: precio tachado, precio promo, % descuento, plazas restantes, badge de urgencia
- Filtros ligeros: continente, duración
- "¿Por qué ahora?" — 3 razones evergreen para reservar ya
- Schema `Offer` en cada viaje

**Keywords que captura:** "viajes baratos en grupo jóvenes", "ofertas viajes última hora", "viajes grupo descuento"

---

### E) Cómo funciona — 1 página editorial
**Ruta:** `/como-funciona`
**Plantilla Astro:** `src/pages/como-funciona.astro`

**Contenido:**
- Hero: "Así funciona un viaje con Travelhood"
- Proceso paso a paso visual (5 pasos con iconos): Elige → Reserva → Grupo → Coordinador → Viaja
- "¿Qué incluye un viaje?" — lista detallada con iconos
- "¿Qué NO incluye?" — transparencia total
- Tabla comparativa 3 columnas: Viajar solo vs. Agencia tradicional vs. Travelhood
- FAQ detallada (8-10 preguntas, schema HowTo + FAQPage)
- Datos citables: "El grupo medio tiene 14 personas", "El 98% repetirían"
- CTA: "Elige tu primer viaje"

**Keywords que captura:** "cómo funciona viaje en grupo", "qué incluye viaje organizado jóvenes"

---

### F) Viajar sola — 1 página editorial (DIFERENCIADOR CLAVE)
**Ruta:** `/viajar-sola`
**Plantilla Astro:** `src/pages/viajar-sola.astro`

**WeRoad NO tiene esta página. Este es el mayor hueco competitivo.**

**Contenido:**
- Hero emocional: "¿No tienes con quién ir? Nosotros tenemos el grupo."
- "No estás sola" — cómo funciona cuando vas sin conocer a nadie
- Datos citables: "El 70% de nuestros viajeros vienen solos. El 98% repiten."
- Testimonios de viajeros que fueron solos/as (nombre, edad, foto)
- "Destinos perfectos para tu primer viaje solo/a" — grid de 5 destinos recomendados
- FAQ emocional: "¿Es seguro?", "¿Haré amigos?", "¿Hay gente de mi edad?", "¿Puedo ir sola siendo mujer?"
- Schema FAQPage
- CTA: "Tu primera aventura empieza aquí"

**Keywords que captura:** "viajar sola en grupo", "viajes para mujeres solas jóvenes", "viajes para solteros jóvenes"

---

### G) FAQ general — 1 página editorial
**Ruta:** `/preguntas-frecuentes`
**Plantilla Astro:** `src/pages/preguntas-frecuentes.astro`

**Contenido:**
- FAQs en bloques: El viaje | Reservas y pagos | El grupo | Seguro y cancelaciones | Coordinador
- Accordions reutilizando `accordion.tsx`
- Schema FAQPage completo
- Interlinking: cada respuesta enlaza a la página interna relevante
- CTA contextual entre bloques

---

### H) 10 destinos nuevos — ampliar de 15 a 25
**Ruta:** `/destino/[slug]` (misma plantilla existente)

Nuevos destinos a añadir en `travel-data.ts` (con sus países y trips correspondientes):

| Destino | País | Continente | Categorías | Por qué |
|---------|------|------------|------------|---------|
| Colombia | Colombia | sudamerica | aventura, cultural | Trending, cercano a público joven español |
| Jordania | Jordania | asia* | cultural, aventura | Petra, desierto, WeRoad lo tiene y convierte |
| Sri Lanka | Sri Lanka | asia | aventura, naturaleza, cultural | Trending, buen precio, muy instagrameable |
| India | India | asia | cultural, aventura | Rajastán, destino aspiracional para jóvenes |
| Turquía | Turquía | europa* | cultural, playa | Estambul + Capadocia, vuelos baratos desde España |
| Portugal | Portugal | europa | playa, cultural | Weekend/express, accesible desde España |
| Cuba | Cuba | centroamerica | cultural, aventura | Icónico, diferente, buenas fotos |
| Tanzania Safari | Tanzania | africa | aventura, naturaleza | Safari diferente de Zanzíbar playa |
| Namibia | Namibia | africa | aventura, naturaleza | Paisajes únicos, pocos competidores lo tienen |
| Argentina | Argentina | sudamerica | aventura, naturaleza | Patagonia, Buenos Aires, vinícola |

*Nota: Jordania y Turquía se pueden asignar a los continentes existentes o añadir "Oriente Medio" como continente nuevo. Para Sanity, será un campo seleccionable.

**Cada destino nuevo genera automáticamente:**
- 1 página `/destino/[slug]`
- Aparece en la página de su continente
- Aparece en las páginas de sus tipos
- Si tiene trips con promoPrice, aparece en `/ofertas`
- Si tiene trips con tags de temporada, aparece en esas temporadas

**Preparación para Sanity:** Cada destino será un document type `Destination` con todos los campos actuales + `editorialLong` (texto SEO de 300+ palabras), `gallery[]`, `faqs[]`, `relatedBlogPosts[]`.

---

### I) 15 blog posts nuevos — ampliar de 6 a 21
**Ruta:** `/blog/[slug]` (misma plantilla existente)

| # | Artículo | Keyword target | Enlaza a | Tipo |
|---|----------|----------------|----------|------|
| 1 | "Los 10 mejores destinos para tu primer viaje en grupo" | destinos viaje grupo | Destinos, `/viajar-sola` | Listicle |
| 2 | "Viajes en grupo vs. viajar por tu cuenta: comparativa real" | viajes grupo vs solo | `/como-funciona` | Comparativa |
| 3 | "¿Cuánto cuesta un viaje en grupo? Presupuesto real 2026" | coste viaje grupo | `/ofertas`, destinos | Guía |
| 4 | "Mejores destinos para Semana Santa en grupo" | semana santa viajes grupo | `/temporada/semana-santa` | Estacional |
| 5 | "Viajes de aventura para jóvenes: los que más repiten" | viajes aventura jóvenes | `/tipos/aventura` | Guía |
| 6 | "Qué hacer si no conoces a nadie en un viaje en grupo" | viaje grupo sin conocer | `/viajar-sola` | Experiencia |
| 7 | "Guía de Marruecos para jóvenes: todo lo que necesitas" | Marruecos jóvenes | `/destino/marruecos` | Guía destino |
| 8 | "Guía de Japón para jóvenes: todo lo que necesitas" | Japón jóvenes | `/destino/japon` | Guía destino |
| 9 | "Guía de Tailandia para jóvenes: todo lo que necesitas" | Tailandia jóvenes | `/destino/tailandia` | Guía destino |
| 10 | "Guía de Bali para jóvenes: todo lo que necesitas" | Bali jóvenes | `/destino/bali` | Guía destino |
| 11 | "Los mejores viajes de playa en grupo para jóvenes" | viajes playa grupo | `/tipos/playa` | Listicle |
| 12 | "Cómo elegir tu primer viaje en grupo (sin equivocarte)" | primer viaje grupo | `/como-funciona`, `/viajar-sola` | Guía |
| 13 | "Viajar en grupo en verano: guía completa 2026" | viajes grupo verano | `/temporada/verano` | Estacional |
| 14 | "Viajes baratos en grupo: destinos por menos de 1.000€" | viajes baratos grupo | `/ofertas` | Listicle |
| 15 | "Qué llevar en la maleta para un viaje de aventura" | maleta viaje aventura | `/tipos/aventura` | Guía práctica |

**Preparación para Sanity:** Document type `BlogPost` con campos para título, slug, body (Portable Text / rich text), excerpt, category, image, author, relatedDestinations[], tags[]. El cliente o un redactor podrá crear posts nuevos directamente desde Sanity sin tocar código.

---

## 4. Conteo final de páginas

| Tipo de página | Cantidad | Autogenerada | Fuente datos actual |
|----------------|----------|-------------|---------------------|
| Home | 1 | — | Estática |
| Viajes (catálogo) | 1 | — | travel-data |
| About | 1 | — | Estática |
| Continentes | 5 | Sí | continents[] |
| Tipos de viaje | 5 | Sí | categories |
| Temporadas | 6 | Sí | tripTags |
| Ofertas | 1 | Sí | promoPrice filter |
| Cómo funciona | 1 | — | Editorial |
| Viajar sola | 1 | — | Editorial |
| FAQ | 1 | — | Editorial |
| Destinos (15 + 10 nuevos) | 25 | Sí | destinations[] |
| Blog index | 1 | — | blog-data |
| Blog posts (6 + 15 nuevos) | 21 | — | blogPosts[] |
| **TOTAL FASE 1** | **~80** | | |

### Escalado posterior con Sanity (sin tocar código)

| Acción en Sanity | Páginas nuevas | Total acumulado |
|------------------|----------------|-----------------|
| +5 destinos nuevos | +5 | ~85 |
| +10 blog posts | +10 | ~95 |
| +5 destinos más | +5 | ~100 |
| Páginas de país `/destinos/[cont]/[pais]` | +15-20 | ~115-120 |

**Con Sanity, el cliente escala a 100+ páginas creando contenido. Sin tocar código. Sin ti.**

---

## 5. Modelo de datos para Sanity (post-aprobación)

Cuando migres a Sanity, cada grupo de páginas se convierte en un document type. Este es el mapa:

### Document types

```
Continent
├── name: string
├── slug: slug
├── editorialIntro: blockContent (Portable Text)
├── heroImage: image
├── bestMonths: string
├── faqs: array of { question: string, answer: text }
├── seoTitle: string
├── seoDescription: string

Destination
├── name: string
├── slug: slug
├── continent: reference → Continent
├── country: reference → Country
├── categories: array of string (playa, aventura, cultural, naturaleza, nieve)
├── description: blockContent
├── shortDescription: string
├── heroImage: image
├── gallery: array of image
├── highlights: array of string
├── idealFor: string
├── climate: string
├── editorialLong: blockContent (texto SEO 300+ palabras)
├── faqs: array of { question: string, answer: text }
├── seoTitle: string
├── seoDescription: string

Country
├── name: string
├── slug: slug
├── continent: reference → Continent
├── flag: string

Trip
├── title: string
├── destination: reference → Destination
├── departureDate: date
├── returnDate: date
├── durationDays: number
├── priceFrom: number
├── promoPrice: number (opcional)
├── promoLabel: string (opcional)
├── flightEstimate: number
├── totalPlaces: number
├── placesLeft: number
├── coordinator: reference → Coordinator
├── status: string (open | almost-full | full)
├── included: array of string
├── notIncluded: array of string
├── itinerary: array of { day: number, title: string, description: text, lat: number, lng: number }
├── tags: array of string (semana-santa, verano, etc.)

TripCategory
├── name: string
├── slug: slug
├── editorial: blockContent
├── heroImage: image
├── idealProfile: string
├── faqs: array of { question: string, answer: text }
├── seoTitle: string
├── seoDescription: string

Season
├── name: string
├── slug: slug
├── tags: array of string (los TripTags que agrupa)
├── editorial: blockContent
├── heroImage: image
├── faqs: array of { question: string, answer: text }
├── seoTitle: string
├── seoDescription: string

Coordinator
├── name: string
├── age: number
├── role: string
├── bio: blockContent
├── destinations: array of reference → Destination
├── quote: string
├── image: image

BlogPost
├── title: string
├── slug: slug
├── excerpt: string
├── body: blockContent (Portable Text — el editor principal)
├── category: string
├── image: image
├── author: object { name, role }
├── relatedDestinations: array of reference → Destination
├── relatedPosts: array of reference → BlogPost
├── tags: array of string
├── seoTitle: string
├── seoDescription: string
├── publishedAt: datetime

Testimonial
├── name: string
├── age: number
├── city: string
├── destination: reference → Destination
├── quote: text
├── rating: number
├── image: image

Page (para /como-funciona, /viajar-sola, /faq — páginas editoriales)
├── title: string
├── slug: slug
├── body: blockContent
├── faqs: array of { question: string, answer: text }
├── seoTitle: string
├── seoDescription: string
```

### Flujo de trabajo post-Sanity
1. El cliente crea un destino nuevo en Sanity → se genera automáticamente `/destino/[slug]` + aparece en su continente + tipos + temporadas
2. El cliente crea un blog post en Sanity → se genera `/blog/[slug]` + aparece en el índice
3. El cliente crea un trip con promoPrice → aparece automáticamente en `/ofertas`
4. El cliente crea un trip con tag "verano" → aparece en `/temporada/verano`
5. **Todo crece sin tocar código.**

---

## 6. Cambios en páginas existentes

### Home (`/`)
- Schema `Organization` + `WebSite` + `SearchAction` en `<head>`
- H1 optimizado: "Viajes en grupo para jóvenes de 20 a 35 años"
- Breadcrumbs con schema `BreadcrumbList`
- Nuevo bloque: navegación rápida a continentes (5 cards)
- Nuevo bloque: navegación a tipos de viaje (5 cards)
- Nuevo bloque: "Viajes por temporada" con links a `/temporada/[slug]`
- Sección de ofertas destacadas desde `/ofertas`

### Destino (`/destino/[slug]`)
- Schema `TouristDestination` + `Product` + `Offer`
- Breadcrumbs: Home > [Continente] > [Destino]
- Bloque "Otros destinos en [continente]" (interlinking horizontal)
- Open Graph tags optimizados
- Contenido editorial ampliado (300+ palabras en destinos nuevos)

### Blog (`/blog` y `/blog/[slug]`)
- Schema `Article` + `BreadcrumbList` + `Person`
- Bloque "Artículos relacionados" al final
- Cada artículo enlaza a mínimo 2 destinos + 1 landing interna
- Tabla de contenidos automática en artículos con 4+ secciones

### Viajes (`/viajes`)
- Schema `ItemList`
- Canonical tag estricta (evitar duplicados por parámetros de filtro)

### About (`/travelhood`)
- Schema `Organization` completo
- Reforzar E-E-A-T: licencias, seguros, experiencia
- Links a `/como-funciona` y `/viajar-sola`

---

## 7. SEO técnico global

### Schemas JSON-LD (implementar en Layout.astro)
| Schema | Página | Impacto |
|--------|--------|---------|
| `Organization` | Home, About | Alto — Knowledge Panel |
| `WebSite` + `SearchAction` | Home | Medio — Sitelinks search box |
| `BreadcrumbList` | Todas | Medio — Navegación en SERP |
| `FAQPage` | Todas las que tengan FAQs | Alto — Rich results + GEO |
| `HowTo` | `/como-funciona` | Alto — Featured snippet |
| `TouristDestination` | `/destino/[slug]` | Medio — Rich results |
| `Product` + `Offer` | `/destino/[slug]`, `/ofertas` | Medio — Precio en SERP |
| `Article` | `/blog/[slug]` | Medio — Rich results |
| `AggregateRating` | `/destino/[slug]` | Alto — Estrellas en SERP |

### Sitemap
- Generar `sitemap.xml` dinámico desde Astro que incluya TODAS las rutas
- Prioridades: Home (1.0), Destinos (0.9), Continentes/Tipos (0.8), Temporadas (0.8), Blog (0.7)
- `lastmod` basado en la última fecha de modificación de los datos

### Meta tags
- Cada página con `<title>` y `<meta description>` únicos y optimizados
- Open Graph completo (og:title, og:description, og:image, og:url)
- Twitter Card
- Canonical tag en todas las páginas

### Rendimiento
- Todas las páginas SSG (Astro static build) — Time to First Byte mínimo
- Imágenes con `loading="lazy"` y formatos modernos (WebP/AVIF en Sanity)
- Core Web Vitals como prioridad

---

## 8. GEO (Generative Engine Optimization)

### Qué hacer para que las IAs citen a Travelhood

| Acción | Dónde | Por qué |
|--------|-------|---------|
| Párrafos de respuesta directa en las primeras 2 líneas de cada sección | Destinos, `/como-funciona`, `/viajar-sola` | Las IAs extraen la primera respuesta clara |
| FAQs con schema en TODAS las páginas posibles | Global | Google SGE y ChatGPT priorizan FAQs estructuradas |
| Datos propios citables | `/viajar-sola`, `/como-funciona`, `/travelhood` | Las IAs prefieren fuentes con datos originales |
| Tablas comparativas | `/como-funciona`, blogs | Las IAs citan tablas como fuente autoritativa |
| Listas ordenadas ("Los 10 mejores...", "5 razones...") | Blog | Las IAs referencian listas como respuestas |

### Datos citables a incluir
- "El 70% de los viajeros de Travelhood reservan solos. El 98% repiten."
- "El grupo medio tiene 14 personas de 20-35 años."
- "Cada viaje incluye coordinador, alojamiento, transporte interno y seguro."
- "Los viajes cuestan entre 590€ y 1.590€, sin vuelo."
- Tabla: "Mejor época para viajar a cada destino según nuestros coordinadores"

---

## 9. Interlinking

```
HOME ─────────────────────────────────────────────────────────────────
├── /destinos/europa ──────── /destino/laponia, /destino/islandia, /destino/grecia, /destino/turquia, /destino/portugal
├── /destinos/asia ────────── /destino/japon, /destino/tailandia, /destino/bali, /destino/maldivas, /destino/vietnam, /destino/sri-lanka, /destino/india, /destino/jordania
├── /destinos/africa ──────── /destino/marruecos, /destino/egipto, /destino/zanzibar, /destino/tanzania-safari, /destino/namibia
├── /destinos/sudamerica ──── /destino/brasil, /destino/peru, /destino/colombia, /destino/argentina
├── /destinos/centroamerica ─ /destino/costa-rica, /destino/mexico, /destino/cuba
│
├── /tipos/aventura ───────── destinos con categoría "aventura"
├── /tipos/playa ──────────── destinos con categoría "playa"
├── /tipos/cultural ───────── destinos con categoría "cultural"
├── /tipos/naturaleza ─────── destinos con categoría "naturaleza"
├── /tipos/nieve ──────────── destinos con categoría "nieve"
│
├── /temporada/semana-santa ─ trips con tag "semana-santa"
├── /temporada/puentes ────── trips con tags "puente-*"
├── /temporada/verano ─────── trips con tag "verano"
├── /temporada/septiembre ─── trips con tag "septiembre"
├── /temporada/navidad ────── trips con tag "navidad"
├── /temporada/fin-de-anio ── trips con tag "fin-de-anio"
│
├── /ofertas ──────────────── trips con promoPrice
├── /como-funciona
├── /viajar-sola ──────────── destinos recomendados + testimonios + blog
├── /preguntas-frecuentes
├── /travelhood
│
├── /viajes ───────────────── catálogo completo con filtros
│
└── /blog ─────────────────── 21 artículos del cluster semántico
    ├── /blog/viajar-sola-sin-miedo ←→ /viajar-sola
    ├── /blog/por-que-viajar-en-grupo ←→ /como-funciona
    ├── /blog/guia-marruecos-jovenes ←→ /destino/marruecos
    ├── /blog/guia-japon-jovenes ←→ /destino/japon
    └── ... (cada post enlaza a 2+ destinos + 1 landing)
```

**Regla:** Cada página enlaza a mínimo 3 páginas internas. Cada destino enlaza a su continente, sus tipos y un artículo de blog.

---

## 10. Edge Cases

### Continentes vacíos
- Oceanía no tiene destinos. No se genera la página. Cuando se añada un destino en Oceanía (en Sanity), la página se genera automáticamente.

### Temporadas sin viajes
- Si no hay trips con tag "semana-santa", la página muestra: "Aún no hemos publicado viajes para Semana Santa. Déjanos tu email y te avisamos." → Captación de leads.

### Canibalización SEO
- `/tipos/playa` (intent: "quiero un viaje de playa") vs. `/destino/maldivas` (intent: "quiero ir a Maldivas"). Intents distintos, no compiten.
- `/destinos/africa` (intent: "explorar África") vs. `/destino/marruecos` (intent: "ir a Marruecos"). El continente es hub, el destino es decisión.

### Destinos 1:1 con país
- Actualmente cada destino = un país. Cuando Sanity permita múltiples destinos por país (ej. "Marrakech Express" + "Marruecos 360°"), se puede añadir una capa de país `/destinos/[cont]/[pais]`. Por ahora no es necesaria.

### Thin content
- Las páginas auto-generadas (continentes, tipos, temporadas) necesitan mínimo 200-300 palabras de editorial. Añadir campos de texto en los datos.

### Competitivo
- **WeRoad tiene Trustpilot (4.6/5, 1476 opiniones).** Priorizar recoger testimonios reales. Cuando haya 20+, considerar crear `/opiniones`.
- **WeRoad tiene pago fraccionado.** Implementar con Stripe cuando se integre pagos.

---

## 11. Esfuerzo real

### Desarrollo (una sola vez)
| Tarea | Días |
|-------|------|
| Plantilla `/destinos/[slug].astro` (continentes) | 0.5 |
| Plantilla `/tipos/[slug].astro` | 0.5 |
| Plantilla `/temporada/[slug].astro` | 0.5 |
| Página `/ofertas.astro` | 0.5 |
| Página `/como-funciona.astro` | 1 |
| Página `/viajar-sola.astro` | 1 |
| Página `/preguntas-frecuentes.astro` | 0.5 |
| Schemas JSON-LD globales | 1 |
| Mejoras SEO en páginas existentes (breadcrumbs, meta, OG) | 1 |
| **Subtotal dev** | **~6.5 días** |

### Contenido (una sola vez)
| Tarea | Días |
|-------|------|
| Textos editoriales para 5 continentes (5x 300 palabras) | 1 |
| Textos para 5 tipos de viaje (5x 200 palabras) | 0.5 |
| Textos para 6 temporadas (6x 200 palabras) | 0.5 |
| FAQs de continentes, tipos y temporadas (16 páginas x 4 FAQs) | 1 |
| Datos de 10 destinos nuevos (descripciones, highlights, imágenes) | 2 |
| Copy de `/como-funciona` | 0.5 |
| Copy de `/viajar-sola` | 0.5 |
| Copy de `/preguntas-frecuentes` (30-40 preguntas) | 0.5 |
| 15 blog posts nuevos | 5-7 |
| **Subtotal contenido** | **~12-14 días** |

### Total
| Fase | Días | Resultado |
|------|------|-----------|
| Dev (plantillas + SEO técnico) | ~7 | 80 páginas indexables |
| Contenido (textos + datos) | ~13 | Contenido de calidad en todas |
| **Total** | **~20 días de trabajo** | **80 páginas listas** |

### Post-Sanity (futuro)
| Tarea | Días |
|-------|------|
| Setup Sanity Studio + document types | 3-4 |
| Migrar datos de .ts a Sanity | 1-2 |
| Conectar Astro con Sanity (queries GROQ) | 2-3 |
| **Total migración** | **~7-9 días** |
| **Mantenimiento posterior** | **0 — el cliente gestiona contenido desde Sanity** |
