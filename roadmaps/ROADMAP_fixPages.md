# ROADMAP: fixPages

> Origen: `concepts/CONCEPT_fixPages.md` (aprobado)
> Objetivo global: Reestructurar el modelado de `included`/`notIncluded` e `itinerary` (de trip a destination/siteSettings), centralizar la lógica de precios, extraer componentes Astro reutilizables, conectar `como-funciona.astro` al modelo y optimizar el data fetching de todas las páginas.

---

## [DONE] Tarea 1 — Actualizar schemas de Sanity (siteSettings, destination, trip)

Effort: mid
Work: auto
Focus: backend

**Objetivo:** Modificar los schemas de Sanity para que `included`/`notIncluded` base vivan en `siteSettings`, los extras del destino en `destination`, y en `trip` queden como overrides opcionales. Mover `itinerary` a `destination` y convertir el de `trip` en `itineraryOverride`.

**Descripción humana:** Ahora mismo cada viaje tiene su propia lista de "qué incluye" y "qué no incluye", y su propio itinerario, aunque la mayoría repiten lo mismo. Vamos a reorganizar esto para que la información base esté en un solo lugar (la configuración del sitio), los extras estén en el destino, y los viajes solo indiquen si tienen algo diferente.

**Detalle técnico:**

- **`studio/schemas/documents/siteSettings.ts`:**
  - Añadir `defineField({ name: 'defaultIncluded', title: 'Incluye (por defecto)', type: 'array', of: [{ type: 'string' }], description: 'Lo que incluyen TODOS los viajes de Travelhood por defecto.' })`
  - Añadir `defineField({ name: 'defaultNotIncluded', title: 'No incluye (por defecto)', type: 'array', of: [{ type: 'string' }], description: 'Lo que NO incluye ningún viaje por defecto.' })`

- **`studio/schemas/documents/destination.ts`:**
  - Añadir fieldset `{ name: 'includes', title: 'Incluye / No incluye', options: { collapsible: true, collapsed: true } }`
  - Añadir fieldset `{ name: 'itineraryFieldset', title: 'Itinerario', options: { collapsible: true, collapsed: true } }`
  - Añadir `defineField({ name: 'extraIncluded', title: 'Extras que incluye', type: 'array', of: [{ type: 'string' }], fieldset: 'includes', description: 'Extras específicos de este destino (ej: "Japan Rail Pass", "Crucero por el Nilo").' })`
  - Añadir `defineField({ name: 'extraNotIncluded', title: 'Extras que NO incluye', type: 'array', of: [{ type: 'string' }], fieldset: 'includes', description: 'No-incluidos extra del destino (ej: "Ropa térmica").' })`
  - Añadir `defineField({ name: 'itinerary', title: 'Itinerario', type: 'array', of: [{ type: 'itineraryDay' }], fieldset: 'itineraryFieldset', description: 'Itinerario base del destino. Los viajes lo heredan automáticamente.' })`

- **`studio/schemas/documents/trip.ts`:**
  - Renombrar campo `included` → `extraIncluded` (mantener `type: 'array', of: [{type: 'string'}]`). Cambiar title a `'Extras que incluye (override)'` y description a `'Solo si este viaje incluye algo DISTINTO al destino. Normalmente vacío.'`
  - Renombrar campo `notIncluded` → `extraNotIncluded`. Cambiar title a `'Extras que NO incluye (override)'` y description acorde.
  - Renombrar campo `itinerary` → `itineraryOverride`. Cambiar title a `'Itinerario (override)'` y description a `'Solo si la ruta de este viaje difiere del itinerario base del destino. Normalmente vacío.'`

**Skills/Comandos/Herramientas obligatorias:**
- Editor de archivos TypeScript
- Conocimiento de la API `defineField`/`defineType` de Sanity v3

**Validación:**
- Los tres archivos de schemas compilan sin errores TypeScript.
- Ejecutar `cd studio && npx sanity schema extract` (o `npx sanity typegen generate`) no lanza errores.
- Los nuevos campos aparecen en el panel de Sanity al ejecutar `npx sanity dev`.

