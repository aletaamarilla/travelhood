# ROADMAP: addSanity — Panel de Administración con Sanity CMS

> Origen: `concepts/CONCEPT_addSanity.md` (aprobado)

---

## [DONE] 1. Inicialización del proyecto Sanity Studio

**Effort:** mid  
**Work:** manual (necesitas crear el proyecto en sanity.io y obtener el `SANITY_PROJECT_ID`)  
**Focus:** fullstack  

**Objetivo:**  
Crear el proyecto Sanity Studio dentro del monorepo, instalar dependencias y dejarlo operativo en local.

**Descripción humana:**  
Antes de que el panel de administración funcione, hay que crear el "esqueleto" del proyecto. Es como construir la estructura de una casa antes de amueblarla. Necesitarás entrar en sanity.io, crear un proyecto nuevo y copiar el ID que te den.

**Detalle técnico:**  
- Crear directorio `studio/` en la raíz del monorepo.
- Ejecutar `npm create sanity@latest` dentro de `studio/` o inicializar manualmente.
- Configurar `studio/sanity.config.ts` con `projectId`, `dataset: 'production'`, `title: 'Travelhood Studio'`.
- Configurar `studio/sanity.cli.ts`.
- Crear `studio/schemas/index.ts` vacío (se irá populando).
- Crear `studio/package.json` con scripts: `dev`, `build`, `deploy`.
- Añadir variables de entorno al `.env` raíz: `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `SANITY_API_VERSION=2026-03-16`.
- Verificar que `npm run dev` arranca el Studio en `localhost:3333`.

**Skills/Comandos/Herramientas obligatorias:**  
- `npm create sanity@latest` o `npm init sanity@latest`
- Node.js ≥ 18
- Acceso a https://sanity.io/manage para crear proyecto y obtener `projectId`

**Validación:**  
- `cd studio && npm run dev` abre Sanity Studio sin errores.
- El Studio muestra el dashboard vacío (sin schemas).
- El `projectId` está correctamente en `.env`.

---

## [DONE] 2. Schemas base: objetos reutilizables y siteSettings

**Effort:** mid  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear los tipos de objeto reutilizables (`seoFields`, `faqItem`) y el singleton `siteSettings`, que serán la base para todos los demás schemas.

**Descripción humana:**  
Hay campos que se repiten en muchos tipos de contenido (los datos de SEO, las preguntas frecuentes). En vez de escribirlos una y otra vez, los definimos una sola vez y los "enchufamos" donde hagan falta. También creamos la configuración general del sitio (nombre, logo, redes sociales).

**Detalle técnico:**  
- Crear `studio/schemas/objects/seoFields.ts`:
  - Campos: `title` (string, max 60), `description` (text, max 155), `keywords` (string), `ogImage` (image), `noIndex` (boolean, solo para blogPost/landing).
  - Cada campo con `description` en español según la tabla 4.x del concepto.
- Crear `studio/schemas/objects/faqItem.ts`:
  - Campos: `question` (string, required), `answer` (text, required).
  - Descriptions en español.
- Crear `studio/schemas/documents/siteSettings.ts`:
  - Tipo `document`, name `siteSettings`.
  - Campos según tabla 4.1: `siteName`, `siteUrl`, `orgLogo`, `priceRange`, `contactEmail`, `socialLinks[]`, `defaultSeoImage`.
  - `socialLinks` como array de objetos `{platform: string, url: url}`.
- Registrar todos los schemas en `studio/schemas/index.ts`.
- Exportar el array de schemas en `sanity.config.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity Schema API (`defineType`, `defineField`)
- Referencia: sección 4.1 del concepto

**Validación:**  
- El Studio muestra "Site Settings" en el sidebar.
- Se puede crear y guardar un documento siteSettings con todos los campos.
- Los campos muestran las descriptions en español.

---

## [DONE] 3. Schemas geográficos: continent y country

**Effort:** mid  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear los schemas `continent` y `country` con sus relaciones y campos geográficos.

**Descripción humana:**  
Definimos cómo se guardarán los continentes y los países en el panel. Los países pertenecen a un continente, y contienen información útil para el viajero como la moneda, el idioma o si necesita visado.

**Detalle técnico:**  
- Crear `studio/schemas/documents/continent.ts`:
  - Campos según tabla 4.2: `name`, `slug` (auto from name), `editorialIntro`, `heroImage`, `heroImageAlt`, `bestMonths`, `faqs[]` (usa `faqItem`), `seo` (usa `seoFields`).
  - `slug`: `options: { source: 'name' }`.
- Crear `studio/schemas/documents/country.ts`:
  - Campos según tabla 4.3: `name`, `slug`, `continent` (reference → continent), `flag`, `currency`, `currencyRate`, `language`, `timezone`, `visaRequired`, `visaInfo`, `vaccinesRecommended`, `seo`.
  - `continent` con `type: 'reference', to: [{type: 'continent'}]`.
