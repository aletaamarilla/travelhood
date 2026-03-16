# CONCEPT_mapSEO — Mapa de Mejoras SEO/GEO para Travelhood

> **Target:** travelhood.es — Agencia de viajes en grupo para jóvenes de 20-35 años  
> **Stack:** Astro 5 (SSG) + React + Tailwind + Vercel  
> **Dominio:** https://travelhood.es

---

## 1. Diagnóstico actual

### Lo que ya funciona bien

| Aspecto | Estado | Notas |
|---------|--------|-------|
| `lang="es"` en `<html>` | OK | Correcto |
| Meta description por página | OK | Cada landing pasa su propia description |
| Open Graph + Twitter Cards | OK | Configurado en Layout.astro |
| Canonical URLs | OK | Generados automáticamente |
| Sitemap XML | OK | `@astrojs/sitemap` integrado |
| Structured Data básico | OK | Organization, WebSite, FAQ, BreadcrumbList, HowTo, Article, TouristDestination, Product |
| SSG (Static Site Generation) | OK | Ideal para SEO — HTML puro servido |
| Internal linking | OK | InternalLinks.astro + Footer completo |
| Blog con SEO metadata | OK | Article schema, breadcrumbs, tags, categorías |
| Jerarquía de headings | OK | H1 único por página, estructura H2/H3 coherente |
| GEODataBlock | OK | Bloque de datos factuales para GEO en continentes |

### Lo que falta o necesita mejora (ordenado por impacto)

| Problema | Impacto | Detalle |
|----------|---------|---------|
| **No existe `robots.txt`** | CRÍTICO | Google no tiene directrices de crawling |
| **No existe página 404** | ALTO | Crawl errors sin gestionar = penalización |
| **Imágenes sin optimización** | ALTO | Usando `<img>` raw en vez de `<Image />` de Astro (sin WebP/AVIF, sin width/height explícitos, sin responsive srcset) |
| **Sin `AggregateRating` schema** | ALTO | No se aprovechan los testimoniales para rich snippets de estrellas |
| **Sin FAQPage schema en `/preguntas-frecuentes`** | ALTO | 22 FAQs sin schema — oportunidad de featured snippets perdida |
| **Sin schema en `/viajar-sola`** | ALTO | Landing de alto tráfico potencial sin structured data |
| **Sin schema en `/ofertas`** | ALTO | No hay `OfferCatalog` ni `Product` con precio tachado |
| **Sin schema en `/travelhood`** (about) | MEDIO | Falta `AboutPage` schema |
| **Breadcrumbs inconsistentes** | MEDIO | Solo en `como-funciona`, `destinos/[slug]`, `destino/[slug]`, `blog/[slug]` — faltan en el resto |
| **Keywords meta estáticas** | MEDIO | Mismo `<meta name="keywords">` global en todas las páginas |
| **Sin `TravelAgency` schema** | MEDIO | Más específico que `Organization` para este negocio |
| **`sameAs` vacío en Organization** | MEDIO | No se declaran redes sociales para Knowledge Panel |
| **Sin `Event` schema para viajes** | MEDIO | Cada trip tiene fecha, lugar, precio — perfecto para Event/TravelAction |
| **Fuentes externas (Google Fonts)** | MEDIO | Latencia adicional, impacto en LCP. Debería ser self-hosted |
| **Sin `manifest.json`** | BAJO | PWA readiness, pero no prioritario |
| **Sin hreflang** | BAJO | Solo sirve contenido en español, pero buena práctica declararlo |

---

## 2. Arquitectura de páginas — Gaps de contenido SEO

### Páginas existentes (13 rutas)

```
/                           → Home
/viajes                     → Buscador
/destino/[slug]             → 25 destinos
/destinos/[slug]            → 6 continentes
/tipos/[slug]               → 5 categorías
/temporada/[slug]           → 6 temporadas
/como-funciona              → Landing explicativa
/viajar-sola                → Landing emocional
/preguntas-frecuentes       → FAQ hub
/ofertas                    → Promo
/travelhood                 → About
/blog                       → Blog index
/blog/[slug]                → Blog posts
```