---

## [DONE] Tarea 2 — Actualizar tipos TypeScript y queries GROQ

Effort: mid
Work: auto
Focus: backend

**Objetivo:** Sincronizar los tipos de `src/types/sanity.ts`, las queries GROQ de `src/lib/queries.ts` y los tipos internos de `src/lib/travel-data.ts` para reflejar la nueva estructura de campos.

**Descripción humana:** Las definiciones de datos del código tienen que coincidir con los cambios que hicimos en Sanity. Actualizamos las interfaces de TypeScript y las consultas a la base de datos para que usen los nuevos campos.

**Detalle técnico:**

- **`src/types/sanity.ts`:**
  - En `SanitySiteSettings`: añadir `defaultIncluded?: string[]` y `defaultNotIncluded?: string[]`.
  - En `SanityDestination`: añadir `extraIncluded?: string[]`, `extraNotIncluded?: string[]`, `itinerary?: SanityItineraryDay[]`.
  - En `SanityTrip`: renombrar `included` → `extraIncluded`, `notIncluded` → `extraNotIncluded`, `itinerary` → `itineraryOverride`.

- **`src/lib/queries.ts`:**
  - `siteSettingsQuery`: añadir `defaultIncluded, defaultNotIncluded` a la proyección.
  - `allDestinationsQuery`: añadir `extraIncluded, extraNotIncluded` a la proyección.
  - `destinationBySlugQuery`: añadir `extraIncluded, extraNotIncluded, itinerary` a la proyección.
  - `allTripsQuery`: cambiar `included, notIncluded` por `extraIncluded, extraNotIncluded` en la proyección.
  - `tripsByDestinationQuery`: cambiar `included, notIncluded, itinerary` por `extraIncluded, extraNotIncluded, itineraryOverride`. Añadir `destination->{..., extraIncluded, extraNotIncluded, itinerary}` para poder hacer merge en el data provider.
  - `tripsByTagQuery`: ídem, cambiar campos.

- **`src/lib/travel-data.ts`:** (solo si se mantiene fallback hardcoded)
  - Renombrar los campos en el tipo `Trip` y en los datos hardcoded: `included` → `extraIncluded`, `notIncluded` → `extraNotIncluded`, `itinerary` → `itineraryOverride`.
  - Añadir a la interfaz `Destination` los campos `extraIncluded?: string[]`, `extraNotIncluded?: string[]`, `itinerary?: ItineraryDay[]`.
  - Añadir constantes `defaultIncluded` y `defaultNotIncluded` a nivel de módulo (las que antes eran del trip, ahora son globales).

**Skills/Comandos/Herramientas obligatorias:**
- Editor de TypeScript
- Verificar con `npx astro check` o `npx tsc --noEmit`

**Validación:**
- `npx tsc --noEmit` pasa sin errores de tipo.
- Las interfaces reflejan 1:1 los campos de los schemas de Sanity de la Tarea 1.

---

## [DONE] Tarea 3 — Actualizar data-provider.ts con lógica de merge

Effort: high
Work: auto
Focus: backend

**Objetivo:** Modificar `data-provider.ts` para que `mapTrip()` compute `included`/`notIncluded` e `itinerary` finales haciendo merge de siteSettings + destination + trip overrides. Crear un cache de siteSettings para evitar N+1.

**Descripción humana:** El archivo que conecta la web con los datos de Sanity necesita saber cómo "sumar" la información base del sitio + los extras del destino + los overrides del viaje para generar la lista final de qué incluye y qué no.

**Detalle técnico:**

- **Cache de siteSettings:**
  - Crear variable `let cachedSettings: SanitySiteSettings | null = null` a nivel de módulo.
  - Crear función `async function ensureSettings(): Promise<{ defaultIncluded: string[], defaultNotIncluded: string[] }>` que hace `if (!cachedSettings) cachedSettings = await getSiteSettings()` y devuelve los defaults (o fallback a constantes hardcoded si Sanity no está configurado).

