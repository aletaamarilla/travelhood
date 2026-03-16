# ROADMAP: mapSEO — Mapa de Mejoras SEO/GEO para Travelhood

> **Origen:** `concepts/CONCEPT_mapSEO.md` (aprobado)
> **Stack:** Astro 5 + React 19 + Tailwind CSS 4 + Vercel (SSG)
> **Dominio:** https://travelhood.es
> **Estado actual:** ~80 páginas indexables (post-refactor). Falta SEO técnico, schemas avanzados, performance y nuevas landings long-tail.

---

## [DONE] 1. Crear robots.txt y verificar trailing slashes

Effort: low
Work: auto
Focus: backend

**Objetivo:** Crear el archivo `robots.txt` que falta (impacto CRÍTICO según diagnóstico) y auditar que toda la navegación interna use trailing slashes consistentes para evitar redirecciones innecesarias.

**Descripción humana:** El archivo `robots.txt` es lo primero que Google lee cuando visita un sitio web. Sin él, Google no tiene instrucciones sobre qué páginas rastrear y cuáles no. Además, se verifica que todos los enlaces internos usen el mismo formato de URL para evitar problemas.

**Detalle técnico:**
- **Nuevo archivo:** `public/robots.txt`
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Sitemap: https://travelhood.es/sitemap-index.xml
  ```
- **Auditoría de trailing slashes:** Revisar `astro.config.mjs` para confirar la config de `trailingSlash`. La canonical en `src/layouts/Layout.astro` ya fuerza trailing slash (línea 24). Verificar que todos los `<a href>` en componentes y páginas usen trailing slash para coherencia.
- Archivos a revisar: `src/components/Footer.astro`, `src/components/InternalLinks.astro`, `src/components/Navbar.tsx`, todas las páginas en `src/pages/`.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para buscar `href="/"` y `href="/` sin trailing slash en `.astro` y `.tsx`.
- `npm run build` para verificar que `dist/robots.txt` se copia correctamente.

**Validación:**
- `dist/robots.txt` existe tras el build y contiene las directrices correctas.
- No hay inconsistencias de trailing slashes en los links internos del HTML generado.
- `npm run build` sin errores.

---

## [DONE] 2. Crear página 404 personalizada

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Crear `src/pages/404.astro` para gestionar errores 404 con una página útil que reduzca la tasa de rebote y reconducir usuarios a destinos populares.

**Descripción humana:** Cuando alguien llega a una página que no existe, en vez de ver un error genérico, verá una página bonita con enlaces a destinos populares, el buscador de viajes y botones de acción. Esto evita que la gente se vaya del sitio.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/404.astro`
- Layout: usar `Layout.astro` con `noIndex: true` para que Google no indexe la 404.
- Contenido recomendado:
  - H1: "¡Ups! Esta página se fue de viaje" (tono de marca)
  - Texto amigable explicando que la página no existe.
  - Grid de 4-6 destinos populares (filtrar de `destinations` los más vendidos o con más trips).
  - Enlace al buscador `/viajes/`.
  - CTA "Volver al inicio".
- Reutilizar componentes existentes: `Navbar.tsx`, `Footer.astro`.
- Seguir identidad visual: colores de `.cursor/rules/identidad-corporativa.mdc`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/layouts/Layout.astro` para la prop `noIndex`.
- Lectura de `src/lib/travel-data.ts` para obtener destinos populares.
- Lectura de `.cursor/rules/identidad-corporativa.mdc` para paleta y tipografía.
- `npm run build` para verificar generación de la 404.

**Validación:**
- `dist/404.html` existe tras el build.
- La página incluye `<meta name="robots" content="noindex, nofollow">`.
- La página muestra destinos populares y enlaces al buscador.
- Verificar visualmente con `npm run dev` accediendo a una ruta inexistente.

---

## [DONE] 3. Upgrade de schema Organization → TravelAgency + sameAs + AggregateRating

Effort: low
Work: manual (si tengo que acceder a un saas y obtener una api key y ponerla en algun fichero, etc)
Focus: backend

**Objetivo:** Reemplazar el schema `Organization` genérico por `TravelAgency` (más específico para el negocio), rellenar el array `sameAs` con las URLs reales de redes sociales, y añadir `AggregateRating` basado en los testimoniales existentes.

**Descripción humana:** Le decimos a Google que Travelhood es una agencia de viajes (no una organización genérica). Además, le indicamos las redes sociales oficiales para que aparezcan en el Knowledge Panel de Google, y mostramos la valoración media de los clientes (estrellas en los resultados de búsqueda).

**Detalle técnico:**
- **Archivo:** `src/lib/schemas.ts`
  - Renombrar `generateOrganizationSchema()` → `generateTravelAgencySchema()` (o crear nueva función y deprecar la anterior).
  - Cambiar `"@type": "Organization"` → `"@type": "TravelAgency"`.
  - Añadir campos:
    ```json
    {
      "priceRange": "590€ - 1590€",
      "areaServed": { "@type": "Country", "name": "España" },
      "audience": { "@type": "PeopleAudience", "suggestedMinAge": 20, "suggestedMaxAge": 35 },
      "sameAs": ["https://instagram.com/travelhood.es", "https://tiktok.com/@travelhood.es"]
    }
    ```
  - **NOTA MANUAL:** El usuario debe confirmar las URLs exactas de Instagram y TikTok antes de implementar. Verificar que coincidan con las cuentas reales.
- **Nueva función:** `generateAggregateRatingSchema()` en `schemas.ts`.
  - Leer `testimonials[]` de `src/lib/travel-data.ts` para calcular `ratingValue` y `reviewCount`.
  - Todos los testimoniales existentes son 5 estrellas → `ratingValue: "5"`, `reviewCount` = número de testimonios.