- Registrar en `studio/schemas/index.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `defineType`, `defineField`, `reference` type
- Referencia: secciones 4.2 y 4.3 del concepto

**Validación:**  
- Se pueden crear continentes y países en el Studio.
- Al crear un país, el campo "continente" muestra un selector con los continentes disponibles.
- El slug se genera automáticamente al escribir el nombre.

---

## [DONE] 4. Schema destination

**Effort:** high  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear el schema `destination`, el más complejo del sistema, con datos climáticos por mes, presupuesto diario, coordenadas y SEO derivado.

**Descripción humana:**  
El destino es la pieza central de Travelhood. Aquí se guarda toda la información de un lugar: fotos, clima mes a mes, cuánto cuesta comer allí, las coordenadas para el mapa, las preguntas frecuentes y todos los datos SEO para que Google lo posicione bien.

**Detalle técnico:**  
- Crear `studio/schemas/documents/destination.ts`:
  - Campos base: `name`, `slug`, `country` (ref → country), `continent` (ref → continent), `description`, `shortDescription`, `heroImage`, `heroImageAlt`, `gallery[]` (images con alt), `highlights[]`, `idealFor`, `climate`, `categories[]` (opciones: playa, aventura, cultural, naturaleza, nieve).
  - `climateByMonth[]`: array de objetos con `month` (opciones Ene-Dic), `avgTemp`, `rainfall` (opciones: Baja/Media/Alta), `recommendation` (opciones: Ideal/Buena/Aceptable/No recomendado), `note`.
  - `budgetPerDay{}`: objeto con `mealCostLow`, `mealCostMid`, `beerCost`, `dailyBudget`, `totalExtras`.
  - `coordinates`: tipo `geopoint`.
  - `faqs[]`: reutiliza `faqItem`.
  - `seo`: reutiliza `seoFields` + campos adicionales: `cuandoViajarTitle`, `cuandoViajarDescription`, `presupuestoTitle`, `presupuestoDescription`.
  - Crear object types auxiliares: `studio/schemas/objects/climateMonth.ts`, `studio/schemas/objects/budgetPerDay.ts`.
  - Todas las `description` en español según tabla 4.4.
- Agrupar campos en fieldsets: "Información básica", "Galería", "Datos GEO", "Clima", "Presupuesto", "SEO".
- Registrar en `studio/schemas/index.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `geopoint` type, `fieldsets`, `options.list` para selects
- Referencia: sección 4.4 del concepto

**Validación:**  
- Se puede crear un destino con todos los campos.
- El campo `coordinates` muestra un mapa interactivo para seleccionar el punto.
- Los fieldsets agrupan visualmente los campos.
- Los selects de `climateByMonth` muestran las opciones (Ideal, Buena, etc.).
- Se genera el slug automáticamente.

---

## [DONE] 5. Schemas de viaje: trip y coordinator

**Effort:** mid  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear los schemas `trip` (viaje) y `coordinator` (coordinador/a), con itinerario día a día y gestión de plazas.

**Descripción humana:**  
Los viajes son el producto principal de Travelhood: cada viaje tiene fechas, precios, plazas y un itinerario día a día. Los coordinadores son las personas que lideran cada viaje. Ambos se gestionarán desde el panel.

**Detalle técnico:**  
- Crear `studio/schemas/documents/coordinator.ts`:
  - Campos según tabla 4.6: `name`, `slug`, `age`, `role`, `bio`, `quote`, `image`, `imageAlt`, `destinations[]` (ref → destination).
- Crear `studio/schemas/objects/itineraryDay.ts`:
  - Campos: `day` (number), `title` (string), `description` (string), `lat` (number), `lng` (number).
- Crear `studio/schemas/documents/trip.ts`:
  - Campos según tabla 4.5: `title`, `slug`, `destination` (ref → destination), `departureDate`, `returnDate`, `durationDays`, `priceFrom`, `promoPrice`, `promoLabel`, `flightEstimate`, `totalPlaces`, `placesLeft`, `coordinator` (ref → coordinator), `status` (opciones: open/almost-full/full), `included[]`, `notIncluded[]`, `itinerary[]` (usa `itineraryDay`), `tags[]` (opciones: semana-santa, puente-mayo, verano, septiembre, puente-octubre, puente-noviembre, navidad, fin-de-anio).
  - Fieldsets: "Fechas y precios", "Plazas", "Itinerario", "Promoción".