- **`mapTrip(s: SanityTrip, settings, destinationData?)`:**
  - Cambiar la firma para recibir settings y opcionalmente datos del destino (extraIncluded, extraNotIncluded, itinerary del destino).
  - Computar `included = [...new Set([...(settings.defaultIncluded), ...(destinationData?.extraIncluded ?? []), ...(s.extraIncluded ?? [])])]`.
  - Computar `notIncluded = [...new Set([...(settings.defaultNotIncluded), ...(destinationData?.extraNotIncluded ?? []), ...(s.extraNotIncluded ?? [])])]`.
  - Computar `itinerary = s.itineraryOverride ?? destinationData?.itinerary ?? []` (el override del trip gana si existe; si no, hereda del destino).
  - Devolver el trip con estos campos computed.

- **Actualizar `getTrips()`:**
  - Antes del mapeo, obtener settings con `ensureSettings()`.
  - Si el query de trips ya incluye `destination->{ extraIncluded, extraNotIncluded, itinerary }`, extraer esos datos en `mapTrip`.

- **Actualizar `getTripsByDestination(slug)`:**
  - Ídem, obtener settings y pasar datos del destino.

- **Actualizar `mapDestination()`:**
  - Mapear los nuevos campos `extraIncluded`, `extraNotIncluded`, `itinerary` al tipo `Destination`.

- **Fallback hardcoded:** 
  - Si `!isSanityConfigured()`, los hardTrips ya tendrán `extraIncluded`/`extraNotIncluded` renombrados. Aplicar el mismo merge con las constantes globales `defaultIncluded`/`defaultNotIncluded` de `travel-data.ts`.

**Skills/Comandos/Herramientas obligatorias:**
- Editor TypeScript
- Verificar con `npx tsc --noEmit`

**Validación:**
- `npx tsc --noEmit` sin errores.
- Ejecutar `npx astro build` y verificar que las páginas generan el contenido `included` correcto (base + extras del destino).
- La deduplicación funciona: no hay ítems repetidos en included/notIncluded.

---

## [DONE] Tarea 4 — Crear helper resolvePrice()

Effort: low
Work: auto
Focus: backend

**Objetivo:** Centralizar la lógica de resolución de precios (que hoy se repite en 8+ sitios con variaciones) en una sola función helper.

**Descripción humana:** En muchas páginas se repite el mismo cálculo para saber cuál es el precio final de un viaje (¿tiene descuento? ¿cuál gana?). Vamos a meter ese cálculo en un solo lugar para que no haya errores ni inconsistencias.

**Detalle técnico:**

- **Crear en `src/lib/utils.ts`** (o en un nuevo `src/lib/price-utils.ts` si `utils.ts` ya es grande) la función:

```ts
interface ResolvedPrice {
  price: number
  originalPrice: number
  hasDiscount: boolean
  promoLabel?: string
}

function resolvePrice(trip: { priceFrom: number; promoPrice?: number; promoLabel?: string }, extra?: { promoPrice?: number; promoLabel?: string }): ResolvedPrice
```

  - Lógica: `const finalPrice = extra?.promoPrice ?? trip.promoPrice ?? trip.priceFrom`
  - `hasDiscount = finalPrice < trip.priceFrom`
  - `promoLabel = extra?.promoLabel ?? trip.promoLabel`
  - `originalPrice = trip.priceFrom`
  - Devuelve `{ price: finalPrice, originalPrice, hasDiscount, promoLabel }`

- **Exportar** la función y el tipo `ResolvedPrice`.

**Skills/Comandos/Herramientas obligatorias:**
- Editor TypeScript

