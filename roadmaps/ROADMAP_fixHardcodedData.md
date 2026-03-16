# ROADMAP: fixHardcodedData

> Origen: `concepts/CONCEPT_fixHardcodedData.md` (aprobado)

---

## [DONE] Tarea 1 — Corregir itinerario y precios promo en `destino/[slug].astro`

**Effort:** mid
**Work:** auto
**Focus:** fullstack

**Objetivo:** Eliminar la dependencia de `getTripExtra()` (datos hardcodeados de `destination-details.ts`) y usar los datos que ya vienen resueltos desde Sanity a través de `mapTrip()` en `data-provider.ts`. Esto restaura el itinerario que actualmente desaparece porque los UUIDs de Sanity no coinciden con los IDs hardcodeados.

**Descripción humana:** Ahora mismo, la página de cada destino intenta buscar información extra del viaje (itinerario y precios especiales) en una lista fija escrita a mano. Cuando Sanity genera sus propios identificadores, esa búsqueda no encuentra nada, y el itinerario desaparece de la web. Este paso conecta la página directamente con los datos que ya vienen bien de Sanity, sin pasar por la lista fija.

**Detalle técnico:**
- **Archivo:** `src/pages/destino/[slug].astro`
- **Líneas 7-19 (imports):** Eliminar la importación de `getTripExtra` y `lookupCoords` desde `@/lib/data-provider` (re-export). Importar `lookupCoords` directamente desde `@/lib/destination-details` solo como fallback temporal de coordenadas.
- **Líneas 45-63 (bloque `destTrips`):** Reescribir el `.map()` eliminando `getTripExtra(t.id)` y `resolvePrice(t, extra)`. El itinerario ya viene en `t.itinerary` desde `mapTrip()`. Los precios promo ya vienen en `t.promoPrice` y `t.promoLabel`. Aplicar `lookupCoords()` como fallback para lat/lng si el itinerario de Sanity no tiene coordenadas.
- **Línea 89 (schema LD+JSON):** `resolvePrice(trip, getTripExtra(trip.id))` → `resolvePrice(trip)` (sin segundo argumento, ya que los precios promo vienen del trip).
- **Línea 113 (GEODataBlock price):** Mismo cambio: `resolvePrice(t, getTripExtra(t.id))` → `resolvePrice(t)`.
- **Archivo:** `src/lib/utils.ts` — `resolvePrice()`: simplificar para que funcione sin el segundo argumento `extra` (o mantener como está, ya es retrocompatible con `extra` undefined).

**Código resultante del bloque `destTrips`:**
```astro
const destTrips = tripsRaw
  .filter((t) => t.status !== "full")
  .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
  .map((t) => ({
    ...t,
    itinerary: t.itinerary.map((d) => {
      const coords = lookupCoords(d.title);
      return { ...d, lat: d.lat ?? coords?.[0] ?? 0, lng: d.lng ?? coords?.[1] ?? 0 };
    }),
  }));
```

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/pages/destino/[slug].astro`, `src/lib/utils.ts`
- StrReplace para editar el archivo Astro

**Validación:**
- `npm run build` compila sin errores
- La página de un destino con trips en Sanity muestra el itinerario correctamente
- Los precios promo se muestran si existen en el trip de Sanity
- La sección GEODataBlock muestra el precio correcto

---

## [DONE] Tarea 2 — Fotos de destino desde Sanity (gallery) en vez de picsum

**Effort:** mid
**Work:** auto
**Focus:** fullstack

**Objetivo:** Reemplazar las fotos hardcodeadas de `picsum.photos` por la galería del destino almacenada en Sanity (`destination.gallery`), con fallback a `heroImage` si la galería está vacía.

**Descripción humana:** Las fotos que aparecen en el lightbox de cada destino son genéricas (de un banco de imágenes aleatorio). Este paso hace que se usen las fotos reales que se suben desde Sanity Studio, el panel de gestión de contenidos.

**Detalle técnico:**
- **Archivo:** `src/pages/destino/[slug].astro`
  - Línea 71: `const photos = getDestinationPhotos(destination.id)` → reemplazar por lógica que use `getDestinationRaw(slug)` (ya existe en `data-provider.ts`) para obtener `gallery` del destino.
  - Resolver cada imagen de la galería con `urlFor(img).width(800).auto('format').url()` en el server-side de Astro.
  - Fallback: si `gallery` está vacío o no hay datos raw de Sanity → usar `[destination.heroImage]`.
  - Eliminar import de `getDestinationPhotos` de la cabecera.
- **Archivo:** `src/lib/data-provider.ts`
  - Crear una función auxiliar `getDestinationGallery(slug: string): Promise<string[]>` que:
    1. Llame a `getDestinationRaw(slug)`
    2. Si tiene `gallery`, resuelva cada imagen con `resolveImageThumb(img, 800)`
    3. Fallback: devolver array vacío
  - La query `destinationBySlugQuery` YA incluye `gallery` — verificar que el campo se resuelve.
- **Archivo:** `src/lib/queries.ts` — Verificar que `destinationBySlugQuery` incluye `gallery[]` en su proyección GROQ.
- **Tipo:** `SanityDestination` en `src/types/sanity.ts` — Verificar que tiene `gallery?: SanityImageSource[]`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/lib/queries.ts` y `src/types/sanity.ts` para verificar schema
- `urlFor` de `src/lib/sanity.ts` para resolver imágenes