- Registrar en `studio/schemas/index.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `date` type, `number` type, `options.list` para selects
- Referencia: secciones 4.5 y 4.6 del concepto

**Validación:**  
- Se puede crear un coordinador con foto y bio.
- Se puede crear un viaje vinculado a un destino y coordinador.
- El itinerario permite añadir días con coordenadas opcionales.
- El selector de status muestra las 3 opciones (open, almost-full, full).
- Los tags de temporada se pueden seleccionar.

---

## [DONE] 6. Schemas de comunidad y catálogo: testimonial, tripCategory, season, comparison

**Effort:** mid  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear los 4 schemas restantes de contenido estructurado: testimonios, categorías de viaje, temporadas y comparativas.

**Descripción humana:**  
Estos son los contenidos complementarios: las opiniones de viajeros, los tipos de viaje (aventura, playa...), las temporadas del año (verano, Navidad...) y las comparativas entre destinos (¿Tailandia o Bali?). Todos se gestionarán desde el panel.

**Detalle técnico:**  
- Crear `studio/schemas/documents/testimonial.ts`:
  - Campos según tabla 4.7: `name`, `age`, `city`, `destination` (ref), `quote`, `rating` (1-5), `image`, `imageAlt`, `featured`.
- Crear `studio/schemas/documents/tripCategory.ts`:
  - Campos según tabla 4.8: `name`, `slug`, `editorial`, `heroImage`, `heroImageAlt`, `idealProfile`, `faqs[]`, `seo`.
- Crear `studio/schemas/documents/season.ts`:
  - Campos según tabla 4.9: `name`, `slug`, `tags[]`, `editorial`, `heroImage`, `heroImageAlt`, `faqs[]`, `seo`.
- Crear `studio/schemas/documents/comparison.ts`:
  - Campos según tabla 4.10: `destinationA` (ref), `destinationB` (ref), `slug`, `verdict`, `seo`.
- Registrar todos en `studio/schemas/index.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `defineType`, `reference`, `boolean`, validation `min/max`
- Referencia: secciones 4.7, 4.8, 4.9, 4.10 del concepto

**Validación:**  
- Se pueden crear documentos de cada tipo.
- Los testimonios permiten vincular un destino y puntuar de 1 a 5.
- Las comparativas enlazan dos destinos.
- Todos los campos tienen description en español.

---

## [DONE] 7. Schemas editoriales: blogPost y landingPage

**Effort:** high  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear los schemas `blogPost` y `landingPage`, los más orientados a contenido editorial con secciones dinámicas.

**Descripción humana:**  
Los artículos del blog y las páginas especiales (como "Viajar sola" o "Cómo funciona") necesitan una estructura flexible: secciones con títulos, textos, imágenes y botones. Aquí se define cómo se organizan y qué campos tiene cada uno.

**Detalle técnico:**  
- Crear `studio/schemas/objects/blogSection.ts`:
  - Campos: `heading` (string), `body` (text), `image` (image), `imageAlt` (string), `cta` (object: `text` string + `href` string).
- Crear `studio/schemas/documents/blogPost.ts`:
  - Campos según tabla 4.10: `title`, `slug`, `excerpt`, `category` (opciones: Inspiración, Destinos, Guías, Comunidad), `image`, `imageAlt`, `publishedAt` (datetime), `updatedAt` (datetime), `readTime`, `featured`, `author` (object: `name` + `role`), `relatedDestinations[]` (ref → destination), `relatedPosts[]` (ref → blogPost), `tags[]`, `sections[]` (usa `blogSection`), `seo` (con `metaDescription`, `keywords`, `ogImage`, `noIndex`).
  - Nota: el seo de blogPost tiene `metaDescription` en vez de `description` y añade `noIndex`.
- Crear `studio/schemas/objects/statItem.ts`:
  - Campos: `label` (string), `value` (string).
- Crear `studio/schemas/documents/landingPage.ts`:
  - Campos según tabla 4.12: `title`, `slug` (readOnly), `headline`, `subtitle`, `heroImage`, `heroImageAlt`, `editorial`, `featuredDestinations[]` (ref → destination), `faqs[]`, `stats[]` (usa `statItem`), `seo`.