**Validación:**
- `npx tsc --noEmit` sin errores.
- Tests unitarios manuales: `resolvePrice({ priceFrom: 1000, promoPrice: 900 })` → `{ price: 900, originalPrice: 1000, hasDiscount: true }`.
- `resolvePrice({ priceFrom: 1000 }, { promoPrice: 800 })` → `{ price: 800, ... }`.
- `resolvePrice({ priceFrom: 1000 })` → `{ price: 1000, hasDiscount: false }`.

---

## [DONE] Tarea 5 — Extraer componentes Astro reutilizables

Effort: mid
Work: auto
Focus: frontend

**Objetivo:** Eliminar la duplicación de templates creando componentes Astro reutilizables para las secciones hero, CTA final y FAQ wrapper que se repiten en 6-8 páginas.

**Descripción humana:** Muchas páginas tienen la misma cabecera con imagen de fondo y breadcrumbs, la misma sección de "¿Listo para viajar?" con botón, y la misma sección de preguntas frecuentes. Vamos a crear componentes compartidos para no repetir el código.

**Detalle técnico:**

- **`src/components/HeroSection.astro`** (nuevo):
  - Props: `image: string`, `imageAlt: string`, `breadcrumbs: { label: string; href?: string }[]`, `title: string`, `subtitle?: string`
  - Template: `<section class="relative flex min-h-[50vh]...">` con `<img>`, gradient overlay, breadcrumb nav, `<h1>`, `<p>`.
  - Extraer el patrón común de `presupuesto/[slug].astro` líneas 64-82, `cuando-viajar-a/[slug].astro` líneas 49-67, `destinos/[slug].astro` líneas 98-124, `como-funciona.astro` líneas 82-106.

- **`src/components/CTASection.astro`** (nuevo):
  - Props: `title: string`, `subtitle?: string`, `ctaText: string`, `ctaHref: string`, `variant?: 'teal' | 'card'` (default `'teal'` → `bg-teal-deep`, `'card'` → `bg-card`).
  - Template: `<section class="bg-{variant} py-16">...` con h2, p, a.
  - Extraer el patrón de `presupuesto/[slug].astro` líneas 201-211, `cuando-viajar-a/[slug].astro` líneas 129-139, `destinos/[slug].astro` líneas 330-347, `como-funciona.astro` líneas 287-302.

- **`src/components/FAQWrapper.astro`** (nuevo):
  - Props: `title: string`, `subtitle?: string`, `faqs: { question: string; answer: string }[]`
  - Template: `<section class="bg-{bg} py-14">...` con ContinentFAQ client:load.
  - Extraer el patrón de `presupuesto/[slug].astro` líneas 190-199, `cuando-viajar-a/[slug].astro` líneas 118-127, `como-funciona.astro` líneas 272-284.

**Skills/Comandos/Herramientas obligatorias:**
- Editor de archivos Astro
- Conocimiento de Astro component props (`Astro.props`)

**Validación:**
- `npx astro check` sin errores.
- Las páginas que los usan renderizan idénticamente al estado previo (verificar visualmente en `npx astro dev`).
- Los tres nuevos componentes se usan en al menos 3 páginas cada uno.

---

## [DONE] Tarea 6 — Refactorizar páginas derivadas de destino

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Actualizar `presupuesto/[slug].astro`, `cuando-viajar-a/[slug].astro` y `destinos/[slug].astro` para:
1. Usar los nuevos componentes reutilizables (HeroSection, CTASection, FAQWrapper).
2. Usar `resolvePrice()` en vez de la lógica inline dispersa.
3. Tomar `included`/`notIncluded` del modelo computed (que ya viene con merge) en vez de `destTrips[0].included`.
4. Optimizar data fetching: usar `getDestinationBySlug()`, `getTripsByDestination()`, etc. en vez de cargar todo.

**Descripción humana:** Actualizamos las páginas de presupuesto, cuándo viajar y destinos por continente para que usen los datos reorganizados, los componentes compartidos y carguen solo los datos que necesitan.

**Detalle técnico:**