- **Archivos a actualizar:** Todas las páginas que usen `generateOrganizationSchema()` deben usar la nueva función. Buscar con Grep.
- Añadir `AggregateRating` en Home (`src/pages/index.astro`) y en destinos (`src/pages/destino/[slug].astro`).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/schemas.ts` (completo, ya leído).
- Lectura de `src/lib/travel-data.ts` → interfaz `Testimonial` y array `testimonials`.
- Grep para buscar `generateOrganizationSchema` en todo el proyecto.
- `npm run build`.

**Validación:**
- HTML de la Home contiene `"@type": "TravelAgency"` en vez de `"Organization"`.
- `sameAs` contiene al menos 2 URLs de redes sociales.
- `AggregateRating` aparece en el HTML de la Home y de al menos un destino.
- `npm run build` sin errores.

---

## [DONE] 4. Completar FAQPage schema en páginas que lo necesitan

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Asegurar que todas las páginas con FAQs tengan el schema `FAQPage` correctamente implementado, especialmente `/preguntas-frecuentes` (22 FAQs) y `/viajar-sola` (6 FAQs) que el diagnóstico identifica como faltantes.

**Descripción humana:** Las preguntas frecuentes que ya están en la web pero no tienen la "etiqueta invisible" correcta para Google se desperdician. Al añadir el schema FAQPage, Google puede mostrarlas directamente en los resultados de búsqueda como desplegables, atrayendo más clics.

**Detalle técnico:**
- **Páginas a auditar y corregir:**
  - `/preguntas-frecuentes` (`src/pages/preguntas-frecuentes.astro`) — verificar que las 22 FAQs tengan schema `FAQPage` completo.
  - `/viajar-sola` (`src/pages/viajar-sola.astro`) — verificar que las FAQs tengan schema.
  - `/tipos/[slug]` (`src/pages/tipos/[slug].astro`) — las FAQs existen pero pueden no tener schema.
  - `/temporada/[slug]` (`src/pages/temporada/[slug].astro`) — verificar schema FAQPage.
  - `/ofertas` (`src/pages/ofertas.astro`) — si tiene FAQs, añadir schema.
- Usar `generateFaqSchema()` de `src/lib/schemas.ts` (ya existe) e inyectar vía `<script type="application/ld+json">`.
- Verificar que no haya duplicación de schemas si ya están parcialmente implementados.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para buscar `generateFaqSchema` y `FAQPage` en todas las páginas `.astro`.
- Lectura de cada página listada para verificar si el schema está presente.
- `npm run build` + inspección del HTML generado.

**Validación:**
- `dist/preguntas-frecuentes/index.html` contiene `"@type": "FAQPage"` con las 22 preguntas.
- `dist/viajar-sola/index.html` contiene `"@type": "FAQPage"`.
- Todas las páginas con FAQs tienen el schema correspondiente.
- `npm run build` sin errores.

---

## [DONE] 5. Completar BreadcrumbList en todas las páginas

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Asegurar que todas las páginas (excepto Home) tengan el componente `Breadcrumbs.astro` con su schema `BreadcrumbList`, ya que actualmente solo algunas páginas lo incluyen.

**Descripción humana:** Las "migas de pan" (Home > Destinos > Japón) ayudan a los usuarios a saber dónde están y a Google a entender la estructura del sitio. Ahora mismo solo algunas páginas las tienen. Necesitamos que estén en todas.

**Detalle técnico:**
- **Componente existente:** `src/components/Breadcrumbs.astro` (ya implementado con schema JSON-LD).
- **Auditar y añadir a las páginas que no lo tienen:**
  - `/viajes` (`src/pages/viajes.astro`) — Home > Viajes
  - `/ofertas` (`src/pages/ofertas.astro`) — Home > Ofertas
  - `/travelhood` (`src/pages/travelhood.astro`) — Home > Sobre Travelhood
  - `/blog` (`src/pages/blog.astro`) — Home > Blog
  - Cualquier otra página sin breadcrumbs.
- Verificar que las que ya los tienen usan rutas correctas (coherentes con trailing slashes).
- Grep en `src/pages/` para buscar `Breadcrumbs` e identificar cuáles faltan.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para buscar `Breadcrumbs` en todos los archivos `.astro` de `src/pages/`.
- Lectura de las páginas sin breadcrumbs.
- `npm run build`.

**Validación:**
- Todas las páginas (excepto Home) tienen breadcrumbs visibles y schema `BreadcrumbList` en su HTML.
- Las rutas de los breadcrumbs son correctas y con trailing slashes.
- `npm run build` sin errores.

---

## [DONE] 6. Implementar meta keywords dinámicas por página

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Reemplazar el `<meta name="keywords">` hardcoded global por keywords dinámicas específicas para cada página.

**Descripción humana:** Ahora mismo todas las páginas del sitio tienen las mismas palabras clave ("viajes en grupo, viajar solo..."). Cada página debería tener sus propias palabras clave: la de Japón debería incluir "viaje a Japón en grupo", la de aventura "viajes de aventura", etc.

**Detalle técnico:**
- **Archivo:** `src/layouts/Layout.astro`
  - Añadir prop `keywords?: string` a la interfaz `Props`.
  - Default: `"viajes en grupo, viajar solo, viajes jóvenes, viajes organizados, travelhood"` (el actual).
  - Usar la prop en el `<meta name="keywords" content={keywords}>` (línea 36 actual).
- **Todas las páginas:** Pasar keywords específicas:
  - `/destino/[slug]` → `"viaje en grupo a {destino}, viajes {país}, {categorías del destino}"`
  - `/destinos/[slug]` → `"viajes en grupo a {continente}, destinos {continente}"`
  - `/tipos/[slug]` → `"viajes de {tipo} en grupo, viajes {tipo} jóvenes"`
  - `/temporada/[slug]` → `"viajes {temporada} 2026, viajes grupo {temporada}"`
  - `/viajar-sola` → `"viajar sola, viajes para mujeres solas, viajes sin acompañante"`
  - `/como-funciona` → `"cómo funciona viaje en grupo, qué incluye viaje organizado"`
  - `/preguntas-frecuentes` → `"preguntas frecuentes viajes grupo, dudas viaje organizado"`
  - `/ofertas` → `"ofertas viajes grupo, viajes baratos jóvenes, últimas plazas"`
  - `/blog/[slug]` → keywords del post (ya deberían estar en `blog-data.ts` o derivarse de tags)

**Skills/Comandos/Herramientas obligatorias:**
- Edición de `src/layouts/Layout.astro`.
- Edición de todas las páginas en `src/pages/` para pasar la prop `keywords`.
- `npm run build`.

**Validación:**
- No hay dos páginas con el mismo `<meta name="keywords">` (excepto las que comparten keywords por diseño).
- Cada página tiene keywords relevantes a su contenido.
- `npm run build` sin errores.

---

## [DONE] 7. Añadir Event schema a trips en destinos y temporadas

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Implementar el schema `Event` para cada trip disponible en las páginas de destino y temporada, permitiendo que Google muestre fechas, precios y disponibilidad como rich results de eventos.

**Descripción humana:** Cada viaje de Travelhood tiene fecha de inicio, fecha de fin, destino y precio. Si le decimos a Google que esto es un "evento", puede mostrarlo directamente en sus resultados con fechas y precios, lo que atrae muchos más clics.

**Detalle técnico:**
- **Nuevo helper en `src/lib/schemas.ts`:**
  ```ts
  generateEventSchema(opts: {
    name: string, startDate: string, endDate: string,
    location: string, price: number, currency?: string,
    availability?: string
  })
  ```
  - `"@type": "Event"`
  - `eventAttendanceMode: "OfflineEventAttendanceMode"`
  - `organizer: { "@type": "TravelAgency", "name": "Travelhood" }`
  - `offers` con `Offer` schema (precio, moneda, disponibilidad)
- **Página `/destino/[slug]`** (`src/pages/destino/[slug].astro`):
  - Para cada trip del destino, generar un schema `Event`.
  - Datos de trips en `src/lib/travel-data.ts` → array `trips[]` filtrado por `destinationId`.
- **Página `/temporada/[slug]`** (`src/pages/temporada/[slug].astro`):
  - Para cada trip de la temporada, generar un schema `Event`.
- Inyectar todos los schemas como `<script type="application/ld+json">` (un script por event o array de events).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → interfaz `Trip` (campos: `startDate`, `endDate`, `priceFrom`, `destination`, `tags`).
- Lectura de `src/pages/destino/[slug].astro` y `src/pages/temporada/[slug].astro`.
- Referencia de schema.org: `Event` con `Offer`.
- `npm run build`.

**Validación:**
- HTML de `/destino/japon/` contiene al menos un `"@type": "Event"` con `startDate`, `endDate`, `offers`.
- HTML de `/temporada/verano/` contiene schemas `Event`.
- `npm run build` sin errores.
- Validar con la herramienta de Rich Results de Google (manual, al menos 1 página).

---

## [DONE] 8. Añadir OfferCatalog + Product con precio tachado en /ofertas

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Implementar los schemas `OfferCatalog` y `Product` con `priceSpecification` (precio original y precio oferta) en la página `/ofertas` para que Google muestre rich results de ofertas.

**Descripción humana:** La página de ofertas muestra viajes con descuento, pero Google no sabe que son ofertas. Al añadir los schemas correctos, Google podrá mostrar el precio original tachado y el nuevo precio directamente en los resultados de búsqueda.

**Detalle técnico:**
- **Nuevo helper en `src/lib/schemas.ts`:**
  ```ts
  generateOfferCatalogSchema(opts: {
    name: string, description: string,
    offers: { name: string, price: number, promoPrice: number, url: string, image: string, validUntil?: string }[]
  })
  ```
  - Cada offer como `Product` con `priceSpecification` incluyendo `price` (original) y `discount`/`promoPrice`.
  - `priceValidUntil` para indicar validez temporal.
- **Archivo:** `src/pages/ofertas.astro`
  - Inyectar `OfferCatalog` con todos los viajes con `promoPrice` activo.
  - Cada viaje como `Product` con `Offer` que incluya `priceSpecification`.
- Los datos de precios promo están en `src/lib/destination-details.ts` → `tripExtras`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/destination-details.ts` → `tripExtras`, `promoPrice`, `promoLabel`.
- Lectura de `src/pages/ofertas.astro`.
- `npm run build`.