- Registrar todos en `studio/schemas/index.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `datetime` type, `readOnly`, nested objects
- Referencia: secciones 4.10, 4.11, 4.12 del concepto

**Validación:**  
- Se puede crear un blogPost con múltiples secciones (heading + body + imagen + CTA).
- El campo category muestra las 4 opciones.
- Se pueden vincular destinos y posts relacionados.
- Las landingPages tienen el slug en readOnly.
- Los stats permiten añadir pares label/value.

---

## [DONE] 8. Configuración del Desk Structure del Studio

**Effort:** mid  
**Work:** auto  
**Focus:** frontend  

**Objetivo:**  
Organizar el sidebar del Studio en secciones lógicas con iconos, y configurar el singleton de siteSettings.

**Descripción humana:**  
Ahora que todos los tipos de contenido existen, hay que organizar el menú lateral del panel para que sea fácil de navegar. Se agrupan en secciones: "Contenido Principal", "Catálogo", "Comunidad", etc. También se configura la "Configuración del sitio" para que solo haya un documento (no se puedan crear múltiples).

**Detalle técnico:**  
- Crear `studio/deskStructure.ts` (o `studio/structure.ts`):
  - Importar `StructureBuilder` de `sanity/structure`.
  - Definir grupos según la sección 10 del concepto:
    - 📁 Contenido Principal: continent, country, destination, trip
    - 📁 Catálogo: tripCategory, season, comparison
    - 📁 Comunidad: coordinator, testimonial
    - 📁 Blog: blogPost
    - 📁 Páginas: landingPage
    - ⚙️ Configuración del sitio: siteSettings (singleton editor, no list)
  - Configurar `siteSettings` como singleton usando `S.editor()` sin `S.documentList()`.
- Registrar en `sanity.config.ts` vía `plugins: [structureTool({ structure: ... })]`.
- Añadir `title` en español para cada grupo y tipo de documento visible.
- Agregar iconos representativos con `icon` en cada schema (usar iconos de `react-icons` o iconos inline).

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity `structureTool`, `StructureBuilder`
- `sanity/structure` API
- Opcionalmente `react-icons` para iconos

**Validación:**  
- El sidebar del Studio muestra los grupos organizados con iconos.
- "Configuración del sitio" abre directamente el editor (sin lista).
- Cada grupo contiene los tipos correctos.
- Los títulos de los grupos están en español.

---

## [DONE] 9. Validaciones avanzadas y reglas de negocio

**Effort:** mid  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Añadir validaciones de negocio: longitudes máximas de SEO, slugs protegidos, integridad referencial y alt text obligatorio en galerías.

**Descripción humana:**  
Para evitar errores comunes (títulos SEO demasiado largos, borrar un destino que tiene viajes vinculados, subir fotos sin descripción), se añaden reglas automáticas que avisan a la editora antes de que el problema llegue a la web.

**Detalle técnico:**  
- **SEO max lengths:** En `seoFields.ts`, añadir `validation: Rule => Rule.max(60)` a `title` y `Rule.max(155)` a `description`. Añadir `options: { maxLength: 60 }` para mostrar contador visual.
- **Slug readOnly después de publicar:** En todos los schemas con slug, añadir `readOnly: ({document}) => Boolean(document?._createdAt)` o lógica similar. Incluir `description: '⚠️ No cambiar después de publicar.'`.
- **Alt text obligatorio en gallery:** En `destination.ts`, validar que cada imagen de gallery tenga `alt` definido.
- **Rating 1-5:** En `testimonial.ts`, `validation: Rule => Rule.min(1).max(5)`.
- **shortDescription max 80:** En `destination.ts`, `validation: Rule => Rule.max(80)` para `shortDescription`.
- **Integridad referencial:** Configurar `options: { disableNew: false }` y warnings en references. Considerar validación custom con `client.fetch` para contar referencias antes de borrar (o usar plugin `@sanity/document-internationalization` patterns).
- **FAQs mínimo 3:** `validation: Rule => Rule.min(3)` en arrays de faqs donde aplique.
- **Recordatorio de actualización:** En `season.seo.title` description: "⚠️ Incluir el año (ej: 'Viajes verano 2026')."

**Skills/Comandos/Herramientas obligatorias:**  
- Sanity Validation API (`Rule`)
- `readOnly` condicional
- `options.maxLength` para contadores visuales

**Validación:**  
- Intentar publicar un seo.title de >60 chars muestra error.
- Intentar publicar un destino sin alt en imágenes de gallery muestra error.
- Un rating de 6 es rechazado.
- El slug aparece en readOnly tras la primera publicación (o muestra aviso visible).
- Las FAQs exigen mínimo 3 entradas.

---

## [DONE] 10. Integración del cliente Sanity en Astro

**Effort:** mid  
**Work:** manual (necesitas copiar el `SANITY_PROJECT_ID` a las env vars de Vercel y al `.env` local)  
**Focus:** backend  

**Objetivo:**  
Instalar `@sanity/client` en el proyecto Astro, crear `src/lib/sanity.ts` con el cliente configurado y las primeras queries GROQ.

**Descripción humana:**  
Ahora hay que conectar la web (Astro) con el panel (Sanity). Instalamos una librería que permite hacer consultas a Sanity y creamos un archivo centralizado donde se definen todas esas consultas. Es como crear un "puente" entre el panel de administración y la web.

**Detalle técnico:**  
- Instalar en el proyecto Astro (raíz o donde esté el `package.json` de Astro): `npm install @sanity/client @sanity/image-url`.
- Crear `src/lib/sanity.ts`:
  - Configurar `createClient({ projectId, dataset, apiVersion, useCdn: false })` leyendo de `import.meta.env`.
  - Exportar función helper `sanityFetch<T>(query: string, params?)`.
  - Exportar `imageUrlBuilder` para resolver URLs de imágenes Sanity.
- Crear `src/lib/queries.ts` (o incluir en `sanity.ts`):
  - Queries GROQ para cada tipo de documento. Mínimo inicial:
    - `allContinentsQuery`: `*[_type == "continent"] | order(name asc)`
    - `continentBySlugQuery`: `*[_type == "continent" && slug.current == $slug][0]`
    - `allCountriesQuery`, `countryBySlugQuery`
    - `allDestinationsQuery`, `destinationBySlugQuery`
    - `allTripsQuery`, `tripsByDestinationQuery`
    - `allCoordinatorsQuery`, `coordinatorBySlugQuery`
    - `allTestimonialsQuery`, `featuredTestimonialsQuery`
    - `allBlogPostsQuery`, `blogPostBySlugQuery`
    - `allCategoriesQuery`, `categoryBySlugQuery`
    - `allSeasonsQuery`, `seasonBySlugQuery`
    - `allComparisonsQuery`, `comparisonBySlugQuery`
    - `allLandingPagesQuery`, `landingBySlugQuery`
    - `siteSettingsQuery`: `*[_type == "siteSettings"][0]`
  - Expandir references con GROQ projections (ej: `destination->{name, slug, heroImage}`).
- Definir tipos TypeScript para cada respuesta de query en `src/types/sanity.ts`.
- Añadir env vars a `.env`: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`.
- Añadir las mismas env vars en Vercel Dashboard.