- **`src/pages/presupuesto/[slug].astro`:**
  - Cambiar `const [destinations, trips, countries, continents] = await Promise.all([getDestinations(), getTrips(), ...])` por:
    ```
    const destination = await getDestinationBySlug(slug)
    const destTrips = await getTripsByDestination(slug)
    ```
  - `included` y `notIncluded` ahora vienen computados en cada trip (ya incluyen base + destino). Usar `destTrips[0].included` directamente o, mejor aún, mapear desde `destination.extraIncluded` + defaults.
  - Reemplazar lógica de precios inline por `resolvePrice(trip, getTripExtra(trip.id))`.
  - Reemplazar secciones hero, CTA y FAQ por los nuevos componentes.

- **`src/pages/cuando-viajar-a/[slug].astro`:**
  - Cambiar data fetching a funciones `bySlug`.
  - Reemplazar lógica de precios por `resolvePrice()`.
  - Usar componentes reutilizables.

- **`src/pages/destinos/[slug].astro`:**
  - Cambiar `getContinents()` + `getDestinations()` + `getTrips()` + `getCountries()` por `getContinentBySlug(slug)` + `getDestinationsByContinent(slug)` + queries específicas.
  - Usar `resolvePrice()` en `continentTripCards`.
  - Usar HeroSection y CTASection.

- **`src/pages/destino/[slug].astro`:**
  - Cambiar `getDestinations()` + `getTrips()` + `getTestimonials()` + `getCoordinators()` + `getCountries()` + `getContinents()` por `getDestinationBySlug(slug)` + `getTripsByDestination(slug)` + `getTestimonialsByDestination(slug)` + queries específicas.
  - `itinerary` ahora viene del trip (que hereda del destino). Eliminar el merge manual con `getTripExtra().itinerary`.
  - Usar `resolvePrice()` para el schema EventSchema.

**Skills/Comandos/Herramientas obligatorias:**
- Editor Astro/TypeScript
- `npx astro check` para validar
- `npx astro build` para verificar generación estática

**Validación:**
- `npx astro check` sin errores.
- `npx astro build` genera todas las páginas sin fallos.
- Verificar visualmente que las páginas renderizan correctamente en `npx astro dev`.
- El número de queries a Sanity por página se reduce (de 4-6 a 2-3).
- No hay lógica `extra.promoPrice ?? trip.promoPrice ?? trip.priceFrom` inline en ninguna página.

---

## [DONE] Tarea 7 — Conectar como-funciona.astro al modelo de datos

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Eliminar los arrays hardcoded `includes`/`notIncludes` de `como-funciona.astro` y sustituirlos por datos de `siteSettings.defaultIncluded` / `siteSettings.defaultNotIncluded`, estableciendo una única fuente de verdad.

**Descripción humana:** La página de "Cómo funciona" tiene su propia lista escrita a mano de qué incluye y qué no incluye un viaje. Si alguien cambia esa información en Sanity, esta página no se actualiza. Vamos a conectarla al mismo sitio que el resto.

**Detalle técnico:**

- **`src/pages/como-funciona.astro`:**
  - Importar `getSiteSettings` de `@/lib/data-provider`.
  - En el frontmatter: `const settings = await getSiteSettings()`.
  - Sustituir la constante `includes` (líneas 44-51) por: `const includes = settings?.defaultIncluded ?? [fallback hardcoded]`.
  - Sustituir la constante `notIncludes` (líneas 53-58) por: `const notIncludes = settings?.defaultNotIncluded ?? [fallback hardcoded]`.
  - Mantener los textos descriptivos actuales como fallback si Sanity no está configurado.
  - Opcionalmente, usar HeroSection, CTASection y FAQWrapper de la Tarea 5.