### Páginas que FALTAN para dominar long-tail

| Página propuesta | Keyword target | Volumen estimado | Prioridad |
|------------------|----------------|------------------|-----------|
| `/pais/[slug]` (25 países) | "viaje en grupo a [país]" | ALTO | P0 |
| `/destino/[slug]/[trip-slug]` | "viaje [destino] [temporada] 2026" | ALTO | P0 |
| `/comparar/[slug-a]-vs-[slug-b]` | "tailandia o bali", "marruecos o egipto" | MEDIO | P1 |
| `/cuando-viajar-a/[slug]` | "mejor epoca para viajar a [destino]" | ALTO | P1 |
| `/presupuesto/[slug]` | "cuanto cuesta viajar a [destino]" | ALTO | P1 |
| `/viajes-[temporada]-[año]` | "viajes semana santa 2026" | ALTO | P1 |
| `/viajes-para-mujeres` | "viajes para mujeres solas" | ALTO | P1 |
| `/viajes-para-singles` | "viajes para singles jóvenes" | MEDIO | P2 |
| `/grupo-abierto` | "viajes en grupo abierto" | MEDIO | P2 |
| `/opiniones` | "travelhood opiniones" | MEDIO | P2 |
| `/guia/[slug]` (guías por destino) | "guía de viaje [destino]" | MEDIO | P2 |
| `/glosario-viajero` | términos long-tail | BAJO | P3 |

### Nota importante
> La prioridad P0 significa "páginas que deberían existir antes de lanzar cualquier campaña de SEO seria". P1 son páginas que multiplican el tráfico orgánico. P2/P3 son nice-to-have.

---

## 3. Structured Data — Mapa completo de schemas

### Schemas actuales vs. lo que debería haber

| Página | Schema actual | Schema necesario |
|--------|-------------|-----------------|
| `/` (Home) | Organization, WebSite | + `TravelAgency`, `AggregateRating`, `SiteNavigationElement` |
| `/viajes` | Ninguno | `ItemList` (lista de viajes), `SearchAction` |
| `/destino/[slug]` | BreadcrumbList, TouristDestination, FAQPage | + `Product` con `AggregateOffer`, `AggregateRating`, `Event` por trip |
| `/destinos/[slug]` | BreadcrumbList, FAQPage | + `ItemList` de destinos, `TouristDestination` por destino |
| `/tipos/[slug]` | Ninguno | BreadcrumbList, FAQPage, ItemList |
| `/temporada/[slug]` | Ninguno | BreadcrumbList, FAQPage, ItemList, `Event` por trip |
| `/como-funciona` | BreadcrumbList, HowTo, FAQPage | OK — completo |
| `/viajar-sola` | Ninguno | BreadcrumbList, FAQPage, `Article` (contenido editorial largo) |
| `/preguntas-frecuentes` | Ninguno | FAQPage (las 22 FAQs), BreadcrumbList |
| `/ofertas` | Ninguno | `OfferCatalog`, `Product` con `priceValidUntil`, BreadcrumbList |
| `/travelhood` | Ninguno | `AboutPage`, BreadcrumbList |
| `/blog` | Ninguno | `CollectionPage`, `ItemList`, BreadcrumbList |
| `/blog/[slug]` | Article, BreadcrumbList | OK — completo |

### Schemas nuevos a implementar

#### `TravelAgency` (reemplaza Organization genérica)
```json
{
  "@type": "TravelAgency",
  "name": "Travelhood",
  "url": "https://travelhood.es",
  "logo": "https://travelhood.es/icon.svg",
  "description": "Agencia de viajes en grupo para jóvenes de 20 a 35 años...",
  "priceRange": "590€ - 1590€",
  "areaServed": { "@type": "Country", "name": "España" },
  "audience": { "@type": "PeopleAudience", "suggestedMinAge": 20, "suggestedMaxAge": 35 },
  "sameAs": ["https://instagram.com/travelhood", "https://tiktok.com/@travelhood"],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "500" }
}
```