**Validación:**
- `npm run build` compila
- Las fotos del lightbox son URLs de Sanity CDN (no picsum.photos)
- Si un destino no tiene galería en Sanity, se muestra al menos la heroImage

---

## [DONE] Tarea 3 — FAQs de destino desde Sanity en vez de hardcoded

**Effort:** low
**Work:** auto
**Focus:** fullstack

**Objetivo:** Reemplazar las FAQs hardcodeadas en `destination-details.ts` por las FAQs del campo `faqs` del destino en Sanity.

**Descripción humana:** Las preguntas frecuentes de cada destino están escritas a mano en un fichero del código. Este paso las saca de Sanity, donde se pueden editar fácilmente sin tocar código.

**Detalle técnico:**
- **Archivo:** `src/pages/destino/[slug].astro`
  - Línea 72: `const faqs = getDestinationFaqs(destination.id)` → reemplazar por una llamada async que obtenga las FAQs del destino raw de Sanity.
  - Reutilizar el resultado de `getDestinationRaw(slug)` (que ya se necesita para la galería en la Tarea 2) para extraer `faqs`.
  - Mapear a `{ question: string, answer: string }[]`.
  - Fallback: array vacío `[]` (la sección FAQ se oculta si no hay datos — ya lo soporta el template con `faqs.length > 0`).
  - Eliminar import de `getDestinationFaqs` de la cabecera.
- **NOTA:** Combinar con Tarea 2 — ambos necesitan `getDestinationRaw(slug)`. Hacer una sola llamada y extraer `gallery` y `faqs` del resultado.

**Skills/Comandos/Herramientas obligatorias:**
- StrReplace en `destino/[slug].astro`

**Validación:**
- `npm run build` compila
- Las FAQs se renderizan desde Sanity (si están pobladas)
- Si el destino no tiene FAQs en Sanity, la sección FAQ no aparece (sin errores)
- El schema LD+JSON de FAQs funciona correctamente

---

## [DONE] Tarea 4 — Pasar datos como props a `SeasonExplorer` y `SearchIsland` desde `index.astro`

**Effort:** low
**Work:** auto
**Focus:** fullstack

**Objetivo:** Que `index.astro` pase `trips`, `destinations` y `continents` como props a los componentes React `<SeasonExplorer>` y `<SearchIsland>`, en lugar de que estos importen directamente de `travel-data.ts`.

**Descripción humana:** La página de inicio carga los datos del CMS en el servidor, pero no se los pasa a dos bloques interactivos (el explorador por temporada y el buscador del hero). Este paso conecta esos datos correctamente.

**Detalle técnico:**
- **Archivo:** `src/pages/index.astro`
  - Línea 19-21: ya hace `const [testimonials, destinations, trips] = await Promise.all([...])`. Añadir `getContinents()` al Promise.all.
  - Línea 39: `<SearchIsland client:load />` → `<SearchIsland destinations={destinations} continents={continents} client:load />`
  - Línea 41 (approx, donde esté SeasonExplorer): `<SeasonExplorer client:load />` → `<SeasonExplorer trips={trips} destinations={destinations} client:load />`
  - Verificar que `getContinents` ya está importado o añadirlo al import de `data-provider`.