- **Decisión sobre formato de texto:**
  - Los `defaultIncluded` de siteSettings serán strings cortos ("Alojamiento completo", "Transporte interno"). La página `como-funciona.astro` actualmente tiene textos más descriptivos ("Alojamiento completo (hoteles, hostels boutique o alojamientos únicos)").
  - Opción: añadir un campo `defaultIncludedDetailed` a siteSettings con las versiones largas, o usar las versiones cortas y añadir la descripción larga en la propia página usando un mapping. La opción más limpia es añadir a siteSettings campos `defaultIncludedDescriptions` como array de `{ short: string, detailed: string }` — pero esto añade complejidad al schema. **Decisión pragmática:** usar los strings cortos de `defaultIncluded` y que la página los muestre directamente. Si se quiere la versión larga, se extiende el schema más adelante.

**Skills/Comandos/Herramientas obligatorias:**
- Editor Astro
- `npx astro check`

**Validación:**
- La página `como-funciona.astro` renderiza correctamente con los datos de siteSettings.
- Si se cambia un `defaultIncluded` en Sanity, la página refleja el cambio tras rebuild.
- El fallback funciona si Sanity no está configurado.

---

## [DONE] Tarea 8 — Migrar datos hardcoded de travel-data.ts

Effort: mid
Work: manual

**Objetivo:** Actualizar los datos hardcoded de `travel-data.ts` para reflejar la nueva estructura: sacar `included`/`notIncluded` de cada trip y moverlos a las constantes globales y a los destinos. Sacar `itinerary` de trips al destino correspondiente.

**Descripción humana:** El archivo de datos de respaldo (que se usa cuando Sanity no está conectado) todavía tiene la estructura vieja. Necesitamos reorganizarlo para que coincida con los cambios del modelo. **Esta tarea requiere revisión manual porque implica mover datos entre objetos.**

**Detalle técnico:**

- **`src/lib/travel-data.ts`:**
  - Crear constantes globales `export const defaultIncluded: string[]` y `export const defaultNotIncluded: string[]` con los valores que hoy están en `defaultIncluded`/`defaultNotIncluded` del archivo.
  - En cada objeto de `hardDestinations`, añadir `extraIncluded` y `extraNotIncluded` según el destino (ej: Japón → `extraIncluded: ['Japan Rail Pass']`, Egipto → `extraIncluded: ['Crucero por el Nilo']`).
  - En cada objeto de `hardDestinations`, añadir `itinerary` con el itinerario base (mover desde el primer trip de ese destino).
  - En cada objeto de `hardTrips`, eliminar `included`/`notIncluded` y dejar `extraIncluded`/`extraNotIncluded` vacíos (o solo con overrides específicos). Renombrar `itinerary` → `itineraryOverride` y vaciarlo (o mantener solo si difiere del destino).

- **`src/lib/destination-details.ts`:**
  - Los `tripExtras` que contienen `itinerary` (ej: `japon-ss-2026`, `tailandia-ss-2026`, `marruecos-ss-2026`) deben migrarse: sus itinerarios pasan a ser el `itinerary` del destino correspondiente en `travel-data.ts`. El campo `itinerary` en `TripExtra` se elimina o se renombra a `itineraryOverride`.
  - Actualizar la interfaz `TripExtra` para eliminar el campo `itinerary`.

**Skills/Comandos/Herramientas obligatorias:**
- Editor TypeScript
- Revisión manual de los datos para asegurar la migración correcta
- `npx tsc --noEmit` para validar tipos

**Validación:**
- `npx tsc --noEmit` sin errores.
- `npx astro build` genera todas las páginas correctamente con datos hardcoded (sin Sanity).
- Los itinerarios y listas de included se resuelven correctamente en el output HTML.

---

## [DONE] Tarea 9 — Crear script de migración Sanity

Effort: low
Work: manual

**Objetivo:** Crear un script que migre los datos existentes en Sanity: mover `included`/`notIncluded` de trips a siteSettings y destinations, y mover `itinerary` de trips a destinations.

**Descripción humana:** Los datos que ya están guardados en Sanity necesitan reorganizarse para seguir la nueva estructura. Creamos un script que haga esta migración automáticamente, pero **hay que ejecutarlo manualmente y revisar el resultado.**