**Skills/Comandos/Herramientas obligatorias:**  
- `npm install @sanity/client @sanity/image-url`
- GROQ query language
- TypeScript interfaces/types
- Variables de entorno en Astro (`import.meta.env`)

**Validación:**  
- Crear un script temporal o test que ejecute `sanityFetch(siteSettingsQuery)` y devuelva datos.
- Los tipos TypeScript coinciden con la estructura de los schemas.
- `imageUrlBuilder` genera URLs válidas para imágenes subidas a Sanity.

---

## [DONE] 11. Migración de páginas: continentes, países y destinos

**Effort:** high  
**Work:** auto  
**Focus:** fullstack  

**Objetivo:**  
Adaptar las páginas Astro de continentes, países y destinos para consumir datos de Sanity en vez de los archivos `.ts` hardcodeados.

**Descripción humana:**  
Aquí empieza la parte visible: las páginas de la web dejan de leer los datos de archivos de código y pasan a leerlos del panel de administración. Empezamos por las páginas geográficas (continentes, países y destinos), incluyendo las sub-páginas de "cuándo viajar" y "presupuesto".

**Detalle técnico:**  
- Identificar las páginas afectadas:
  - `src/pages/destinos/[continent].astro` — listado de destinos por continente
  - `src/pages/destino/[slug].astro` — detalle de destino
  - `src/pages/cuando-viajar/[slug].astro` — cuándo viajar
  - `src/pages/presupuesto/[slug].astro` — presupuesto del destino
  - Cualquier otra página que importe de `travel-data.ts` o `destination-details.ts` datos geográficos.
- En cada página:
  - Reemplazar los imports de `travel-data.ts` / `destination-details.ts` por llamadas a `sanityFetch()` con la query GROQ correspondiente.
  - Adaptar `getStaticPaths()` para generar paths desde Sanity.
  - Adaptar el template para usar los nuevos nombres de campo (ej: `destination.heroImage` → `urlFor(destination.heroImage).url()`).
  - Mantener los archivos `.ts` originales como fallback temporal (no borrarlos aún).
- Adaptar componentes que reciban props de destinos si los tipos cambian.
- Resolver imágenes con `imageUrlBuilder` (función `urlFor()`).

**Skills/Comandos/Herramientas obligatorias:**  
- Astro `getStaticPaths()`
- GROQ queries con projections
- `@sanity/image-url` para resolver URLs
- Referencia: secciones 4.2, 4.3, 4.4 del concepto

**Validación:**  
- `npm run build` compila sin errores.
- Las páginas de continente listan los destinos correctamente.
- Las páginas de destino muestran todos los datos: hero, galería, clima, presupuesto, mapa, FAQs.
- Las sub-páginas cuándo-viajar y presupuesto funcionan.
- Las imágenes de Sanity se muestran correctamente con alt text.

---

## [DONE] 12. Migración de páginas: viajes, coordinadores y temporadas

**Effort:** high  
**Work:** auto  
**Focus:** fullstack  

**Objetivo:**  
Adaptar las páginas de viajes (trips), coordinadores y temporadas para consumir de Sanity.

