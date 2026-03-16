# ROADMAP: refactor — Arquitectura SEO/GEO para 70-100 páginas indexadas

> **Origen:** `concepts/CONCEPT_refactor.md` (aprobado)
> **Stack:** Astro 5 + React 19 + Tailwind CSS 4 + Vercel (SSG)
> **Datos actuales:** `src/lib/travel-data.ts`, `src/lib/blog-data.ts`, `src/lib/destination-details.ts`
> **Páginas actuales:** 25 → **Objetivo:** ~80 páginas indexables

---

## [DONE] 1. Ampliar modelo de datos para nuevas entidades

Effort: mid
Work: auto
Focus: backend

**Objetivo:** Extender `travel-data.ts` con campos editoriales, FAQs y metadatos SEO en las interfaces y datos de continentes, categorías y temporadas, para que las nuevas plantillas auto-generadas dispongan de contenido único.

**Descripción humana:** Ahora mismo, los continentes, tipos de viaje y temporadas son simples etiquetas sin texto propio. Necesitamos que cada uno tenga una "ficha" completa: un texto editorial, una imagen, preguntas frecuentes y metadatos para buscadores. Así cada nueva página tendrá contenido real y no será una cáscara vacía.

**Detalle técnico:**
- **Archivo principal:** `src/lib/travel-data.ts`
- Extender la interfaz `Continent` con: `editorialIntro: string`, `heroImage: string`, `bestMonths: string`, `faqs: { question: string; answer: string }[]`, `seoTitle: string`, `seoDescription: string`.
- Crear nueva interfaz `TripCategoryData` con: `name: string`, `slug: string`, `editorial: string`, `heroImage: string`, `idealProfile: string`, `faqs: { question: string; answer: string }[]`, `seoTitle: string`, `seoDescription: string`.
- Crear nueva interfaz `SeasonData` con: `name: string`, `slug: string`, `tags: TripTag[]`, `editorial: string`, `heroImage: string`, `faqs: { question: string; answer: string }[]`, `seoTitle: string`, `seoDescription: string`.
- Exportar arrays `tripCategories: TripCategoryData[]` (5 elementos: aventura, playa, cultural, naturaleza, nieve) y `seasons: SeasonData[]` (6 elementos: semana-santa, puentes, verano, septiembre, navidad, fin-de-anio).
- Rellenar los datos existentes en `continents[]` con los nuevos campos (puede ser placeholder que se refine en la tarea de contenido).
- Añadir `"nieve"` como categoría activa en `DestinationCategory` si no existe aún.
- Confirmar que la categoría `nieve` se asigna a Laponia e Islandia en sus respectivos objetos `Destination`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/travel-data.ts` completo para mapear interfaces actuales.
- TypeScript — asegurar tipado estricto sin `any`.
- `npm run build` para verificar que no hay errores de compilación.

**Validación:**
- `npm run build` compila sin errores.
- Importar `tripCategories`, `seasons` y los continentes ampliados desde otro archivo y verificar que TypeScript no marca errores.
- Los 5 continentes, 5 categorías y 6 temporadas exportan datos con todos los campos requeridos.

---

## [DONE] 2. Añadir 10 destinos nuevos a travel-data.ts

Effort: high
Work: auto
Focus: backend

**Objetivo:** Ampliar de 15 a 25 destinos con datos completos (descripciones, highlights, categorías, imágenes) para que las páginas de destino, continentes, tipos y temporadas tengan más contenido real.

**Descripción humana:** Añadimos 10 destinos nuevos al catálogo: Colombia, Jordania, Sri Lanka, India, Turquía, Portugal, Cuba, Tanzania Safari, Namibia y Argentina. Cada uno tendrá su página automática y además aparecerá en las páginas de su continente y tipos de viaje.

**Detalle técnico:**
- **Archivo:** `src/lib/travel-data.ts`
- Añadir 10 nuevos objetos `Country` y 10 nuevos `Destination` según la tabla del concept:
  - Colombia (sudamerica, aventura/cultural)
  - Jordania (asia*, aventura/cultural)
  - Sri Lanka (asia, aventura/naturaleza/cultural)
  - India (asia, cultural/aventura)
  - Turquía (europa*, cultural/playa)
  - Portugal (europa, playa/cultural)
  - Cuba (centroamerica, cultural/aventura)
  - Tanzania Safari (africa, aventura/naturaleza)
  - Namibia (africa, aventura/naturaleza)
  - Argentina (sudamerica, aventura/naturaleza)
- Cada destino necesita: `id`, `name`, `slug`, `countryId`, `continentId`, `description` (150-200 palabras), `shortDescription`, `heroImage`, `highlights[]` (5-6 items), `idealFor`, `climate`, `categories[]`.
- **Archivo:** `src/lib/destination-details.ts`
  - Añadir entradas en `destinationPhotos` para los 10 nuevos slugs.
  - Añadir entradas en `destinationFaqs` con 3-4 FAQs por destino.
- Opcionalmente añadir 1-2 trips de ejemplo por destino nuevo con tags de temporada y datos de coordinador.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura completa de `src/lib/travel-data.ts` y `src/lib/destination-details.ts`.
- Mantener coherencia con el formato de los 15 destinos existentes.
- `npm run build` para compilar.

**Validación:**
- `destinations.length >= 25` tras el cambio.
- Cada nuevo destino tiene `categories`, `highlights`, `description` no vacíos.
- `npm run build` sin errores.
- La página `/destino/[slug]` genera las 25 rutas estáticas (`getStaticPaths` devuelve 25 elementos).

---

## [DONE] 3. Crear plantilla de continentes `/destinos/[slug].astro`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear la plantilla Astro que genere 5 páginas estáticas de continentes, cada una con contenido editorial, grid de destinos filtrados, viajes próximos y FAQs.

**Descripción humana:** Creamos una nueva sección del sitio web. Al entrar en `/destinos/europa`, por ejemplo, se verá una página dedicada a los viajes a Europa con una introducción editorial, una tabla de mejor época, las tarjetas de destinos europeos y las próximas salidas. Lo mismo para Asia, África, etc.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/destinos/[slug].astro`
- `getStaticPaths()` genera rutas desde `continents[]`, filtrando solo los que tienen al menos 1 destino asociado.
- Contenido de la página (según concept sección 3.A):
  - Hero con `heroImage` del continente + H1: "Viajes en grupo a [Continente] para jóvenes de 20 a 35 años"
  - Texto editorial (`editorialIntro`) — 250-350 palabras
  - Tabla "Mejor época para cada destino" (`bestMonths` del continente)
  - Grid de destinos filtrados por `continentId` — reutilizar patrón de cards de destino existente (ver `SearchPage.tsx` / `TripDetailPage.tsx` para referencia de diseño)
  - Viajes próximos en ese continente (filtrar `trips[]` por `destinationId` → destinos del continente)
  - FAQ con schema FAQPage (reutilizar componente `FAQSection.tsx` o `accordion.tsx`)
  - CTA final