**Detalle técnico:**

- **Crear `studio/migrations/fixPages-migrate.ts`** (o `.js`):
  - Conectar al cliente Sanity con `createClient`.
  - **Paso 1:** Leer el documento `siteSettings` y patchearlo con `defaultIncluded` y `defaultNotIncluded` (los valores base comunes).
  - **Paso 2:** Para cada destination, leer todos los trips vinculados. Extraer los items de `included`/`notIncluded` que NO estén en los defaults. Esos son los `extraIncluded`/`extraNotIncluded` del destino. Patchear el destination.
  - **Paso 3:** Para cada destination, tomar el itinerario del primer trip (o el más largo). Patchearlo como `itinerary` del destination.
  - **Paso 4:** Para cada trip, vaciar `included`/`notIncluded` y renombrar a `extraIncluded`/`extraNotIncluded`. Vaciar `itinerary` y renombrar a `itineraryOverride`.
  - **Dry-run primero:** Imprimir los cambios sin aplicarlos, para revisión.

- **Ejecutar manualmente** el script y verificar en el panel de Sanity.

**Skills/Comandos/Herramientas obligatorias:**
- `@sanity/client` para la migración
- `npx tsx studio/migrations/fixPages-migrate.ts` para ejecutar
- Acceso al proyecto Sanity (token de escritura)

**Validación:**
- Los documentos de siteSettings tienen `defaultIncluded` y `defaultNotIncluded` rellenos.
- Los destinations tienen `extraIncluded`, `extraNotIncluded` e `itinerary` correctos.
- Los trips tienen `extraIncluded`/`extraNotIncluded` vacíos (o con overrides puntuales) y `itineraryOverride` vacío.
- La web genera correctamente con `npx astro build` tras la migración.

---

## [DONE] Tarea 10 — Optimizar data fetching en páginas restantes

Effort: mid
Work: auto
Focus: fullstack

**Objetivo:** Revisar y optimizar el data fetching de las páginas que aún no se han tocado: `viajes.astro`, `ofertas.astro`, `temporada/[slug].astro`, `tipos/[slug].astro`, `pais/[slug].astro`, `comparar/[slug].astro`, `index.astro`. Sustituir llamadas a `getAll()` por queries específicas donde sea posible.

**Descripción humana:** Varias páginas más siguen cargando TODOS los datos cuando solo necesitan una parte. Vamos a optimizarlas para que carguen solo lo necesario, reduciendo el tiempo de build.

**Detalle técnico:**

- **Patrón general:** Cada página que hoy hace `const [destinations, trips, ...] = await Promise.all([getDestinations(), getTrips(), ...])` debe evaluarse:
  - ¿Necesita realmente TODOS los destinos/trips? Si solo necesita los de un continente o slug, usar la función `bySlug` / `byContinent`.
  - ¿Hace `.find()` sobre el array completo? Sustituir por la query directa.

- **Archivos a revisar:**
  - `src/pages/viajes.astro` — probablemente necesita todos los trips (es la página de catálogo), aceptable.
  - `src/pages/ofertas.astro` — solo necesita trips con promo activa. Considerar crear query `tripsWithPromoQuery`.
  - `src/pages/temporada/[slug].astro` — usa `getTripsByTag()`, verificar que no cargue extras.
  - `src/pages/tipos/[slug].astro` — usa `getTripCategoryBySlug()`, verificar.
  - `src/pages/pais/[slug].astro` — probablemente carga todo para filtrar por país. Optimizar.
  - `src/pages/index.astro` — landing principal, necesita trips destacados. Verificar que no cargue todo.
  - `src/pages/comparar/[slug].astro` — usa `getComparisonBySlug()`, verificar.

- Usar `resolvePrice()` en cualquier lugar donde aparezca el patrón inline de resolución de precios.

**Skills/Comandos/Herramientas obligatorias:**
- Editor Astro/TypeScript
- `npx astro check`
- `npx astro build` para verificar