#### `Event` para cada Trip
```json
{
  "@type": "Event",
  "name": "Japón — Semana Santa 2026",
  "startDate": "2026-03-28",
  "endDate": "2026-04-10",
  "eventAttendanceMode": "OfflineEventAttendanceMode",
  "location": { "@type": "Place", "name": "Japón" },
  "offers": {
    "@type": "Offer",
    "price": "1590",
    "priceCurrency": "EUR",
    "availability": "LimitedAvailability",
    "validFrom": "2025-10-01"
  },
  "organizer": { "@type": "TravelAgency", "name": "Travelhood" }
}
```

#### `AggregateRating` en Home y destinos
Extraer datos de `testimonials` (todos son 5 estrellas, 6 reviews) y generar un schema real para rich snippets de estrellas en Google.

---

## 4. SEO Técnico — Acciones necesarias

### 4.1 robots.txt (CREAR)
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://travelhood.es/sitemap-index.xml
```

### 4.2 Página 404 (CREAR)
`src/pages/404.astro` — Página con links a destinos populares, buscador, y CTAs. Reduce bounce y aprovecha el error para reconducir.

### 4.3 Optimización de imágenes
- Migrar de `<img>` a `<Image />` de Astro (`astro:assets`)
- Generar WebP/AVIF automáticamente
- Declarar `width` y `height` explícitos (evita CLS)
- Usar `loading="lazy"` (ya se hace en parte) y `fetchpriority="high"` para LCP
- Responsive `srcset` con breakpoints (640, 768, 1024, 1280)

### 4.4 Self-host de fuentes
- Descargar DM Sans y Space Grotesk
- Usar `@font-face` con `font-display: swap`
- Eliminar `<link>` a Google Fonts (reduce 2 conexiones externas)
- Ahorro estimado: 200-400ms en LCP

### 4.5 Preconnect / Preload
- Eliminar preconnects a Google Fonts (si se self-hostean)
- Añadir `<link rel="preload">` para la hero image de cada página (LCP)
- Añadir `<link rel="dns-prefetch">` para CDNs de terceros (flagcdn.com)

### 4.6 Meta keywords dinámicas
Cada página debería tener su propio set de keywords. La prop ya existe en Layout pero no se usa (keywords es hardcoded global).

### 4.7 Trailing slashes consistentes
La canonical ya fuerza trailing slash — verificar que toda la navegación interna use trailing slash también para evitar redirecciones.

---

## 5. GEO (Generative Engine Optimization) — Estrategia

### 5.1 Qué es GEO y por qué importa
Los motores de IA (ChatGPT, Gemini, Perplexity, Copilot) están reemplazando búsquedas informacionales. Para que Travelhood aparezca como fuente citada, necesitamos:

1. **Contenido factual estructurado** (datos, tablas, listas)
2. **Respuestas directas a preguntas** (FAQs, headings interrogativos)
3. **Autoridad temática** (cobertura exhaustiva del nicho)
4. **Datos citables** (estadísticas, precios, comparativas)

### 5.2 Acciones GEO específicas

#### A. Bloques de datos factuales en CADA landing
Ya tienes `GEODataBlock` en continentes. Extender a:
- Cada destino (`/destino/[slug]`) — precio desde, duración, grupo, clima, mejor época
- Cada tipo de viaje (`/tipos/[slug]`) — número de destinos, rango de precios
- Cada temporada (`/temporada/[slug]`) — viajes disponibles, rango de fechas
- Home — resumen de toda la oferta

#### B. Tablas comparativas
Las IAs adoran las tablas. Ya tienes una en `/como-funciona`. Crear más:
- Tabla de precios por destino (landing `/viajes` o nueva landing)
- Tabla de "mejor época por destino" (ya existe en continentes, elevar a landing propia)
- Tabla comparativa entre destinos similares (Tailandia vs Bali, Marruecos vs Egipto)

#### C. Headings interrogativos
Cambiar secciones de texto plano a formato pregunta-respuesta:
- "¿Cuánto cuesta un viaje a Tailandia?" en vez de "Precios"
- "¿Cuál es la mejor época para ir a Japón?" en vez de "Temporada"
- "¿Es seguro viajar a Marruecos en grupo?" en vez de "Seguridad"

#### D. Listas de "Top N" (contenido pillar)
- "Los 5 mejores destinos para viajar sola en 2026"
- "Los 3 viajes más baratos de Travelhood"
- "Ranking de destinos por precio, duración y experiencia"

#### E. Datos citables con fuente
En cada bloque de datos, incluir fuente: "Datos de Travelhood · travelhood.es" (ya existe). Añadir fechas de actualización para frescura.

#### F. Schema `speakable`
Para que Google Assistant y Alexa puedan citar fragmentos:
```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".geo-data-block", ".faq-section"]
  }
}
```

---

## 6. Contenido — Estrategia editorial SEO

### 6.1 Cluster de contenido (Pillar + Spokes)

```
PILLAR: /viajar-sola
  ├── /blog/viajar-sola-sin-miedo (ya existe)
  ├── /blog/viajes-para-mujeres-solas-2026 (crear)
  ├── /blog/destinos-seguros-mujeres (crear)
  └── /blog/testimonios-viajeras-solas (crear)