- Breadcrumbs: Home > Destinos > [Continente]
- Meta tags: `seoTitle`, `seoDescription` del continente
- Seguir identidad visual del proyecto (consultar `.cursor/rules/identidad-corporativa.mdc` e `identidad-marca.mdc`)

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/pages/destino/[slug].astro` como referencia de patrón `getStaticPaths`.
- Lectura de componentes existentes (`FAQSection.tsx`, `accordion.tsx`, `SearchPage.tsx`) para reutilizar patrones.
- Lectura de `.cursor/rules/identidad-corporativa.mdc` e `identidad-marca.mdc` para paleta y tipografía.
- `npm run build` para verificar generación de las 5 rutas estáticas.

**Validación:**
- `npm run build` genera `/destinos/europa/index.html`, `/destinos/asia/index.html`, etc.
- Cada página tiene H1 único, contenido editorial, grid de destinos y FAQs.
- No se genera página para continentes sin destinos (ej. Oceanía).
- `npm run dev` — verificar visualmente al menos una página.

---

## [DONE] 4. Crear plantilla de tipos de viaje `/tipos/[slug].astro`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Generar 5 páginas estáticas por tipo de viaje (aventura, playa, cultural, naturaleza, nieve), cada una con destinos filtrados por categoría y contenido editorial propio.

**Descripción humana:** Cuando alguien busque "viajes de aventura en grupo", llegará a una página que muestra todos los destinos de aventura, con un texto explicativo, perfil del viajero ideal y los próximos viajes de ese tipo.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/tipos/[slug].astro`
- `getStaticPaths()` genera rutas desde `tripCategories[]`.
- Filtrar destinos: `destinations.filter(d => d.categories.includes(category.slug))`.
- Contenido (según concept sección 3.B):
  - Hero + H1: "Viajes de [tipo] en grupo para jóvenes"
  - Editorial (200 palabras)
  - "¿Para quién es este tipo de viaje?" — idealProfile
  - Grid de destinos filtrados
  - Próximos viajes de este tipo
  - FAQ (schema FAQPage)
  - CTA