**Validación:**
- `npx astro build` exitoso.
- Todas las páginas renderizan correctamente.
- No queda ninguna instancia del patrón `extra.promoPrice ?? trip.promoPrice ?? trip.priceFrom` inline en las páginas.

---

## [DONE] Revisión General y Optimización

Effort: high
Work: auto
Focus: fullstack

**Objetivo:** Auditar TODOS los archivos modificados durante el roadmap para detectar inconsistencias de integración, errores de tipado, regresiones, oportunidades de optimización, y comparar el resultado con `concepts/CONCEPT_fixPages.md` para confirmar que todos los objetivos se han cumplido.

**Descripción humana:** Revisión final de todo lo que hemos cambiado para asegurarnos de que no se nos ha roto nada, que todo es coherente y que cumplimos con lo que se planificó al principio.

**Detalle técnico:**

1. **Checklist de archivos modificados:**
   - `studio/schemas/documents/siteSettings.ts` — nuevos campos
   - `studio/schemas/documents/destination.ts` — nuevos campos + fieldsets
   - `studio/schemas/documents/trip.ts` — campos renombrados
   - `src/types/sanity.ts` — tipos sincronizados
   - `src/lib/queries.ts` — queries actualizadas
   - `src/lib/travel-data.ts` — datos y tipos reestructurados
   - `src/lib/destination-details.ts` — itinerary migrado
   - `src/lib/data-provider.ts` — merge logic + cache
   - `src/lib/utils.ts` (o `price-utils.ts`) — resolvePrice()
   - `src/components/HeroSection.astro` — nuevo componente
   - `src/components/CTASection.astro` — nuevo componente
   - `src/components/FAQWrapper.astro` — nuevo componente
   - `src/pages/como-funciona.astro` — conectada a siteSettings
   - `src/pages/presupuesto/[slug].astro` — refactorizada
   - `src/pages/cuando-viajar-a/[slug].astro` — refactorizada
   - `src/pages/destinos/[slug].astro` — refactorizada
   - `src/pages/destino/[slug].astro` — refactorizada
   - Otras páginas optimizadas

2. **Verificaciones obligatorias:**
   - `npx tsc --noEmit` — cero errores de tipo.
   - `npx astro check` — cero errores.
   - `npx astro build` — build completo exitoso.
   - Verificar visualmente 5 páginas representativas en `npx astro dev`.
   - Buscar con `rg 'trip\.included|trip\.notIncluded|trip\.itinerary[^O]' src/` para confirmar que no quedan usos del modelo antiguo.
   - Buscar con `rg 'promoPrice \?\? trip\.promoPrice' src/` para confirmar que no queda lógica de precios inline.

3. **Comparación con CONCEPT:**
   - Abrir `concepts/CONCEPT_fixPages.md` y verificar punto por punto:
     - [x] included/notIncluded base en siteSettings
     - [x] extras en destination
     - [x] override en trip
     - [x] itinerary en destination
     - [x] itineraryOverride en trip
     - [x] resolvePrice helper
     - [x] componentes reutilizables
     - [x] como-funciona.astro conectada
     - [x] data fetching optimizado

4. **Oportunidades de optimización adicionales:**
   - ¿Se pueden cachear las queries de Sanity a nivel de build?
   - ¿Hay componentes React que podrían ser Astro (sin client:load)?
   - ¿Los nuevos componentes Astro permiten más reutilización futura?

**Skills/Comandos/Herramientas obligatorias:**
- `npx tsc --noEmit`
- `npx astro check`
- `npx astro build`
- `rg` (ripgrep) para búsqueda de patrones
- Editor TypeScript/Astro
- Lectura de `concepts/CONCEPT_fixPages.md`

**Validación:**
- Todos los checks de compilación pasan.
- No quedan usos del modelo antiguo en el código fuente.
- El build genera el mismo número de páginas que antes.
- Los 9 puntos del concepto están implementados.
- No hay regresiones visuales en las páginas principales.