**Validación:**
- HTML de `/ofertas/` contiene `"@type": "OfferCatalog"`.
- Cada oferta tiene `Product` con precio original y precio promo.
- `npm run build` sin errores.

---

## [DONE] 9. Añadir schemas ItemList, CollectionPage y AboutPage

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Completar los schemas faltantes en las páginas de listado (`/viajes`, `/blog`, `/tipos/[slug]`, `/destinos/[slug]`) y las páginas informativas (`/travelhood`).

**Descripción humana:** Las páginas que muestran listas de viajes, artículos o destinos necesitan una etiqueta que diga "esto es una lista de X elementos". La página "Sobre nosotros" necesita una etiqueta que diga "esto es una página informativa sobre la empresa".

**Detalle técnico:**
- **Schemas a añadir:**
  | Página | Schema | Datos |
  |--------|--------|-------|
  | `/viajes` | `ItemList` | Lista de todos los trips/destinos |
  | `/viajes` | `SearchAction` (reforzar) | Ya existe en WebSite, añadir también en página |
  | `/blog` | `CollectionPage` + `ItemList` | Lista de blog posts |
  | `/tipos/[slug]` | `ItemList` | Destinos de la categoría |
  | `/destinos/[slug]` | `ItemList` | Destinos del continente |
  | `/temporada/[slug]` | `ItemList` | Trips de la temporada |
  | `/travelhood` | `AboutPage` | Información de la agencia |

- **Nuevos helpers en `src/lib/schemas.ts`:**
  - `generateCollectionPageSchema()` — `"@type": "CollectionPage"`
  - `generateAboutPageSchema()` — `"@type": "AboutPage"` con referencia a `TravelAgency`
  - Reutilizar `generateItemListSchema()` existente.
- **Archivos a modificar:**
  - `src/pages/viajes.astro`
  - `src/pages/blog.astro`
  - `src/pages/tipos/[slug].astro`
  - `src/pages/destinos/[slug].astro`
  - `src/pages/temporada/[slug].astro`
  - `src/pages/travelhood.astro`

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de cada página listada.
- Lectura de `src/lib/schemas.ts` para reutilizar `generateItemListSchema`.
- `npm run build`.

**Validación:**
- HTML de `/viajes/` contiene `"@type": "ItemList"`.
- HTML de `/blog/` contiene `"@type": "CollectionPage"` y `"@type": "ItemList"`.
- HTML de `/travelhood/` contiene `"@type": "AboutPage"`.
- `npm run build` sin errores.

---

## [DONE] 10. Añadir schema speakable y hreflang

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Implementar el schema `speakable` para que asistentes de voz (Google Assistant, Alexa) puedan citar fragmentos del sitio, y añadir `hreflang` declarando que el contenido es exclusivamente en español.