- Breadcrumbs: Home > Tipos de viaje > [Tipo]
- Meta tags desde `seoTitle`/`seoDescription` de `TripCategoryData`.

**Skills/Comandos/Herramientas obligatorias:**
- Reutilizar patrón de `src/pages/destinos/[slug].astro` (creado en tarea anterior).
- `npm run build` para verificar 5 rutas.

**Validación:**
- `npm run build` genera 5 HTMLs bajo `/tipos/`.
- Cada página muestra solo los destinos que tienen la categoría correspondiente.
- `npm run dev` — verificar visualmente.

---

## [DONE] 5. Crear plantilla de temporadas `/temporada/[slug].astro`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Generar 6 páginas estáticas de temporadas (semana-santa, puentes, verano, septiembre, navidad, fin-de-anio) con viajes filtrados por tags y contenido editorial.

**Descripción humana:** Si alguien busca "viajes grupo verano 2026", encontrará una página con todos los viajes de verano, fechas, precios y un texto explicativo. Si no hay viajes de esa temporada, se mostrará un formulario para recibir avisos.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/temporada/[slug].astro`
- `getStaticPaths()` genera rutas desde `seasons[]`.
- Filtrar trips: `trips.filter(t => season.tags.some(tag => t.tags.includes(tag)))`.
- Contenido (según concept sección 3.C):
  - Hero estacional + H1: "Viajes en grupo [Temporada] 2026 para jóvenes"
  - Editorial evergreen (150-200 palabras)
  - Viajes filtrados con plazas visibles
  - Tabla fechas × destinos × precios
  - Si no hay viajes: formulario de captación (reutilizar `LeadMagnet.tsx`)
  - FAQ estacional (schema FAQPage)
  - CTA de urgencia
- Breadcrumbs: Home > Temporada > [Temporada]
- Meta tags desde `SeasonData`.
- La temporada "puentes" agrupa los tags `puente-mayo`, `puente-octubre`, `puente-noviembre`.

**Skills/Comandos/Herramientas obligatorias:**
- Reutilizar patrón de plantillas anteriores.
- Reutilizar `LeadMagnet.tsx` para el caso sin viajes.
- `npm run build`.

**Validación:**
- `npm run build` genera 6 HTMLs bajo `/temporada/`.
- La página de puentes incluye viajes con cualquiera de los 3 tags `puente-*`.
- Temporadas sin viajes muestran formulario de captación.

---

## [DONE] 6. Crear página de ofertas `/ofertas.astro`

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Crear una página estática que muestre automáticamente todos los viajes con `promoPrice` activo, ordenados por porcentaje de descuento.

**Descripción humana:** Una página tipo "Outlet" que muestra las últimas plazas con descuento. El usuario ve el precio original tachado, el precio de oferta y cuántas plazas quedan.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/ofertas.astro`
- Filtrar `trips` donde `promoPrice` o `promoLabel` existan (cruzar con `destination-details.ts` → `tripExtras`).
- Ordenar por `(1 - promoPrice/priceFrom)` descendente (mayor descuento primero).
- Contenido (según concept sección 3.D):
  - Hero: "Últimas plazas con descuento — Viajes en grupo para jóvenes"
  - Grid de cards: precio tachado, precio promo, % descuento, plazas restantes, badge urgencia
  - Filtros ligeros (continente, duración) — puede ser client-side con React island
  - "¿Por qué ahora?" — 3 razones evergreen
  - Schema `Offer` en cada viaje