**Descripción humana:**  
Continuamos conectando más páginas al panel. Ahora las fichas de viaje (con precios, plazas e itinerario), los perfiles de coordinadores y las páginas de temporada (verano, Navidad...) leerán del CMS.

**Detalle técnico:**  
- Páginas de viajes:
  - `src/pages/viajes/index.astro` (o equivalente) — listado general
  - Cualquier componente que muestre cards de viajes o filtros por temporada/destino.
  - Reemplazar imports de `travel-data.ts` → `sanityFetch(allTripsQuery)`.
  - Adaptar la lógica de filtros (por destino, temporada, estado) para funcionar con datos de Sanity.
  - Itinerario: adaptar el componente de itinerario para leer de `trip.itinerary[]`.
  - Mapa del itinerario: las coordenadas ahora vienen de `itinerary[].lat/lng`.
- Páginas de coordinadores:
  - Componente de coordinador en la ficha de viaje.
  - Si existe página dedicada (`/coordinador/[slug]`), adaptarla.
- Páginas de temporada:
  - `src/pages/temporada/[slug].astro` — temporada con viajes filtrados.
  - Query: obtener la temporada + trips que tengan tags coincidentes: `*[_type == "trip" && $tag in tags[]]`.
- Mantener fallback a datos hardcodeados por ahora.

**Skills/Comandos/Herramientas obligatorias:**  
- GROQ filtering y references
- Astro `getStaticPaths()` con queries Sanity
- Leaflet (para mapa de itinerario, si aplica)

**Validación:**  
- El listado de viajes muestra todos los trips con precios y plazas actualizados.
- El filtro por temporada funciona correctamente.
- Las cards de viaje muestran promo si existe (`promoPrice`, `promoLabel`).
- El itinerario día a día se renderiza correctamente.
- Los coordinadores se muestran con foto y bio.
- `npm run build` sin errores.

---

## [DONE] 13. Migración de páginas: blog, comparativas y landing pages

**Effort:** high  
**Work:** auto  
**Focus:** fullstack  

**Objetivo:**  
Adaptar las últimas páginas editoriales para consumir de Sanity: blog, comparativas entre destinos y landing pages.

**Descripción humana:**  
El último grupo de páginas que conectamos: los artículos del blog (con sus secciones), las comparativas (¿Tailandia o Bali?) y las páginas especiales como "Viajar sola" o "Cómo funciona".

**Detalle técnico:**  
- Blog:
  - `src/pages/blog/index.astro` — listado de posts.
  - `src/pages/blog/[slug].astro` — detalle del post.
  - Reemplazar imports de `blog-data.ts` → `sanityFetch(allBlogPostsQuery)`.
  - Renderizar `sections[]` como bloques H2 + body + imagen + CTA.
  - Resolver `relatedDestinations` y `relatedPosts` con GROQ projections.
  - Implementar `publishedAt` y `updatedAt` para schema.org Article.
- Comparativas:
  - `src/pages/comparar/[slug].astro` (o ruta equivalente).
  - Reemplazar imports de `comparisons.ts` → `sanityFetch(comparisonBySlugQuery)`.
  - Expandir `destinationA` y `destinationB` con todos sus datos relevantes en la query GROQ.
- Landing pages:
  - `src/pages/viajar-sola.astro`, `src/pages/viajes-para-mujeres.astro`, etc.
  - Convertir a `src/pages/[landingSlug].astro` dinámico, o mantener rutas estáticas que consulten Sanity por slug fijo.
  - Renderizar `featuredDestinations`, `stats[]`, `faqs[]`, `editorial`.
- Eliminar o marcar como deprecated los imports de `blog-data.ts`, `comparisons.ts`.

**Skills/Comandos/Herramientas obligatorias:**  
- GROQ projections con references expandidas
- Astro dynamic routes o static queries
- schema.org Article markup

**Validación:**  
- El blog lista todos los posts con excerpt, imagen y fecha.
- El detalle del post renderiza todas las secciones correctamente.
- Las comparativas muestran datos de ambos destinos y el veredicto.
- Las landings muestran stats, FAQs, destinos destacados.
- `npm run build` sin errores.

---

## [DONE] 14. Migración de componentes transversales y SEO global

**Effort:** mid  
**Work:** auto  
**Focus:** fullstack  

**Objetivo:**  
Adaptar los componentes compartidos (testimonios, footer, schema.org, SEO global) para consumir de Sanity.

**Descripción humana:**  
Hay piezas de la web que aparecen en muchas páginas a la vez: las opiniones de viajeros en la home, la información del footer, los datos que Google lee para entender la web (schema.org). Ahora se alimentarán del panel.