**Descripción humana:** Los asistentes de voz como Alexa o Google Assistant pueden leer partes de tu web en voz alta si les dices qué partes son "legibles". Además, le decimos a Google que esta web es solo en español para que no la muestre a personas buscando en otros idiomas.

**Detalle técnico:**
- **Schema speakable:**
  - Añadir a `src/layouts/Layout.astro` o a las páginas principales un schema:
    ```json
    {
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".geo-data-block", ".faq-section"]
      }
    }
    ```
  - Los selectores CSS deben apuntar a los bloques GEODataBlock y las secciones FAQ.
  - Verificar que los componentes `GEODataBlock.astro` y `FAQSection.tsx` usan las clases referenciadas.
- **Hreflang:**
  - Añadir en `src/layouts/Layout.astro`:
    ```html
    <link rel="alternate" hreflang="es" href={canonicalUrl} />
    <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
    ```
  - Solo español, pero declararlo explícitamente como buena práctica SEO.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/layouts/Layout.astro`.
- Grep para buscar clases CSS usadas en `GEODataBlock.astro` y `FAQSection.tsx`.
- `npm run build`.

**Validación:**
- HTML generado contiene `hreflang="es"`.
- Al menos la Home y una página con GEODataBlock contienen schema `speakable`.
- `npm run build` sin errores.

---

## [DONE] 11. Migrar imágenes a `<Image />` de Astro

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Reemplazar todos los `<img>` raw por el componente `<Image />` de Astro (`astro:assets`) para obtener automáticamente WebP/AVIF, responsive `srcset`, `width`/`height` explícitos y optimización de CLS.

**Descripción humana:** Ahora mismo las imágenes del sitio se cargan tal cual, sin optimizar. El componente Image de Astro las convierte automáticamente a formatos más ligeros (WebP), genera diferentes tamaños para móvil y escritorio, y evita los "saltos" de página cuando se cargan. Esto hace que el sitio cargue más rápido.

**Detalle técnico:**
- **Auditoría:** Buscar todos los `<img` en archivos `.astro` y `.tsx` de `src/`.
- **Migración por fases:**
  1. Componentes Astro (`.astro`): reemplazar `<img>` por `<Image />` de `astro:assets`.
  2. Componentes React (`.tsx`): usar `<img>` optimizado con `width`, `height`, `loading="lazy"` y `srcset` manual (Astro `<Image>` no funciona en islands React).
- **Configuración de Image en Astro:**
  - Verificar que `astro.config.mjs` tiene configuración de image service (sharp por defecto en Astro 5).
  - Breakpoints para `srcset`: 640, 768, 1024, 1280.
- **Imágenes hero (LCP):**
  - Usar `loading="eager"` y `fetchpriority="high"` en las imágenes hero de cada página.
  - NO usar `loading="lazy"` en la primera imagen visible (hero).
- **Todas las demás imágenes:** `loading="lazy"` (ya parcialmente implementado).
- **Archivos principales a modificar:**
  - Todas las páginas `.astro` en `src/pages/`.
  - Componentes con imágenes: `src/components/TestimonialsSection.astro`, `src/components/LastChance.astro`, `src/components/AboutSection.astro`, etc.
  - Componentes React con imágenes: `src/components/TripDetailPage.tsx`, `src/components/SearchPage.tsx`, `src/components/SearchIsland.tsx`.
- **Alt texts mejorados:** Actualizar alt texts a formato SEO: "Viaje en grupo a {destino} — {actividad principal}" en vez de textos genéricos.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para `<img` en `src/` (`.astro` y `.tsx`).
- Documentación de Astro Image: `import { Image } from 'astro:assets'`.
- `npm run build` — verificar que las imágenes se optimizan (output en `dist/_astro/`).

**Validación:**
- No quedan `<img>` raw en archivos `.astro` (todos migrados a `<Image />`).
- Imágenes hero tienen `fetchpriority="high"` y `loading="eager"`.
- Imágenes no-hero tienen `loading="lazy"`.
- HTML generado incluye `srcset` y `width`/`height` en todas las imágenes.
- `npm run build` sin errores.

---

## [DONE] 12. Self-host de fuentes (DM Sans, Space Grotesk)

Effort: mid
Work: auto
Focus: frontend

**Objetivo:** Eliminar la dependencia de Google Fonts descargando las fuentes DM Sans y Space Grotesk localmente, reduciendo 2 conexiones externas y mejorando el LCP en 200-400ms estimados.

**Descripción humana:** Ahora mismo, cada vez que alguien visita la web, su navegador tiene que ir a buscar las tipografías a los servidores de Google, lo que añade tiempo de carga. Si las fuentes están en nuestro propio servidor, la carga es mucho más rápida.

**Detalle técnico:**
- **Descargar fuentes:**
  - DM Sans: weights 400, 500, 600, 700 (normal + italic).
  - Space Grotesk: weights 400, 500, 600, 700.
  - Formato: `.woff2` (soporte universal moderno).
  - Ubicación: `public/fonts/` o `src/fonts/` (para que Astro las optimice).
- **Crear `@font-face` declarations:**
  - Archivo: `src/styles/fonts.css` (nuevo) o integrar en `src/styles/globals.css`.
  - Usar `font-display: swap` para evitar FOIT.
  - Subsetear a caracteres latinos + diacríticos españoles (ñ, á, é, í, ó, ú).
- **Eliminar Google Fonts de Layout:**
  - Archivo: `src/layouts/Layout.astro`
  - Eliminar líneas 52-57 (preconnect + link a Google Fonts CSS).
- **Verificar Tailwind config:**
  - Confirmar que `fontFamily.sans` y `fontFamily.serif` (si aplica) apuntan a los nombres correctos.

**Skills/Comandos/Herramientas obligatorias:**
- Descargar fonts: `npx google-fonts-helper` o descarga manual desde google-webfonts-helper.
- Lectura de `src/layouts/Layout.astro` (líneas 52-57 de Google Fonts).
- Lectura de `tailwind.config.*` o `src/styles/globals.css` para config de font families.
- `npm run build` + medir tamaño de `dist/` antes y después.

**Validación:**
- No hay `<link>` a `fonts.googleapis.com` en ningún HTML generado.
- No hay `<link rel="preconnect">` a `fonts.googleapis.com` o `fonts.gstatic.com`.
- Las fuentes cargan correctamente (verificar visualmente con `npm run dev`).
- `font-display: swap` está presente en todas las `@font-face`.
- `npm run build` sin errores.

---

## [DONE] 13. Optimización de preload, preconnect y dns-prefetch

Effort: low
Work: auto
Focus: frontend

**Objetivo:** Configurar `<link rel="preload">` para hero images (LCP), `<link rel="dns-prefetch">` para CDNs de terceros, y limpiar preconnects obsoletos.

**Descripción humana:** Le decimos al navegador "empieza a cargar la imagen principal antes de que la necesites" y "averigua la dirección de estos servidores externos antes de que hagan falta". Esto reduce el tiempo que tarda en verse la primera imagen grande de cada página.

**Detalle técnico:**
- **Preload hero images:**
  - Añadir prop `heroImage?: string` al Layout, o usar el slot `head` existente.
  - En cada página, inyectar: `<link rel="preload" as="image" href={heroImage} fetchpriority="high">`.
  - Páginas principales a preloadear: Home, cada `/destino/[slug]`, `/como-funciona`, `/viajar-sola`.
- **DNS-prefetch:**
  - Añadir en `src/layouts/Layout.astro`:
    ```html
    <link rel="dns-prefetch" href="https://flagcdn.com" />
    ```
  - Si se usan otros CDNs de terceros (analytics, tracking), añadir dns-prefetch también.
- **Limpiar preconnects:** Si se eliminaron Google Fonts (tarea 12), los preconnects a `fonts.googleapis.com` ya no son necesarios (ya cubierto en tarea 12).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/layouts/Layout.astro`.
- Grep para buscar dominios externos en `src/` (e.g., `flagcdn`, `googleapis`).
- `npm run build`.