- **IMPORTANTE:** Astro serializa props de `client:*` como JSON. Los objetos `Trip`, `Destination`, `Continent` ya contienen solo tipos primitivos (strings, numbers, arrays de strings) — no hay `SanityImageSource` sin resolver. Confirmar revisando los types en `travel-data.ts`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura de `src/pages/index.astro` completo
- StrReplace para editar props

**Validación:**
- `npm run build` compila
- En el HTML generado se ve el JSON de props inyectado en los componentes React
- Los componentes siguen renderizando (aunque aún no usan las props — se refactorizan en Tareas 5 y 6)

---

## [DONE] Tarea 5 — Refactorizar `SeasonExplorer.tsx` para usar props en vez de imports

**Effort:** mid
**Work:** auto
**Focus:** frontend

**Objetivo:** Eliminar los imports directos de `travel-data.ts` en `SeasonExplorer.tsx` y usar los datos recibidos como props desde `index.astro`.

**Descripción humana:** El bloque "Explora por inspiración" de la home actualmente carga sus datos de un fichero fijo. Este paso lo cambia para que use los datos reales del CMS, que le llegan desde la página.

**Detalle técnico:**
- **Archivo:** `src/components/SeasonExplorer.tsx`
  - **Líneas 1-8 (imports):** Eliminar `import { trips, destinations, getTripsByCategory, getTripsByTag, type Trip } from "@/lib/travel-data"`.
  - Importar solo el type: `import type { Trip, Destination } from "@/lib/travel-data"`.
  - **Definir interfaz de props:**
    ```typescript
    interface SeasonExplorerProps {
      trips: Trip[]
      destinations: Destination[]
    }
    ```
  - **Firma del componente:** `export default function SeasonExplorer({ trips, destinations }: SeasonExplorerProps)`
  - **Reimplementar funciones locales:**
    - `getTripsByCategory(cat)` → filtro local: `trips.filter(t => { const dest = destinations.find(d => d.id === t.destinationId); return dest?.categories.includes(cat); })`
    - `getTripsByTag(tag)` → filtro local: `trips.filter(t => t.tags.includes(tag))`
  - **Líneas 105-106:** `destinations.find(d => d.id === trip.destinationId)` → ya usa la variable `destinations`, ahora vendrá de props en lugar del import.
  - **Línea 120:** `dest.heroImage` → ya será URL de Sanity CDN si viene de props (resuelto en `mapDestination()` de `data-provider.ts`).
  - **Categorías UI (líneas 39-48):** Array `categories` con labels de UI → mantener hardcodeado (son filtros de diseño, no contenido editable).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura completa de `src/components/SeasonExplorer.tsx`
- StrReplace para múltiples ediciones

**Validación:**
- `npm run build` compila
- El explorador por temporada muestra trips y destinos de Sanity
- Los filtros por categoría y por tag funcionan correctamente
- Las imágenes de los destinos son URLs de Sanity CDN
- No queda ningún import de `travel-data.ts` (excepto types)

---

## [DONE] Tarea 6 — Refactorizar `SearchIsland.tsx` para usar props en vez de imports

**Effort:** mid
**Work:** auto
**Focus:** frontend

**Objetivo:** Eliminar los imports directos de `travel-data.ts` en `SearchIsland.tsx` y usar los datos recibidos como props desde `index.astro`.

**Descripción humana:** El buscador del hero de la página principal carga sus destinos y continentes de un fichero fijo. Este paso lo cambia para que los reciba de la página, que a su vez los saca del CMS.

**Detalle técnico:**
- **Archivo:** `src/components/SearchIsland.tsx`
  - **Líneas 1-7 (imports):** Eliminar `import { destinations, continents, searchDestinations } from "@/lib/travel-data"`.
  - Importar solo types: `import type { Destination, Continent } from "@/lib/travel-data"`.
  - **Definir interfaz de props:**
    ```typescript
    interface SearchIslandProps {
      destinations: Destination[]
      continents: Continent[]
    }
    ```
  - **Firma del componente:** `export default function SearchIsland({ destinations, continents }: SearchIslandProps)`
  - **Reimplementar `searchDestinations()` localmente:**
    ```typescript
    function localSearchDestinations(query: string, dests: Destination[]): Destination[] {
      const q = query.toLowerCase().trim()
      if (!q) return []
      return dests.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.categories.some(c => c.toLowerCase().includes(q))
      )
    }
    ```
  - **Línea 27:** `popularDestinations = destinations.slice(0, 4)` → usar `props.destinations.slice(0, 4)`.
  - **Línea 99:** `destinations.length` → `props.destinations.length`.
  - **Línea 153:** `dest.heroImage` → ya es URL de Sanity CDN via props.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura completa de `src/components/SearchIsland.tsx`