**Detalle técnico:**  
- **Testimonios:**
  - Componente que muestra testimonios en home y páginas de destino.
  - Query: `featuredTestimonialsQuery` para home, `testimonialsByDestinationQuery` para destino.
  - Adaptar el componente para recibir datos de Sanity (nombre, edad, ciudad, quote, rating, imagen).
- **siteSettings en Layout/Footer:**
  - En `src/layouts/Layout.astro` o componente base, hacer `sanityFetch(siteSettingsQuery)`.
  - Usar `siteName`, `contactEmail`, `socialLinks` en footer.
  - Usar `orgLogo`, `siteUrl`, `priceRange` en schema.org Organization.
  - Usar `defaultSeoImage` como fallback de ogImage.
- **SEO por página:**
  - En cada página, pasar los campos `seo.*` al componente `<Layout>` o `<SEO>`.
  - Adaptar `src/lib/schemas.ts` (schema.org) para leer datos de Sanity en vez de hardcoded.
- **Categorías de viaje (tripCategory):**
  - `src/pages/tipos/[slug].astro` — si existe, adaptarla.
  - Si se usa como filtro, adaptar componentes de filtro.
- Eliminar gradualmente los imports de archivos hardcodeados que ya no se usen.

**Skills/Comandos/Herramientas obligatorias:**  
- GROQ queries
- Astro layouts y props
- schema.org JSON-LD
- Referencia: secciones 4.1, 4.7, 4.8 y sección 5 (Gaps SEO) del concepto

**Validación:**  
- Los testimonios en home se muestran desde Sanity.
- El footer muestra redes sociales y email desde siteSettings.
- Los meta tags (title, description, ogImage) de cada página vienen de Sanity.
- El schema.org Organization tiene datos correctos.
- No quedan imports activos de los archivos `.ts` hardcodeados (o están marcados como fallback).

---

## [DONE] 15. Seed de datos: migración del contenido hardcodeado a Sanity

**Effort:** high  
**Work:** auto  
**Focus:** backend  

**Objetivo:**  
Crear un script de migración que lea los datos actuales de los archivos `.ts` y los cree como documentos en Sanity.

**Descripción humana:**  
Todo el contenido que hoy está en archivos de código (los 25 destinos, los 35 viajes, los 22 artículos del blog...) tiene que pasar al panel de administración. En vez de introducirlo a mano uno por uno, se crea un programa automático que lo hace por nosotros.

**Detalle técnico:**  
- Crear `studio/migrations/seed.ts` (o `scripts/seed-sanity.ts`):
  - Importar los datos de `src/lib/travel-data.ts`, `src/lib/destination-details.ts`, `src/lib/blog-data.ts`, `src/lib/comparisons.ts`.
  - Usar `@sanity/client` con token de escritura para crear documentos.
  - Orden de creación (respetar dependencias):
    1. `siteSettings` (1 documento)
    2. `continent` (~6 documentos)
    3. `country` (~25 documentos, referenciando continents)
    4. `destination` (~25 documentos, referenciando countries y continents)
    5. `coordinator` (~2 documentos)
    6. `trip` (~35 documentos, referenciando destinations y coordinators)
    7. `testimonial` (~6+ documentos, referenciando destinations)
    8. `tripCategory` (~5 documentos)
    9. `season` (~6 documentos)
    10. `blogPost` (~22 documentos)
    11. `comparison` (~7 documentos, referenciando destinations)
    12. `landingPage` (~6 documentos)
  - Para referencias, usar `_ref` con el `_id` del documento creado previamente.
  - Para imágenes: subir assets con `client.assets.upload()` o referenciar URLs externas temporalmente.
  - Mapear los campos del formato actual al formato Sanity (ej: `slug` string → `{_type: 'slug', current: 'valor'}`).
- Añadir script en `package.json`: `"seed": "npx tsx scripts/seed-sanity.ts"`.
- Necesario: token de API con permisos de escritura (obtener en sanity.io/manage → API → Tokens).

**Skills/Comandos/Herramientas obligatorias:**  
- `@sanity/client` mutations API (`createOrReplace`, `createIfNotExists`)
- `client.assets.upload()` para imágenes
- `npx tsx` para ejecutar TypeScript
- Token de API Sanity con write permissions

**Validación:**  
- Ejecutar el script: `npm run seed`.
- Verificar en Sanity Studio que existen todos los documentos esperados.
- Las referencias entre documentos son correctas (ej: un trip apunta a su destination).
- Las imágenes se visualizan correctamente en el Studio.
- Contar documentos: ~6 continentes, ~25 países, ~25 destinos, ~35 trips, ~22 posts, etc.

---

## [DONE] 16. Configuración del webhook Sanity → Vercel Deploy

**Effort:** low  
**Work:** manual (necesitas obtener el Deploy Hook URL de Vercel y configurarlo en Sanity)  
**Focus:** devops  