**Validación:**
- HTML de páginas con hero image contiene `<link rel="preload" as="image">`.
- HTML contiene `<link rel="dns-prefetch">` para CDNs externos.
- No hay preconnects a dominios que ya no se usan.
- `npm run build` sin errores.

---

## [DONE] 14. Extender GEODataBlock a todas las landings

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Añadir bloques de datos factuales (`GEODataBlock.astro`) en las landings que aún no lo tienen para maximizar la probabilidad de citación por IAs generativas (ChatGPT, Gemini, Perplexity).

**Descripción humana:** Los bloques de datos con cifras concretas (precio desde, duración, grupo medio, mejor época) son exactamente lo que las inteligencias artificiales buscan para citar como fuente. Cuantas más páginas tengan estos bloques, más veces citarán a Travelhood.

**Detalle técnico:**
- **Componente existente:** `src/components/GEODataBlock.astro` (ya implementado).
- **Páginas donde añadir GEODataBlock:**
  | Página | Datos a incluir |
  |--------|----------------|
  | `/` (Home) | Nº destinos, rango precios, grupo medio, % que viajan solos |
  | `/destino/[slug]` | Precio desde, duración, grupo, clima, mejor época |
  | `/tipos/[slug]` | Nº destinos del tipo, rango de precios |
  | `/temporada/[slug]` | Viajes disponibles, rango de fechas, rango de precios |
  | `/viajes` | Total destinos, rango precios global |
  | `/ofertas` | Nº ofertas activas, descuento medio, rango precios promo |
- Los datos se pueden calcular dinámicamente desde `travel-data.ts` en cada página (en el frontmatter Astro, server-side en build).
- Añadir atributo `class="geo-data-block"` al componente si no lo tiene (necesario para schema `speakable` de tarea 10).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/components/GEODataBlock.astro` (ya leído).
- Lectura de las páginas listadas para determinar dónde insertar el bloque.
- Lectura de `src/lib/travel-data.ts` para datos dinámicos (precios, duraciones, etc.).
- `npm run build`.

**Validación:**
- Todas las landings listadas contienen un GEODataBlock visible.
- Los datos son coherentes con los de `travel-data.ts`.
- El componente tiene la clase CSS `geo-data-block` (para speakable).
- `npm run build` sin errores.

---

## [DONE] 15. Optimización on-page: headings interrogativos y contenido GEO

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Transformar headings genéricos en formato interrogativo ("¿Cuánto cuesta...?", "¿Cuál es la mejor época...?") y añadir párrafos de respuesta directa en las primeras 2 líneas de cada sección para optimizar para GEO/SGE.

**Descripción humana:** Cuando alguien le pregunta a ChatGPT "¿Cuánto cuesta un viaje a Tailandia?", la IA busca páginas que respondan exactamente esa pregunta. Si nuestros títulos y primeros párrafos están en formato pregunta-respuesta, tenemos muchas más posibilidades de ser citados.

**Detalle técnico:**
- **Headings interrogativos a cambiar (sin alterar la estructura HTML, solo textos):**
  - En `/destino/[slug]`: secciones tipo "Precios" → "¿Cuánto cuesta viajar a {destino} en grupo?"
  - En `/destino/[slug]`: "Temporada" → "¿Cuál es la mejor época para viajar a {destino}?"
  - En `/destino/[slug]`: "Seguridad" → "¿Es seguro viajar a {destino} en grupo?"
  - En `/como-funciona`: secciones genéricas → formato pregunta-respuesta.
- **Párrafos de respuesta directa:**
  - Las primeras 2 frases de cada sección deben responder la pregunta directamente.
  - Ejemplo: "Un viaje en grupo a Tailandia con Travelhood cuesta desde 890€ por persona, sin incluir vuelos. El precio incluye alojamiento, transporte interno, coordinador y seguro."
- **Páginas a optimizar:**
  - `src/pages/destino/[slug].astro` y componentes usados en esta página.
  - `src/pages/como-funciona.astro`.
  - `src/pages/viajar-sola.astro`.
- **Datos citables obligatorios** (deben aparecer literalmente en al menos 3 páginas):
  - "El 70% de los viajeros de Travelhood reservan solos."
  - "El 98% de los viajeros repiten con Travelhood."
  - "El grupo medio tiene 14 personas de 20 a 35 años."
  - "Los viajes cuestan entre 590€ y 1.590€, sin vuelo."

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de las páginas listadas y sus componentes.
- Lectura de `src/lib/travel-data.ts` para datos reales de precios y destinos.
- `npm run build`.

**Validación:**
- Al menos 5 headings en formato interrogativo en el HTML generado.
- Los datos citables aparecen literalmente en al menos 3 páginas diferentes.
- Las primeras 2 líneas de al menos 5 secciones responden directamente a la pregunta del heading.
- `npm run build` sin errores.

---

## [DONE] 16. Crear landing `/pais/[slug]` (25 países)

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Crear 25 páginas estáticas por país que ataquen el keyword "viaje en grupo a [país]" — la prioridad P0 del diagnóstico de gaps de contenido.

**Descripción humana:** Cuando alguien busque "viaje en grupo a Tailandia" en Google, debería llegar a una página dedicada a Tailandia con todos los destinos de ese país, viajes próximos, información práctica y preguntas frecuentes. Actualmente no existe esta agrupación por país.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/pais/[slug].astro`
- `getStaticPaths()` genera rutas desde los países únicos en `travel-data.ts` → `countries[]`.
- **Contenido por página:**
  - Hero con imagen del país + H1: "Viajes en grupo a [País] para jóvenes — Travelhood"
  - Texto editorial sobre el país (200-300 palabras): por qué viajar allí con Travelhood.
  - Grid de destinos del país (filtrar `destinations` por `countryId`).
  - Viajes próximos en ese país (filtrar `trips` por destinos del país).
  - GEODataBlock con datos del país: nº destinos, rango precios, duración media, mejor época.
  - FAQs sobre viajar al país (3-5 FAQs) + schema FAQPage.
  - CTA: "Reserva tu viaje a [País]".