- StrReplace para múltiples ediciones

**Validación:**
- `npm run build` compila
- El buscador del hero muestra destinos de Sanity
- El contador de destinos es correcto
- La búsqueda por texto funciona y filtra destinos
- Las sugerencias populares muestran imágenes de Sanity CDN
- No queda ningún import de `travel-data.ts` (excepto types)

---

## [DONE] Tarea 7 — Pasar datos como props a `SearchPage` desde `viajes.astro`

**Effort:** low
**Work:** auto
**Focus:** fullstack

**Objetivo:** Que `viajes.astro` pase `trips`, `destinations`, `continents` y `countries` como props a `<SearchPage>`.

**Descripción humana:** La página de "/viajes" carga los destinos del CMS en el servidor, pero no le pasa datos al componente de búsqueda. Este paso conecta todos los datos necesarios.

**Detalle técnico:**
- **Archivo:** `src/pages/viajes.astro`
  - **Línea 8:** Ampliar import: `import { getDestinations, getTrips, getContinents, getCountries } from "@/lib/data-provider"`
  - **Línea 9:** Ampliar fetch: `const [destinations, trips, continents, countries] = await Promise.all([getDestinations(), getTrips(), getContinents(), getCountries()])`
  - **Línea 23:** `<SearchPage client:load />` → `<SearchPage trips={trips} destinations={destinations} continents={continents} countries={countries} client:load />`
- **Nota sobre payload:** Con ~35 trips y ~25 destinations, el JSON inline será ~50-80KB (aceptable para SSG).

**Skills/Comandos/Herramientas obligatorias:**
- Lectura completa de `src/pages/viajes.astro`
- StrReplace para editar imports, fetch y props

**Validación:**
- `npm run build` compila
- El HTML de `/viajes` contiene el JSON serializado de props
- `SearchPage` sigue renderizando (aunque aún usa imports internos — se refactoriza en Tarea 8)

---

## [DONE] Tarea 8 — Refactorizar `SearchPage.tsx` para usar props en vez de imports

**Effort:** high
**Work:** auto
**Focus:** frontend

**Objetivo:** Eliminar todos los imports directos de `travel-data.ts` en `SearchPage.tsx` y usar los datos recibidos como props desde `viajes.astro`. Reimplementar las funciones de búsqueda y filtrado localmente.

**Descripción humana:** La página de búsqueda de viajes (la más compleja del sitio) carga todos sus datos de un fichero fijo. Este paso la migra completamente para que use datos del CMS, haciendo que los filtros, la búsqueda y las tarjetas muestren información real.

**Detalle técnico:**
- **Archivo:** `src/components/SearchPage.tsx`
  - **Líneas 1-13 (imports):** Eliminar `import { trips, destinations, continents, countries, searchDestinations, filterTripsAdvanced, type Trip, type DestinationCategory, type TripTag } from "@/lib/travel-data"`.
  - Importar solo types: `import type { Trip, Destination, Continent, Country, DestinationCategory, TripTag } from "@/lib/travel-data"`.
  - **Definir interfaz de props:**
    ```typescript
    interface SearchPageProps {
      trips: Trip[]
      destinations: Destination[]
      continents: Continent[]
      countries: Country[]
    }
    ```
  - **Firma del componente:** `export default function SearchPage({ trips, destinations, continents, countries }: SearchPageProps)`
  - **Reimplementar `searchDestinations()` localmente** (similar a SearchIsland).
  - **Reimplementar `filterTripsAdvanced()` localmente:**
    ```typescript
    function localFilterTrips(
      allTrips: Trip[], allDests: Destination[],
      filters: { category?: DestinationCategory, tag?: TripTag, continentId?: string, query?: string }
    ): Trip[] {
      return allTrips.filter(t => {
        const dest = allDests.find(d => d.id === t.destinationId)
        if (filters.category && !dest?.categories.includes(filters.category)) return false
        if (filters.tag && !t.tags.includes(filters.tag)) return false
        if (filters.continentId && dest?.continentId !== filters.continentId) return false
        if (filters.query) {
          const q = filters.query.toLowerCase()
          if (!dest?.name.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q)) return false
        }
        return true
      })
    }
    ```
  - **Línea 31-38 (categoryFilters):** Mantener hardcodeado (labels de UI).
  - **Línea 44:** `popularDestinations = destinations.slice(0, 6)` → usar `props.destinations.slice(0, 6)`.
  - **Líneas 115-116:** `dest.heroImage`, `country.flag` → ya vienen de props con datos de Sanity.
  - **Línea 269:** `trips.filter(t => t.status !== "full").length` → usar `props.trips.filter(...)`.