- Meta tags SEO optimizados para "viajes baratos en grupo jóvenes".

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/destination-details.ts` para entender `tripExtras` y `promoPrice`.
- Reutilizar patrones de cards de `SearchPage.tsx`.
- `npm run build`.

**Validación:**
- `npm run build` genera `/ofertas/index.html`.
- Solo aparecen viajes con descuento real.
- Precio tachado + precio promo visibles.

---

## [DONE] 7. Crear página editorial `/como-funciona.astro`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear una página estática de tipo editorial que explique paso a paso cómo funciona un viaje con Travelhood, con comparativa y FAQs extensas.

**Descripción humana:** Una página que resuelve la pregunta "¿Cómo funciona esto?" con un proceso visual paso a paso, qué incluye y qué no, una tabla comparativa con viajar solo vs. agencia tradicional vs. Travelhood, y muchas preguntas frecuentes.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/como-funciona.astro`
- Contenido (según concept sección 3.E):
  - Hero: "Así funciona un viaje con Travelhood"
  - Proceso paso a paso visual (5 pasos con iconos Lucide): Elige → Reserva → Grupo → Coordinador → Viaja
  - "¿Qué incluye un viaje?" — lista con iconos
  - "¿Qué NO incluye?" — transparencia
  - Tabla comparativa 3 columnas (Viajar solo vs. Agencia tradicional vs. Travelhood)
  - FAQ detallada (8-10 preguntas, schema HowTo + FAQPage) — reutilizar `accordion.tsx`
  - Datos citables GEO: "El grupo medio tiene 14 personas", "El 98% repetirían"
  - CTA: "Elige tu primer viaje"
- Puede reutilizar `HowItWorksSection.astro` parcialmente o crear componentes nuevos.
- Breadcrumbs: Home > Cómo funciona.
- Meta tags SEO.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/components/HowItWorksSection.astro` para reutilizar/extender.
- Lectura de `.cursor/rules/identidad-corporativa.mdc` para colores y tipografía.
- Iconos: `lucide-react`.
- `npm run build`.

**Validación:**
- `npm run build` genera `/como-funciona/index.html`.
- La página contiene los 5 pasos, tabla comparativa y FAQs.
- Verificar visualmente en `npm run dev`.

---

## [DONE] 8. Crear página editorial `/viajar-sola.astro`

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Crear la página diferenciadora clave "Viajar sola" que ataque un hueco competitivo que WeRoad no cubre, con contenido emocional, testimonios y destinos recomendados.

**Descripción humana:** Esta es una de las páginas más importantes del sitio. Habla directamente a las personas (especialmente mujeres) que quieren viajar pero no tienen con quién. Incluye testimonios reales, datos citables y destinos perfectos para un primer viaje.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/viajar-sola.astro`
- Contenido (según concept sección 3.F):
  - Hero emocional: "¿No tienes con quién ir? Nosotros tenemos el grupo."
  - "No estás sola" — cómo funciona cuando vas sin conocer a nadie
  - Datos citables GEO: "El 70% vienen solos. El 98% repiten."
  - Testimonios filtrados (reutilizar `TestimonialsSection.astro` o componente similar)
  - "Destinos perfectos para tu primer viaje solo/a" — grid de 5 destinos recomendados
  - FAQ emocional: "¿Es seguro?", "¿Haré amigos?", etc.
  - Schema FAQPage
  - CTA: "Tu primera aventura empieza aquí"