- Breadcrumbs: Home > [Continente] > [País].
- Meta tags SEO: `seoTitle`, `seoDescription` específicos del país.
- **Datos:** Puede ser necesario ampliar las interfaces en `travel-data.ts` para añadir `seoTitle`, `seoDescription`, `editorial` y `faqs` por país (interfaz `Country`).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → interfaz `Country` y array `countries[]`.
- Reutilizar patrón de `src/pages/destinos/[slug].astro` (continentes).
- Lectura de `.cursor/rules/identidad-corporativa.mdc` para identidad visual.
- `npm run build` para verificar generación de las 25 rutas.

**Validación:**
- `npm run build` genera 25 HTMLs bajo `/pais/`.
- Cada página tiene H1 único, editorial, grid de destinos y FAQs con schema.
- Los breadcrumbs son correctos (Home > Continente > País).
- `npm run build` sin errores.

---

## [DONE] 17. Crear landing `/cuando-viajar-a/[slug]`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear landings long-tail para el keyword "mejor época para viajar a [destino]" — prioridad P1 con alto volumen de búsqueda.

**Descripción humana:** Cuando alguien busca "mejor época para viajar a Japón" en Google, debería encontrar una página de Travelhood con información detallada sobre el clima, las temporadas y cuándo es mejor ir. Esto atrae tráfico informacional que luego se puede convertir en reservas.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/cuando-viajar-a/[slug].astro`
- `getStaticPaths()` genera rutas desde `destinations[]`.
- **Contenido por página:**
  - H1: "¿Cuándo es la mejor época para viajar a [Destino]?"
  - Tabla de clima por mes (si los datos existen en `destination-details.ts` o `travel-data.ts`).
  - Recomendación de mejor época basada en el campo `climate` del destino.
  - Viajes disponibles filtrados por temporada.
  - GEODataBlock con datos del destino.
  - Internal linking: enlace a `/destino/[slug]`, `/pais/[slug]`, `/destinos/[continente]`.
  - FAQs sobre cuándo viajar (2-3) + schema FAQPage.
- Breadcrumbs: Home > [Destino] > Cuándo viajar.
- **Datos:** Puede ser necesario añadir datos de clima mensual a la interfaz `Destination` en `travel-data.ts` o `destination-details.ts`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → `Destination`, campo `climate`.
- Lectura de `src/lib/destination-details.ts` para datos adicionales.
- `npm run build`.

**Validación:**
- `npm run build` genera HTMLs bajo `/cuando-viajar-a/`.
- Cada página tiene H1 interrogativo, recomendación de temporada y links internos.
- `npm run build` sin errores.

---

## [DONE] 18. Crear landing `/presupuesto/[slug]`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear landings long-tail para el keyword "cuánto cuesta viajar a [destino]" — prioridad P1 con alto volumen de búsqueda.

**Descripción humana:** Cuando alguien busca "cuánto cuesta viajar a Marruecos" en Google, debería encontrar una página con un desglose detallado del presupuesto: precio del viaje, vuelos estimados, gastos extra, etc.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/presupuesto/[slug].astro`
- `getStaticPaths()` genera rutas desde `destinations[]`.
- **Contenido por página:**
  - H1: "¿Cuánto cuesta viajar a [Destino] en grupo? — Presupuesto 2026"
  - Desglose de costes: precio del viaje (desde X€), vuelos estimados (rango), gastos extra estimados.
  - Tabla comparativa: temporada alta vs. baja (si aplica).
  - Qué incluye y qué no incluye el precio del viaje.
  - GEODataBlock con datos de presupuesto.
  - Trips disponibles con precios.
  - Internal linking: enlace a `/destino/[slug]`, `/ofertas/`.
  - FAQs sobre presupuesto (2-3) + schema FAQPage.
- Breadcrumbs: Home > [Destino] > Presupuesto.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → `Trip`, campos `priceFrom`.
- Lectura de `src/lib/destination-details.ts` → `tripExtras` con precios.
- `npm run build`.

**Validación:**
- `npm run build` genera HTMLs bajo `/presupuesto/`.
- Cada página tiene desglose de costes y datos reales de `travel-data.ts`.
- `npm run build` sin errores.

---

## [DONE] 19. Crear landing `/opiniones`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear una página centralizada de opiniones/testimoniales de Travelhood para el keyword "travelhood opiniones" — importante para la reputación online y la marca.