**Skills/Comandos/Herramientas obligatorias:**
- Lectura completa de `src/components/SearchPage.tsx` (~788 líneas)
- Lectura de `filterTripsAdvanced` y `searchDestinations` en `src/lib/travel-data.ts` para replicar la lógica
- StrReplace para múltiples ediciones

**Validación:**
- `npm run build` compila
- Los filtros por categoría, tag, continente y búsqueda de texto funcionan
- Las tarjetas de viaje muestran imágenes de Sanity CDN
- El contador de viajes disponibles es correcto
- Los destinos populares se muestran correctamente
- No queda ningún import de `travel-data.ts` (excepto types)

---

## [DONE] Tarea 9 — Limpiar `data-provider.ts` (eliminar re-exports hardcodeados)

**Effort:** low
**Work:** auto
**Focus:** backend

**Objetivo:** Eliminar la re-exportación de `getDestinationFaqs`, `getDestinationPhotos` y `getTripExtra` desde `data-provider.ts`, ya que ya no se usan. Mantener `lookupCoords` como fallback temporal.

**Descripción humana:** El fichero que coordina los datos re-exportaba funciones del fichero hardcodeado que ya no hacen falta. Este paso elimina esas re-exportaciones para que no quede código muerto.

**Detalle técnico:**
- **Archivo:** `src/lib/data-provider.ts`
  - **Línea 71:** Eliminar `import { getDestinationFaqs, getDestinationPhotos, getTripExtra, lookupCoords } from './destination-details'` — reemplazar por `import { lookupCoords } from './destination-details'` (mantener solo lookupCoords).
  - **Línea 524:** Eliminar `export { getDestinationFaqs, getDestinationPhotos, getTripExtra, lookupCoords }` — reemplazar por `export { lookupCoords }`.
- **Verificar** que ningún otro archivo importa `getDestinationFaqs`, `getDestinationPhotos` o `getTripExtra` desde `data-provider`. Usar grep/búsqueda en el proyecto.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para buscar imports de `getDestinationFaqs`, `getDestinationPhotos`, `getTripExtra` en todo el proyecto
- StrReplace en `data-provider.ts`

**Validación:**
- `npm run build` compila sin errores
- No hay imports huérfanos de estas funciones en ningún archivo
- `lookupCoords` sigue disponible via `data-provider.ts`

---

## [DONE] Tarea 10 — Limpiar `destination-details.ts` (datos obsoletos)

**Effort:** low
**Work:** auto
**Focus:** backend

**Objetivo:** Eliminar los datos hardcodeados que ya han sido reemplazados por Sanity: `destinationPhotos`, `destinationFaqs`, `tripExtras` y sus funciones getter. Mantener `lookupCoords`, `LOCATION_COORDS` y los types exportados.

**Descripción humana:** El fichero que contenía fotos genéricas, preguntas frecuentes inventadas y precios de ejemplo ya no se necesita (salvo la tabla de coordenadas). Se limpia para que no quede código muerto que confunda.

**Detalle técnico:**
- **Archivo:** `src/lib/destination-details.ts`
  - **Eliminar:** `photo()`, `photos()` helpers (líneas 23-27)
  - **Eliminar:** `destinationPhotos` record completo (líneas 29-55)
  - **Eliminar:** `destinationFaqs` record completo (líneas 57-203)
  - **Eliminar:** `tripExtras` record completo (líneas 205-273)
  - **Eliminar:** `getDestinationPhotos()` función (líneas 351-353)
  - **Eliminar:** `getDestinationFaqs()` función (líneas 355-357)
  - **Eliminar:** `getTripExtra()` función (líneas 359-361)
  - **Mantener:** `DestinationFAQ`, `ItineraryCoord`, `TripExtra` types (si aún se referencian en el proyecto)
  - **Mantener:** `LOCATION_COORDS` record y `lookupCoords()` función
- **Verificar** que ningún archivo del proyecto importa las funciones o datos eliminados.