- Breadcrumbs: Home > Viajar sola.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/components/TestimonialsSection.astro` para reutilizar.
- Lectura de `src/lib/travel-data.ts` → `testimonials[]` para filtrar relevantes.
- `npm run build`.

**Validación:**
- `npm run build` genera `/viajar-sola/index.html`.
- La página contiene testimonios, datos citables y grid de destinos.
- Verificar que las FAQs usan schema FAQPage.

---

## [DONE] 9. Crear página editorial `/preguntas-frecuentes.astro`

Effort: low
Work: auto
Focus: fullstack

**Objetivo:** Crear la página central de FAQ con todas las preguntas agrupadas por categoría, usando accordions y schema FAQPage completo.

**Descripción humana:** Una página con todas las preguntas frecuentes organizadas por temas: El viaje, Reservas y pagos, El grupo, Seguro y cancelaciones, Coordinador. Cada respuesta enlaza a la página interna relevante.

**Detalle técnico:**
- **Nuevo archivo:** `src/pages/preguntas-frecuentes.astro`
- Contenido (según concept sección 3.G):
  - FAQs en 5 bloques temáticos
  - Reutilizar `src/components/ui/accordion.tsx`
  - Schema FAQPage completo con TODAS las preguntas
  - Cada respuesta con interlinking a páginas internas (destinos, `/como-funciona`, `/viajar-sola`)
  - CTA contextual entre bloques
- Breadcrumbs: Home > Preguntas frecuentes.

**Skills/Comandos/Herramientas obligatorias:**
- Reutilizar `src/components/ui/accordion.tsx` y `src/components/FAQSection.tsx`.
- `npm run build`.

**Validación:**
- `npm run build` genera `/preguntas-frecuentes/index.html`.
- Las FAQs se renderizan con accordions funcionales.
- Schema FAQPage presente en el HTML generado.

---

## [DONE] 10. Añadir 15 blog posts nuevos a blog-data.ts

Effort: high
Work: auto
Focus: backend

**Objetivo:** Ampliar de 6 a 21 blog posts con artículos SEO-optimizados que interlinken con destinos, landings de tipos/temporadas y páginas editoriales.

**Descripción humana:** Se añaden 15 artículos nuevos al blog, cada uno pensado para capturar una keyword específica. Cada artículo enlaza a al menos 2 destinos y 1 página interna del sitio.

**Detalle técnico:**
- **Archivo:** `src/lib/blog-data.ts`
- Añadir 15 nuevos objetos `BlogPost` según la tabla del concept (sección 3.I):
  1. "Los 10 mejores destinos para tu primer viaje en grupo"
  2. "Viajes en grupo vs. viajar por tu cuenta: comparativa real"
  3. "¿Cuánto cuesta un viaje en grupo? Presupuesto real 2026"
  4. "Mejores destinos para Semana Santa en grupo"
  5. "Viajes de aventura para jóvenes: los que más repiten"
  6. "Qué hacer si no conoces a nadie en un viaje en grupo"
  7. "Guía de Marruecos para jóvenes: todo lo que necesitas"
  8. "Guía de Japón para jóvenes: todo lo que necesitas"
  9. "Guía de Tailandia para jóvenes: todo lo que necesitas"
  10. "Guía de Bali para jóvenes: todo lo que necesitas"
  11. "Los mejores viajes de playa en grupo para jóvenes"
  12. "Cómo elegir tu primer viaje en grupo (sin equivocarte)"
  13. "Viajar en grupo en verano: guía completa 2026"
  14. "Viajes baratos en grupo: destinos por menos de 1.000€"
  15. "Qué llevar en la maleta para un viaje de aventura"
- Cada post: `slug`, `title`, `excerpt`, `metaDescription`, `category`, `image`, `imageAlt`, `date`/`dateISO`, `readTime`, `featured`, `author`, `relatedDestinations[]` (mín. 2), `relatedSlugs[]` (mín. 1), `tags[]`, `sections[]` (4-6 secciones con heading, body de 150-250 palabras cada una).
- Los `relatedDestinations` y CTAs deben apuntar a las nuevas páginas (`/tipos/*`, `/temporada/*`, `/como-funciona`, `/viajar-sola`).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/blog-data.ts` completo para mantener el formato de los posts existentes.
- `npm run build`.

**Validación:**
- `blogPosts.length >= 21`.
- Cada post nuevo tiene `sections.length >= 4`, `relatedDestinations.length >= 2`.
- `npm run build` sin errores — se generan 21 rutas `/blog/[slug]`.

---

## [DONE] 11. Implementar schemas JSON-LD globales y por página

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Añadir structured data (JSON-LD) en todas las páginas según su tipo para obtener rich results en Google y optimizar para GEO/SGE.

**Descripción humana:** Añadimos "etiquetas invisibles" que los buscadores y las IAs leen para entender mejor el contenido. Esto puede hacer que las páginas aparezcan con estrellas, precios o preguntas frecuentes directamente en los resultados de Google.

**Detalle técnico:**
- **Archivo a modificar:** `src/layouts/Layout.astro` — añadir slot o prop para inyectar JSON-LD por página.
- Schemas a implementar (según concept sección 7):

| Schema | Páginas | Implementación |
|--------|---------|----------------|
| `Organization` | Home (`/`), About (`/travelhood`) | En Layout o en cada página vía `<slot name="head">` |
| `WebSite` + `SearchAction` | Home | En `index.astro` |
| `BreadcrumbList` | Todas las páginas (excepto Home) | Componente reutilizable `Breadcrumbs.astro` |
| `FAQPage` | Todas las páginas con FAQs | Función helper `generateFaqSchema()` |
| `HowTo` | `/como-funciona` | En la página |
| `TouristDestination` | `/destino/[slug]` | En la página |
| `Product` + `Offer` | `/destino/[slug]`, `/ofertas` | En la página, con `promoPrice` si existe |
| `Article` | `/blog/[slug]` | En la página |
| `AggregateRating` | `/destino/[slug]` | En la página, usando `testimonials` promedio |
| `ItemList` | `/viajes` | En la página |

- **Nuevo archivo helper:** `src/lib/schemas.ts` — funciones helper para generar cada tipo de schema JSON-LD.
- **Nuevo componente:** `src/components/Breadcrumbs.astro` — breadcrumbs visuales + schema `BreadcrumbList`.
- Integrar breadcrumbs en TODAS las páginas excepto Home.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/layouts/Layout.astro` para entender el slot `head`.
- Conocimiento de schemas JSON-LD de schema.org.
- `npm run build` + verificar que el HTML generado contiene `<script type="application/ld+json">`.

**Validación:**
- `npm run build` sin errores.
- HTML de la home contiene schemas `Organization` y `WebSite`.
- HTML de `/destino/japon` contiene `TouristDestination`, `BreadcrumbList`, `FAQPage`.
- HTML de `/blog/[slug]` contiene `Article`.
- Validar al menos 3 páginas con la herramienta de Rich Results de Google (manual).

---

## [DONE] 12. Mejorar meta tags, Open Graph y canonical en todas las páginas

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Asegurar que cada página tenga `<title>`, `<meta description>`, Open Graph completo, Twitter Card y canonical tag únicos y optimizados.

**Descripción humana:** Cada página del sitio necesita sus propias etiquetas para que cuando se comparta en redes sociales se vea bien (con imagen, título y descripción correctos), y para que Google sepa cuál es la URL "oficial" de cada página.

**Detalle técnico:**
- **Archivo a modificar:** `src/layouts/Layout.astro`
  - Ampliar la interfaz `Props` con: `ogImage?: string`, `ogUrl?: string`, `canonical?: string`, `noIndex?: boolean`.
  - Añadir meta tags: `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `<link rel="canonical">`.
- **Todas las páginas:** Pasar props completas a `<Layout>`:
  - `title` — único por página, con keyword + "| Travelhood"
  - `description` — 150-160 chars, con keyword
  - `ogImage` — imagen relevante de la página
  - `canonical` — URL completa
- **Página `/viajes`:** Canonical estricta sin parámetros de filtro.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/layouts/Layout.astro`.
- Edición de TODAS las páginas en `src/pages/` para pasar los nuevos props.
- `npm run build`.

**Validación:**
- Cada HTML generado tiene `<title>` único.
- Cada HTML tiene `og:title`, `og:description`, `og:image`, `og:url`.
- Cada HTML tiene `<link rel="canonical">`.
- No hay dos páginas con el mismo `<title>`.

---

## [DONE] 13. Mejorar páginas existentes (Home, Destino, Blog, Viajes, About)

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Actualizar las páginas actuales con mejoras SEO, interlinking a las nuevas secciones y bloques de navegación adicionales según el concept.

**Descripción humana:** Las páginas que ya existen reciben mejoras: la Home añade navegación a continentes, tipos y temporadas. Las páginas de destino añaden enlace a "Otros destinos en [continente]". El blog añade artículos relacionados. La página About añade links a las nuevas secciones.

**Detalle técnico:**

**Home (`/` — `src/pages/index.astro`):**
- Nuevo bloque: navegación rápida a continentes (5 cards → `/destinos/[slug]`)
- Nuevo bloque: navegación a tipos de viaje (5 cards → `/tipos/[slug]`)
- Nuevo bloque: "Viajes por temporada" con links a `/temporada/[slug]`
- Sección ofertas destacadas (viajes con `promoPrice`, max 3-4)
- Puede crear componentes Astro nuevos: `ContinentNav.astro`, `TypeNav.astro`, `SeasonNav.astro`

**Destino (`/destino/[slug]` — `src/pages/destino/[slug].astro`):**
- Añadir breadcrumbs: Home > [Continente] > [Destino]
- Bloque "Otros destinos en [continente]" al final (interlinking horizontal)
- Open Graph tags optimizados (imagen del destino)

**Blog (`/blog` y `/blog/[slug]`):**
- Bloque "Artículos relacionados" al final de cada post
- Tabla de contenidos automática en artículos con 4+ secciones

**Viajes (`/viajes`):**
- Canonical tag estricta

**About (`/travelhood`):**
- Links a `/como-funciona` y `/viajar-sola`

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de todas las páginas en `src/pages/`.
- Lectura de componentes existentes para no duplicar.
- `npm run build`.

**Validación:**
- Home muestra bloques de continentes, tipos y temporadas.
- Destinos tienen breadcrumbs y "Otros destinos en [continente]".
- Blog posts tienen artículos relacionados.
- `npm run build` sin errores.

---

## [DONE] 14. Generar sitemap.xml dinámico

Effort: low
Work: auto
Focus: backend

**Objetivo:** Configurar Astro para generar automáticamente un `sitemap.xml` que incluya TODAS las rutas del sitio con prioridades y lastmod.

**Descripción humana:** El sitemap es un archivo que le dice a Google todas las páginas que tiene el sitio y cuáles son las más importantes. Así Google indexa todo más rápido.

**Detalle técnico:**
- Instalar `@astrojs/sitemap` como integración.
- **Archivo:** `astro.config.mjs` — añadir integración sitemap con configuración:
  - `site: 'https://travelhood.es'` (o el dominio definitivo)
  - Prioridades según concept: Home (1.0), Destinos (0.9), Continentes/Tipos (0.8), Temporadas (0.8), Blog (0.7)
- Configurar `filter` para excluir páginas que no deben indexarse (si las hay).
- Verificar que el sitemap incluye todas las ~80 rutas.

**Skills/Comandos/Herramientas obligatorias:**
- `npm install @astrojs/sitemap`
- Edición de `astro.config.mjs`.
- `npm run build` — verificar que `dist/sitemap-index.xml` y `dist/sitemap-0.xml` existen.

**Validación:**
- `dist/sitemap-index.xml` existe tras el build.
- El sitemap contiene ~80 URLs.
- Las prioridades están correctamente asignadas.

---

## [DONE] 15. Implementar interlinking global según mapa del concept

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Asegurar que cada página enlaza a mínimo 3 páginas internas, siguiendo el mapa de interlinking del concept para maximizar el link juice y la navegabilidad.

**Descripción humana:** Cada página del sitio debe tener enlaces a otras páginas relevantes. Los destinos enlazan a su continente, sus tipos y un artículo de blog. Los posts de blog enlazan a destinos y landings. Esto mejora el SEO y ayuda al usuario a navegar.

**Detalle técnico:**
- **Regla del concept:** "Cada página enlaza a mínimo 3 páginas internas."
- Revisar el mapa de interlinking (concept sección 9) y asegurar que:
  - Cada destino enlaza a: su continente (`/destinos/[slug]`), sus tipos (`/tipos/[slug]`), al menos 1 blog post relacionado.
  - Cada blog post enlaza a: mínimo 2 destinos + 1 landing interna.
  - Las páginas editoriales enlazan a destinos y entre sí.
  - Footer incluye links a todas las secciones principales.
- **Archivo a modificar:** `src/components/Footer.astro` — añadir links a las nuevas secciones (continentes, tipos, temporadas, editoriales).
- Componentes de cada plantilla: añadir bloques de "enlaces relacionados" donde no existan.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/components/Footer.astro`.
- Revisión de todas las plantillas creadas.
- `npm run build`.

**Validación:**
- Cada página generada tiene mínimo 3 links internos (verificar en HTML).
- El footer incluye secciones: Destinos, Tipos, Temporadas, Información (con las nuevas páginas).
- No hay links rotos (`npm run build` no genera warnings de rutas inexistentes).

---

## [DONE] 16. Optimización GEO (Generative Engine Optimization)

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Implementar las técnicas de GEO del concept para maximizar la probabilidad de que las IAs generativas (ChatGPT, Gemini, SGE) citen a Travelhood como fuente.

**Descripción humana:** Añadimos contenido especialmente pensado para que las inteligencias artificiales como ChatGPT o Google SGE mencionen a Travelhood cuando alguien pregunte por viajes en grupo para jóvenes. Esto incluye datos propios, párrafos de respuesta directa y tablas comparativas.

**Detalle técnico:**
- Según concept sección 8:
  - **Párrafos de respuesta directa:** En las primeras 2 líneas de cada sección principal de destinos, `/como-funciona` y `/viajar-sola`, incluir una frase clara que responda directamente a la query (ej: "Travelhood organiza viajes en grupo para jóvenes de 20 a 35 años con coordinador en destino, alojamiento y seguro incluidos.").
  - **Datos citables:** Asegurar que los siguientes datos aparecen en las páginas editoriales:
    - "El 70% de los viajeros de Travelhood reservan solos. El 98% repiten."
    - "El grupo medio tiene 14 personas de 20-35 años."
    - "Cada viaje incluye coordinador, alojamiento, transporte interno y seguro."
    - "Los viajes cuestan entre 590€ y 1.590€, sin vuelo."
  - **Tablas comparativas:** Verificar que `/como-funciona` tiene la tabla de 3 columnas y que los blogs tipo comparativa la incluyen.
  - **Listas ordenadas:** Verificar que los blogs tipo listicle usan listas `<ol>` con schema.
- Revisar que las FAQs con schema están en TODAS las páginas posibles.

**Skills/Comandos/Herramientas obligatorias:**
- Revisión de los HTML generados.
- Lectura de las páginas editoriales creadas.
- `npm run build`.

**Validación:**
- Los datos citables aparecen literalmente en al menos 3 páginas.
- Las FAQs con schema `FAQPage` están en al menos 10 páginas.
- La tabla comparativa existe en `/como-funciona`.

---

## [DONE] 17. Revisión General y Optimización

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Auditar TODOS los archivos modificados a lo largo de la feature, comparar con `concepts/CONCEPT_refactor.md`, buscar inconsistencias, errores de tipado, regresiones y oportunidades de optimización.

**Descripción humana:** Revisión final exhaustiva de todo lo que se ha construido. Se comprueba que todo funciona correctamente, que no hay errores, que las páginas cargan bien y que el resultado final coincide con lo que se planificó en el concepto original.

**Detalle técnico:**
- **Auditoría de integridad:**
  - Ejecutar `npm run build` — 0 errores, 0 warnings relevantes.
  - Verificar que se generan ~80 HTMLs en `dist/`.
  - Comprobar que no hay imports rotos o archivos huérfanos.
  - Ejecutar `npx tsc --noEmit` — 0 errores de tipado TypeScript.

- **Auditoría vs. Concept:**
  - Leer `concepts/CONCEPT_refactor.md` completo.
  - Crear checklist comparando cada sección del concept con lo implementado:
    - [ ] 5 continentes generados
    - [ ] 5 tipos de viaje generados
    - [ ] 6 temporadas generadas
    - [ ] 1 página ofertas
    - [ ] 3 páginas editoriales (como-funciona, viajar-sola, preguntas-frecuentes)
    - [ ] 25 destinos (15 + 10 nuevos)
    - [ ] 21 blog posts (6 + 15 nuevos)
    - [ ] Schemas JSON-LD en todas las páginas según tabla
    - [ ] Sitemap con ~80 URLs
    - [ ] Meta tags, OG, canonical en todas las páginas
    - [ ] Interlinking: cada página enlaza a mín. 3 internas
    - [ ] Breadcrumbs en todas excepto Home
    - [ ] Datos citables GEO presentes
    - [ ] FAQs con schema en todas las páginas posibles

- **Auditoría de rendimiento:**
  - Verificar que todas las páginas son SSG (no SSR).
  - Verificar `loading="lazy"` en imágenes no-hero.
  - Verificar que no hay bundles JS innecesariamente grandes.

- **Auditoría de regresiones:**
  - Verificar que las 25 páginas originales siguen funcionando correctamente.
  - Verificar que la Home mantiene todos sus bloques originales.
  - Verificar que `/viajes` sigue filtrando correctamente.

- **Optimización:**
  - Identificar código duplicado entre plantillas y extraer a componentes reutilizables.
  - Verificar consistencia de estilos con identidad corporativa (`.cursor/rules/identidad-corporativa.mdc`).
  - Verificar que los textos editoriales tienen mínimo 200-300 palabras (no thin content).

**Skills/Comandos/Herramientas obligatorias:**
- `npm run build` completo.
- `npx tsc --noEmit` para tipado.
- Lectura de `concepts/CONCEPT_refactor.md` para comparación.
- Lectura de `.cursor/rules/identidad-corporativa.mdc` e `identidad-marca.mdc`.
- Revisión de todos los archivos nuevos y modificados.

**Validación:**
- Build exitoso con ~80 páginas.
- 0 errores TypeScript.
- Checklist del concept 100% completado.
- No hay regresiones en páginas existentes.
- Identidad visual coherente.
- Todos los textos editoriales cumplen mínimo de palabras.