**Descripción humana:** Cuando alguien busca "travelhood opiniones" en Google, debería encontrar una página nuestra con todos los testimonios reales de nuestros viajeros, con sus nombres, destinos y valoraciones. Esto genera confianza y mejora la reputación.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/opiniones.astro`
- **Contenido:**
  - H1: "Opiniones de Travelhood — Lo que dicen nuestros viajeros"
  - Todos los testimoniales de `travel-data.ts` → `testimonials[]`, mostrados como cards.
  - Filtros por destino (opcional, client-side).
  - Schema `AggregateRating` con el promedio real.
  - Cada testimonial con nombre, edad, ciudad, destino, valoración (si los datos lo permiten).
  - GEODataBlock: nº de opiniones, valoración media, % que repiten.
  - CTA: "Vive tu propia experiencia".
- Breadcrumbs: Home > Opiniones.
- Schema `Review` individual por testimonial si los datos son suficientes.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → `testimonials[]`, interfaz `Testimonial`.
- Reutilizar patrón de `src/components/TestimonialsSection.astro`.
- `npm run build`.

**Validación:**
- `dist/opiniones/index.html` existe.
- La página muestra todos los testimoniales disponibles.
- Schema `AggregateRating` presente en el HTML.
- `npm run build` sin errores.

---

## [DONE] 20. Crear landing `/viajes-para-mujeres`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear una landing dedicada para el keyword "viajes para mujeres solas" — alto volumen de búsqueda y alta afinidad con el público objetivo de Travelhood.

**Descripción humana:** Muchas mujeres buscan "viajes para mujeres solas" en Google. Esta página es diferente de `/viajar-sola`: mientras esa es emocional y general, esta es más práctica y enfocada en seguridad, destinos recomendados para mujeres y testimonios de viajeras.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/viajes-para-mujeres.astro`
- **Contenido:**
  - H1: "Viajes para mujeres — Viaja en grupo con total confianza"
  - Por qué Travelhood es ideal para mujeres que viajan solas.
  - Destinos recomendados para mujeres (filtrar por seguridad/afinidad).
  - Testimonios de viajeras (filtrar `testimonials` por mujeres si es posible).
  - Datos citables: "El 70% de nuestras viajeras reservan solas", "El 65% de nuestro grupo son mujeres" (datos de ejemplo, ajustar con datos reales).
  - FAQs sobre seguridad, grupo, coordinador + schema FAQPage.
  - GEODataBlock.
  - CTA emocional.
- Breadcrumbs: Home > Viajes para mujeres.
- Internal linking: enlazar a `/viajar-sola/`, destinos recomendados, `/como-funciona/`.
- **Canibalización:** Cuidar que no compita con `/viajar-sola` — esta es más transaccional, aquella más emocional/editorial. Canonical diferente para cada una.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/pages/viajar-sola.astro` para no duplicar contenido.
- Lectura de `src/lib/travel-data.ts` → `testimonials`, `destinations`.
- `npm run build`.

**Validación:**
- `dist/viajes-para-mujeres/index.html` existe.
- El contenido es diferenciado de `/viajar-sola/` (no hay duplicación).
- FAQs con schema, GEODataBlock y testimonios presentes.
- `npm run build` sin errores.

---

## [DONE] 21. Crear landings de comparativas `/comparar/[slug-a]-vs-[slug-b]`

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Crear páginas de comparativa entre destinos populares para keywords como "tailandia o bali", "marruecos o egipto" — prioridad P1 con volumen medio-alto.

**Descripción humana:** Cuando alguien duda entre dos destinos y busca "¿Tailandia o Bali?", debería encontrar una página de Travelhood con una tabla comparativa objetiva: precios, duración, clima, qué incluye cada viaje, y una recomendación.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/comparar/[slug].astro`
  - El slug usa formato `destino-a-vs-destino-b` (ej: `tailandia-vs-bali`).
- **Datos:** Definir en `travel-data.ts` o nuevo archivo `src/lib/comparisons.ts` un array de comparativas:
  ```ts
  const comparisons = [
    { slugA: "tailandia", slugB: "bali" },
    { slugA: "marruecos", slugB: "egipto" },
    { slugA: "japon", slugB: "corea" },
    // ... 5-10 comparativas iniciales
  ]
  ```
- `getStaticPaths()` genera rutas desde el array de comparativas.
- **Contenido por página:**
  - H1: "¿[Destino A] o [Destino B]? — Comparativa para viajeros"
  - Tabla comparativa con criterios: precio, duración, mejor época, tipo de experiencia, nivel de aventura, idioma, seguridad.
  - Resumen "¿Cuál elegir?" con recomendaciones por perfil.
  - Trips disponibles de ambos destinos.
  - GEODataBlock con datos de ambos destinos.
  - FAQs: "¿Es más barato X o Y?", "¿Cuál es más seguro?" + schema FAQPage.
- Breadcrumbs: Home > Comparar > [A] vs [B].
- Internal linking: enlazar a ambos `/destino/[slug]`, sus `/pais/[slug]` y trips.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` → datos de `Destination` para comparar.
- `npm run build`.

**Validación:**
- `npm run build` genera HTMLs bajo `/comparar/` (mínimo 5).
- Cada página tiene tabla comparativa con datos reales.
- Las FAQs tienen schema FAQPage.
- `npm run build` sin errores.

---

## [DONE] 22. Blog posts de alto impacto SEO

Effort: high
Work: auto
Focus: backend

**Objetivo:** Crear los blog posts estratégicos identificados en el concept (sección 6.2) que atacan keywords de alto volumen con intención informacional y transaccional.

**Descripción humana:** Se crean artículos de blog pensados para atraer personas que buscan cosas como "viajes en grupo para jóvenes 2026", "cuánto cuesta viajar a Tailandia" o "viajes semana santa 2026". Cada artículo tiene enlaces a nuestras páginas de destinos y viajes para convertir lectores en reservas.

**Detalle técnico:**
- **Archivo:** `src/lib/blog-data.ts`
- **Posts a crear (según concept sección 6.2):**
  1. "Viajes en grupo para jóvenes 2026 — Guía completa" (keyword: viajes en grupo jóvenes, pillar)
  2. "¿Cuánto cuesta viajar a Tailandia en 2026?" (keyword: cuanto cuesta viajar a tailandia, spoke)
  3. "Mejor época para viajar a Japón" (keyword: mejor epoca viajar japon, spoke)
  4. "Tailandia o Bali: ¿qué viaje elegir?" (keyword: tailandia o bali, comparativa)
  5. "Opiniones de Travelhood: lo que dicen nuestros viajeros" (keyword: travelhood opiniones)
  6. "Viajes Semana Santa 2026 — Destinos y precios" (keyword: viajes semana santa 2026, temporal)
  7. "Los 7 mejores viajes para hacer en agosto" (keyword: viajes agosto, temporal)
- Cada post con `sections[]` (4-6 secciones de 150-250 palabras), `relatedDestinations[]` (mín. 2), `relatedSlugs[]`, `tags[]`.
- **Contenido GEO-optimizado:**
  - Listas con datos concretos ("5 destinos desde 590€").
  - Respuestas directas en las primeras 2 frases.
  - Precios actualizados con fecha.
  - Tablas comparativas donde aplique.
- Internal linking: cada post enlaza a landing de destino, tipo, temporada o página editorial.
- **Cuidado con canibalización:**
  - El post "travelhood opiniones" no debe competir con `/opiniones` — el blog es más editorial, la landing más transaccional.
  - Posts temporales ("Semana Santa 2026") deben enlazar a `/temporada/semana-santa/` como fuente.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/blog-data.ts` para mantener formato existente.