**Skills/Comandos/Herramientas obligatorias:**
- Grep para verificar que no quedan imports de las funciones/datos eliminados
- StrReplace o reescritura completa del archivo

**Validación:**
- `npm run build` compila sin errores
- `lookupCoords` sigue funcionando (usado como fallback en Tarea 1)
- No hay imports rotos en ningún archivo del proyecto
- El archivo `destination-details.ts` contiene solo types y la tabla de coordenadas

---

## [DONE] Tarea 11 — Revisión General y Optimización

**Effort:** high
**Work:** auto
**Focus:** fullstack

**Objetivo:** Auditar todos los archivos modificados a lo largo de la feature para buscar inconsistencias de integración, errores de tipado, regresiones y oportunidades de optimización. Comparar con el concepto original para confirmar que la implementación cubre todos los puntos.

**Descripción humana:** Este es el paso final de control de calidad. Se revisan todos los cambios para asegurarse de que todo funciona bien junto, no hay errores y el resultado final se corresponde con lo que se planificó en el concepto.

**Detalle técnico:**

1. **Auditoría de archivos modificados:**
   - `src/pages/destino/[slug].astro` — No usa `getTripExtra`, fotos/FAQs de Sanity, itinerario de `mapTrip()`
   - `src/pages/index.astro` — Pasa props correctas a `SeasonExplorer` y `SearchIsland`
   - `src/pages/viajes.astro` — Pasa props correctas a `SearchPage`
   - `src/components/SeasonExplorer.tsx` — Sin imports de `travel-data.ts` (solo types)
   - `src/components/SearchIsland.tsx` — Sin imports de `travel-data.ts` (solo types)
   - `src/components/SearchPage.tsx` — Sin imports de `travel-data.ts` (solo types)
   - `src/lib/data-provider.ts` — Sin re-exports de funciones hardcodeadas (excepto `lookupCoords`)
   - `src/lib/destination-details.ts` — Solo contiene types y `lookupCoords`/`LOCATION_COORDS`
   - `src/lib/utils.ts` — `resolvePrice()` funciona correctamente sin segundo argumento

2. **Verificación contra el concepto (`concepts/CONCEPT_fixHardcodedData.md`):**
   - [x] Itinerario restaurado y viene del destino/override de Sanity (Paso 1 del concepto)
   - [x] Incluye/no-incluye viene del merge correcto (siteSettings + destination + trip) (Paso 2)
   - [x] Fotos del lightbox son de la galería de Sanity (Paso 3)
   - [x] FAQs del destino son de Sanity (Paso 3)
   - [x] `SeasonExplorer` recibe datos via props (Pasos 4-5)
   - [x] `SearchIsland` recibe datos via props (Pasos 4-5)
   - [x] `SearchPage` recibe datos via props (Pasos 6-7)
   - [x] `destination-details.ts` limpiado (Paso 10)

3. **Edge cases a verificar (del concepto):**
   - Serialización JSON de props Astro → React: no hay `SanityImageSource` sin resolver
   - Galería vacía: fallback a `[heroImage]`, lightbox no rompe
   - FAQs vacías: sección oculta, schema LD+JSON no se renderiza
   - Itinerario vacío: verificar si hay fallback UI o se oculta la sección
   - `lookupCoords` como fallback temporal funciona para itinerarios sin lat/lng en Sanity
   - IDs de Sanity: los lookups `destinations.find(d => d.id === trip.destinationId)` funcionan con `_id`

4. **Chequeos finales:**
   - `npm run build` — build completo sin errores ni warnings
   - Grep global: no queda ningún `import.*from.*travel-data` en componentes React (solo types permitidos)
   - Grep global: no queda ningún `getDestinationPhotos`, `getDestinationFaqs`, `getTripExtra` en archivos `.astro`
   - TypeScript: `npx tsc --noEmit` sin errores
   - Tamaño del bundle: verificar que no hay impacto negativo significativo

**Skills/Comandos/Herramientas obligatorias:**
- Grep para búsqueda de imports residuales
- `npm run build` para verificar build completo
- `npx tsc --noEmit` para verificar tipos
- Lectura de `concepts/CONCEPT_fixHardcodedData.md` para comparación final

**Validación:**
- Build exitoso sin errores ni warnings
- Cero imports de `travel-data.ts` en componentes React (excepto types)
- Cero usos de funciones hardcodeadas eliminadas
- Todos los puntos del concepto cubiertos
- Edge cases verificados