PILLAR: /viajes (buscador)
  ├── /temporada/semana-santa (ya existe)
  ├── /temporada/verano (ya existe)
  ├── /blog/destinos-baratos-jovenes (ya existe)
  ├── /blog/cuando-viajar-a-cada-destino (crear)
  └── /blog/presupuesto-viaje-grupo (crear)

PILLAR: /como-funciona
  ├── /blog/que-incluye-viaje-grupo (ya existe)
  ├── /blog/como-hacer-amigos-viajando (ya existe)
  └── /blog/diferencias-viaje-grupo-vs-solo (crear)

PILLAR: /destinos/[continente]
  ├── /destino/[slug] (ya existen)
  ├── /pais/[slug] (crear)
  ├── /cuando-viajar-a/[slug] (crear)
  └── /presupuesto/[slug] (crear)
```

### 6.2 Blog posts de alto impacto SEO (por crear)

| Título | Keyword target | Tipo | Intent |
|--------|---------------|------|--------|
| "Viajes en grupo para jóvenes 2026 — Guía completa" | viajes en grupo jóvenes | Pillar | Informacional |
| "¿Cuánto cuesta viajar a Tailandia en 2026?" | cuanto cuesta viajar a tailandia | Spoke | Informacional |
| "Mejor época para viajar a Japón" | mejor epoca viajar japon | Spoke | Informacional |
| "Tailandia o Bali: ¿qué viaje elegir?" | tailandia o bali | Comparativa | Informacional |
| "Opiniones de Travelhood: lo que dicen nuestros viajeros" | travelhood opiniones | Reputación | Navegacional |
| "Viajes Semana Santa 2026 — Destinos y precios" | viajes semana santa 2026 | Temporal | Transaccional |
| "Los 7 mejores viajes para hacer en agosto" | viajes agosto | Temporal | Transaccional |

### 6.3 Contenido que las IAs priorizan

1. **Listas con datos concretos** — "5 destinos desde 590€" (no "destinos baratos")
2. **Comparativas objetivas** — tablas con criterios medibles
3. **Respuestas directas** — primeras 2 frases del párrafo responden la pregunta
4. **Estadísticas propias** — "El 70% de nuestros viajeros reservan solos"
5. **Precios actualizados** — "Desde 890€ en Semana Santa 2026 (actualizado marzo 2026)"
6. **Testimonios con datos** — nombre, edad, ciudad, destino, valoración

---

## 7. Optimización on-page por landing

### `/` (Home)
- [ ] Añadir `TravelAgency` schema (reemplazar Organization)
- [ ] Añadir `AggregateRating` schema
- [ ] Rellenar `sameAs` con redes sociales reales
- [ ] Añadir `GEODataBlock` con resumen de oferta global
- [ ] Hero image: preload con `fetchpriority="high"`

### `/viajes`
- [ ] Añadir `BreadcrumbList` schema
- [ ] Añadir `ItemList` schema con todos los viajes
- [ ] Añadir `SearchAction` schema (ya en WebSite, pero reforzar en página)
- [ ] Contenido textual editorial antes del buscador (h1 + párrafo SEO)

### `/destino/[slug]` (25 páginas)
- [ ] Añadir `Event` schema por cada trip disponible
- [ ] Añadir `AggregateRating` con testimonials del destino
- [ ] Añadir `GEODataBlock` con datos clave del destino
- [ ] Mejorar alt texts: "Viaje en grupo a {destino} — {actividad principal}" 
- [ ] Añadir sección "Mejor época para viajar a {destino}"
- [ ] Añadir sección "¿Cuánto cuesta viajar a {destino}?"

### `/destinos/[slug]` (6 continentes)
- [ ] Añadir `ItemList` schema con los destinos
- [ ] Ya tiene `GEODataBlock` — OK
- [ ] Reforzar internal linking cruzado entre continentes

### `/tipos/[slug]` (5 categorías)
- [ ] Añadir `BreadcrumbList` schema
- [ ] Añadir `FAQPage` schema (las FAQs existen pero no tienen schema)
- [ ] Añadir `ItemList` schema con destinos de la categoría

### `/temporada/[slug]` (6 temporadas)
- [ ] Añadir `BreadcrumbList` schema
- [ ] Añadir `FAQPage` schema
- [ ] Añadir `Event` schema por trip
- [ ] Añadir `GEODataBlock` con resumen de temporada

### `/viajar-sola`
- [ ] Añadir `BreadcrumbList` schema
- [ ] Añadir `FAQPage` schema (6 FAQs sin schema)
- [ ] Añadir `Article` schema (contenido editorial largo)
- [ ] Añadir `GEODataBlock` con datos (70%, 98%, 14 personas)

### `/preguntas-frecuentes`
- [ ] Añadir `FAQPage` schema con las 22 FAQs (CRÍTICO — mucho potencial de featured snippets)
- [ ] Añadir `BreadcrumbList` schema

### `/ofertas`
- [ ] Añadir `OfferCatalog` schema
- [ ] Añadir `Product` schema por oferta con `priceSpecification` (precio original y precio oferta)
- [ ] Añadir `BreadcrumbList` schema

### `/travelhood` (About)
- [ ] Añadir `AboutPage` schema
- [ ] Añadir `BreadcrumbList` schema

### `/blog`
- [ ] Añadir `CollectionPage` schema
- [ ] Añadir `ItemList` schema con los posts
- [ ] Añadir `BreadcrumbList` schema

---

## 8. Quick Wins — Impacto inmediato con poco esfuerzo

| Acción | Esfuerzo | Impacto | Tiempo estimado |
|--------|----------|---------|-----------------|
| Crear `robots.txt` | Trivial | ALTO | 5 min |
| Crear `404.astro` | Bajo | ALTO | 30 min |
| Añadir FAQPage schema a `/preguntas-frecuentes` | Bajo | ALTO | 15 min |
| Rellenar `sameAs` en Organization | Trivial | MEDIO | 5 min |
| Añadir BreadcrumbList a las 6 páginas que no lo tienen | Bajo | MEDIO | 30 min |
| Añadir FAQPage schema a `/viajar-sola` | Bajo | MEDIO | 10 min |
| Cambiar `Organization` por `TravelAgency` | Bajo | MEDIO | 15 min |

---

## 9. Edge Cases y Blind Spots

### 9.1 Canibalización de keywords
- `/viajar-sola` y `/blog/viajar-sola-sin-miedo` compiten por el mismo keyword. Solución: canonical cruzado o fusionar la landing con el blog post, redirigiendo uno al otro.
- `/temporada/semana-santa` y un futuro `/blog/viajes-semana-santa-2026` competirían. Solución: el blog post linkea a la temporada como fuente, no al revés.

### 9.2 Contenido duplicado
- Las FAQs se repiten entre `/como-funciona`, `/viajar-sola` y `/preguntas-frecuentes`. Google puede no indexar todas. Solución: variar las respuestas ligeramente o usar canonical.
- Los datos de destinos aparecen en continentes, tipos, temporadas Y destino individual. Solución: cada página debe tener un ángulo editorial diferente (geográfico vs tipo vs temporal vs detalle).

### 9.3 Imágenes repetidas
- Muchos destinos usan la misma imagen hero (`hero-zanzibar.jpg` para Tailandia, Marruecos, Turquía, etc.). Esto afecta:
  - SEO de imágenes (Google Images)
  - Percepción de calidad
  - OG previews idénticas en redes sociales

### 9.4 Datos hardcoded en TypeScript
- Todo el contenido (destinos, trips, FAQs, blog) está en archivos `.ts`. Cuando migres a Sanity (siguiente concept), asegúrate de que los schemas de Sanity reflejen las mismas interfaces TypeScript actuales para mantener compatibilidad con los componentes React/Astro.

### 9.5 Rendimiento
- `client:load` se usa extensivamente (Navbar, SearchIsland, FAQSection, SeasonExplorer, TripDetailPage). Cada uno de estos components envía JavaScript al cliente. Para SEO, asegurarse de que el contenido crítico esté renderizado en HTML estático y los componentes client-side solo añaden interactividad, no contenido.

### 9.6 Links WhatsApp con número placeholder
- El número `34600000000` es un placeholder. Si se lanza así, todos los CTAs de WhatsApp fallan. Impacto SEO indirecto: altas tasas de rebote.

### 9.7 Falta de tracking
- Sin Google Analytics, Search Console, ni tag manager configurados visiblemente. Sin datos de tracking no se puede medir el impacto de ninguna mejora SEO.

---

## 10. Priorización de implementación

### Fase 1 — Fundamentos (1-2 días)
1. Crear `robots.txt`
2. Crear `404.astro`
3. Añadir FAQPage schema a `/preguntas-frecuentes` y `/viajar-sola`
4. Completar BreadcrumbList en todas las páginas
5. Cambiar Organization → TravelAgency + rellenar sameAs
6. Añadir meta keywords dinámicas por página

### Fase 2 — Structured Data completo (2-3 días)
7. Añadir Event schema a todos los trips (en destino y temporada)
8. Añadir OfferCatalog schema a `/ofertas`
9. Añadir ItemList a `/viajes`, `/blog`, `/tipos/[slug]`
10. Añadir AggregateRating schema (home + destinos)
11. Añadir AboutPage schema a `/travelhood`
12. Añadir CollectionPage schema a `/blog`

### Fase 3 — Performance & Core Web Vitals (2-3 días)
13. Migrar imágenes a `<Image />` de Astro
14. Self-host fuentes (DM Sans, Space Grotesk)
15. Preload de hero images por página
16. Auditar y reducir uso de `client:load` donde no sea necesario
17. Añadir `width`/`height` explícitos a todas las imágenes

### Fase 4 — Nuevas páginas SEO (1-2 semanas)
18. Crear landing `/pais/[slug]` (25 países)
19. Crear landing `/cuando-viajar-a/[slug]`
20. Crear landing `/presupuesto/[slug]`
21. Crear landing `/opiniones`
22. Crear landing `/viajes-para-mujeres`
23. Crear landing de comparativas (`/comparar/[a]-vs-[b]`)

### Fase 5 — Contenido editorial (ongoing)
24. Blog posts de alto impacto SEO (1-2 por semana)
25. GEODataBlock en todas las landings
26. Tablas comparativas adicionales
27. Headings interrogativos en todas las secciones

---

## 11. Nota sobre Sanity (siguiente concept)

Todas las mejoras de este concept son implementables con la arquitectura actual (datos en TS). Cuando migres a Sanity:

- Los campos SEO (`seoTitle`, `seoDescription`, `ogImage`, `keywords[]`) deben ser campos nativos de cada document type en Sanity
- Las FAQs deben ser un campo `array` de `{question, answer}` reutilizable
- Los schemas de structured data se generarán dinámicamente a partir de los datos de Sanity
- Los blog posts migrarán de `blog-data.ts` a un content type de Sanity con editor rich text (Portable Text)
- Las imágenes migrarán al CDN de Sanity (imagen optimizada out-of-the-box)

La estructura de interfaces TypeScript actual (`Destination`, `Trip`, `Continent`, etc.) debería mapear 1:1 con los document types de Sanity.