- Lectura de `src/lib/travel-data.ts` para datos reales de precios y destinos.
- `npm run build` para verificar generación de rutas.

**Validación:**
- Los nuevos blog posts aparecen en `/blog/` y tienen sus páginas individuales generadas.
- Cada post tiene `sections.length >= 4`, `relatedDestinations.length >= 2`.
- Los posts temporales enlazan a las landing de temporada correspondientes.
- `npm run build` sin errores.

---

## [DONE] 23. Revisión General y Optimización

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Auditar TODOS los archivos modificados a lo largo de la feature, comparar con `concepts/CONCEPT_mapSEO.md`, buscar inconsistencias, errores de tipado, regresiones y oportunidades de optimización.

**Descripción humana:** Revisión final exhaustiva de todas las mejoras SEO/GEO realizadas. Se comprueba que todo funciona, que no hay errores, que los schemas son válidos, que las nuevas páginas cargan bien y que el resultado final coincide con lo planificado en el concepto original.

**Detalle técnico:**
- **Auditoría de integridad:**
  - Ejecutar `npm run build` — 0 errores, 0 warnings relevantes.
  - Ejecutar `npx tsc --noEmit` — 0 errores de tipado TypeScript.
  - Verificar que el número total de páginas generadas ha crecido respecto al estado previo (post-refactor ~80 → post-mapSEO debería ser ~130+).
  - Comprobar que no hay imports rotos o archivos huérfanos.

- **Auditoría vs. Concept (checklist):**
  - Leer `concepts/CONCEPT_mapSEO.md` completo.
  - [ ] `robots.txt` creado y correcto.
  - [ ] Página 404 funcional y con `noIndex`.
  - [ ] Schema `TravelAgency` reemplaza `Organization`.
  - [ ] `sameAs` con URLs de redes sociales.
  - [ ] `AggregateRating` en Home y destinos.
  - [ ] `FAQPage` schema en TODAS las páginas con FAQs.
  - [ ] `BreadcrumbList` en TODAS las páginas (excepto Home).
  - [ ] Meta keywords dinámicas por página (no hardcoded global).
  - [ ] `Event` schema en trips (destinos y temporadas).
  - [ ] `OfferCatalog` y `Product` con precios en `/ofertas`.
  - [ ] `ItemList` en páginas de listado.
  - [ ] `AboutPage` en `/travelhood`.
  - [ ] `CollectionPage` en `/blog`.
  - [ ] Schema `speakable` implementado.
  - [ ] `hreflang` declarado.
  - [ ] Imágenes migradas a `<Image />` de Astro (o con `width`/`height`).
  - [ ] Fuentes self-hosted (sin Google Fonts).
  - [ ] Hero images con preload.
  - [ ] GEODataBlock en todas las landings principales.
  - [ ] Headings interrogativos en destinos y editoriales.
  - [ ] Datos citables en al menos 3 páginas.
  - [ ] Landing `/pais/[slug]` (25 páginas) creada.
  - [ ] Landing `/cuando-viajar-a/[slug]` creada.
  - [ ] Landing `/presupuesto/[slug]` creada.
  - [ ] Landing `/opiniones` creada.
  - [ ] Landing `/viajes-para-mujeres` creada.
  - [ ] Landings `/comparar/[a]-vs-[b]` creadas (mín. 5).
  - [ ] Blog posts de alto impacto SEO añadidos (mín. 7).
  - [ ] Trailing slashes consistentes.

- **Auditoría de rendimiento:**
  - Verificar que TODAS las páginas nuevas son SSG.
  - Verificar `loading="lazy"` en imágenes no-hero.
  - Verificar que no hay bundles JS innecesariamente grandes.
  - Verificar que las fuentes self-hosted cargan con `font-display: swap`.

- **Auditoría de regresiones:**
  - Verificar que las ~80 páginas del refactor siguen funcionando correctamente.
  - Verificar que la Home mantiene todos sus bloques originales.
  - Verificar que `/viajes` sigue filtrando correctamente.
  - Verificar que los schemas previos no se han roto.

- **Auditoría de canibalización:**
  - Verificar que `/viajar-sola` y `/viajes-para-mujeres` tienen contenido diferenciado.
  - Verificar que posts de blog temporales enlazan a landing de temporada (no al revés).
  - Verificar que `/opiniones` y el blog post de opiniones tienen ángulos diferentes.

- **Optimización:**
  - Identificar código duplicado entre las nuevas plantillas y extraer a componentes reutilizables.
  - Verificar consistencia de estilos con identidad corporativa.
  - Verificar que todos los textos editoriales tienen mínimo 200 palabras (no thin content).
  - Verificar el sitemap actualizado con todas las nuevas rutas.

**Skills/Comandos/Herramientas obligatorias:**
- `npm run build` completo.
- `npx tsc --noEmit` para tipado.
- Lectura de `concepts/CONCEPT_mapSEO.md` para comparación.
- Lectura de `.cursor/rules/identidad-corporativa.mdc` e `identidad-marca.mdc`.
- Grep para verificar schemas en HTML generado (`dist/`).
- Revisión de todos los archivos nuevos y modificados.

**Validación:**
- Build exitoso con ~130+ páginas.
- 0 errores TypeScript.
- Checklist del concept 100% completado.
- No hay regresiones en las ~80 páginas existentes.
- Identidad visual coherente en todas las nuevas páginas.
- Sitemap incluye todas las nuevas rutas.
- Schemas válidos (verificar al menos 5 páginas con Rich Results Test de Google, manual).