**Objetivo:**  
Configurar un webhook en Sanity que dispare un rebuild en Vercel automáticamente al publicar contenido.

**Descripción humana:**  
Cuando alguien publique un cambio en el panel (un nuevo viaje, un cambio de precio), la web se tiene que reconstruir automáticamente. Para eso se configura un "aviso automático": Sanity le dice a Vercel "oye, ha cambiado algo" y Vercel regenera la web.

**Detalle técnico:**  
- En **Vercel Dashboard** → Proyecto Travelhood → Settings → Git → Deploy Hooks:
  - Crear un Deploy Hook: nombre "Sanity Publish", branch "main".
  - Copiar la URL generada (ej: `https://api.vercel.com/v1/integrations/deploy/xxx`).
- En **Sanity Dashboard** (sanity.io/manage) → Proyecto → API → Webhooks:
  - Crear webhook: nombre "Vercel Deploy", URL: la URL copiada.
  - Trigger: `create`, `update`, `delete`.
  - Filter (opcional): `_type in ["trip", "destination", "blogPost", "continent", "country", "coordinator", "testimonial", "tripCategory", "season", "comparison", "landingPage", "siteSettings"]`.
  - HTTP method: POST.
- Probar: publicar un cambio en Sanity → verificar que Vercel inicia un deploy.

**Skills/Comandos/Herramientas obligatorias:**  
- Vercel Dashboard → Deploy Hooks
- Sanity Dashboard → API → Webhooks
- Acceso admin a ambas plataformas

**Validación:**  
- Publicar un cambio en cualquier documento de Sanity.
- Verificar en Vercel Dashboard que se inicia un deploy automáticamente.
- El deploy se completa con éxito y el site refleja el cambio.

---

## [DONE] 17. Revisión General y Optimización

**Effort:** high  
**Work:** auto  
**Focus:** fullstack  

**Objetivo:**  
Auditar todos los archivos modificados a lo largo de la feature, comparar con el concepto original y buscar inconsistencias, errores y optimizaciones.

**Descripción humana:**  
Revisión final de todo el trabajo realizado. Se comprueba que el panel funciona bien, que la web se genera correctamente desde el panel, que no se ha roto nada, y que todo lo que se prometió en el plan original se ha cumplido.

**Detalle técnico:**  
- **Comparar con el concepto:** Abrir `concepts/CONCEPT_addSanity.md` y verificar punto por punto:
  - ✅ Todos los schemas del grafo relacional (sección 3) están implementados.
  - ✅ Todos los campos de cada schema (sección 4) existen con sus descripciones.
  - ✅ Los gaps SEO (sección 5) están corregidos.
  - ✅ Los gaps GEO (sección 6) están corregidos.
  - ✅ Los flujos (sección 7) funcionan end-to-end.
  - ✅ La estructura del proyecto (sección 8) se respeta.
  - ✅ Los edge cases (sección 9) están contemplados.
  - ✅ La UX del Studio (sección 10) está configurada.
- **Auditoría de código:**
  - Buscar imports residuales de `travel-data.ts`, `destination-details.ts`, `blog-data.ts`, `comparisons.ts` que deban eliminarse.
  - Verificar que no hay errores de tipado TypeScript (`npx tsc --noEmit` o `npm run build`).
  - Revisar que todas las queries GROQ tienen projections eficientes (no traer campos innecesarios).
  - Comprobar que las imágenes se resuelven correctamente con `@sanity/image-url`.
  - Verificar responsive y lighthouse performance del site generado.
- **Optimizaciones:**
  - Cachear queries en build si Astro lo permite.
  - Verificar que `useCdn: false` es correcto para build time (sí, para datos frescos en build).
  - Considerar `useCdn: true` si se migra a SSR en el futuro.
  - Verificar que el build time es razonable (<2 minutos).
- **Limpieza:**
  - Eliminar archivos de datos hardcodeados que ya no se usan (o dejarlos explícitamente como backup con comentario).
  - Eliminar scripts temporales de testing.
  - Actualizar `.gitignore` si aplica (ej: `.sanity/` cache).

**Skills/Comandos/Herramientas obligatorias:**  
- `npm run build` (Astro build completo)
- `npx tsc --noEmit` (type checking)
- Lighthouse (performance audit)
- Comparación directa con `concepts/CONCEPT_addSanity.md`

**Validación:**  
- Build exitoso sin warnings ni errores.
- Todas las páginas del site generadas correctamente (verificar output de build).
- El Studio está organizado, con descripciones en español, validaciones activas.
- El webhook Sanity → Vercel funciona end-to-end.
- No hay regresiones visuales en las páginas.
- Todos los puntos del concepto original están cubiertos.
- Performance Lighthouse ≥ 90 en las páginas clave.
