# CONCEPT: fixHardcodedData

## Problema detectado

Existen **tres componentes React** que importan datos directamente del módulo hardcodeado `travel-data.ts` en lugar de recibir datos de Sanity vía props. Además, el sistema de fotos y FAQs de destinos usa `destination-details.ts` con datos inventados (picsum.photos) en vez de la galería de Sanity.

Además, el **itinerario** y la sección de **incluye / no incluye** se obtienen del modelo de viaje (trip), cuando deberían venir del modelo de **destino** (destination). Al migrar a Sanity, el itinerario ha desaparecido de la página porque los IDs de Sanity no coinciden con los hardcodeados de `destination-details.ts`, y el flujo de `destino/[slug].astro` depende de `getTripExtra()` que no encuentra los trips de Sanity.

Resultado visible: las fotos no son de Sanity, las categorías del explorador usan lógica hardcodeada, la página `/viajes` muestra imágenes locales en vez de las del CMS, el itinerario ha desaparecido del diseño, y los datos de incluye/no-incluye siguen siendo del modelo de viaje en vez de destino.

---

## Arquitectura actual (causa raíz)

```
┌──────────────────────┐
│  Astro pages (.astro) │  ← Llaman a data-provider.ts (async, server-side)
│  index.astro          │     → Pasan datos como props a componentes Astro ✅
│  viajes.astro         │     → NO pasan datos a componentes React ❌
│  destino/[slug].astro │     → Usa getDestinationPhotos() de destination-details.ts (picsum) ❌
│                       │     → Usa getTripExtra() con IDs hardcodeados (itinerario roto) ❌
│                       │     → Usa getDestinationFaqs() hardcodeado ❌
│                       │     → Itinerario/incluye viene del trip, no del destino ❌
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  React components     │  ← Importan DIRECTAMENTE de travel-data.ts (hardcodeado)
│  SeasonExplorer.tsx   │     import { trips, destinations, ... } from "@/lib/travel-data" ❌
│  SearchPage.tsx       │     import { trips, destinations, ... } from "@/lib/travel-data" ❌
│  SearchIsland.tsx     │     import { destinations, continents, ... } from "@/lib/travel-data" ❌
│  TripDetailPage.tsx   │     → Itinerario vacío si Sanity no tiene datos ❌
└──────────────────────┘
```

Los componentes React se ejecutan en el cliente (`client:load`), por lo que **no pueden llamar a funciones async del data-provider** (que hace fetch a Sanity en el servidor). La única vía es recibir los datos como props desde la página Astro padre.

---

## Inventario de datos hardcodeados

### 1. `SeasonExplorer.tsx` (Home — "Explora por inspiración")

| Línea | Dato hardcodeado | Origen actual | Origen correcto |
|-------|-----------------|---------------|-----------------|
| 1-8 | `trips`, `destinations`, `getTripsByCategory`, `getTripsByTag` | `travel-data.ts` | Props desde `index.astro` |
| 39-48 | Array `categories` con filtros de categoría | Hardcoded en componente | Props (tripCategories de Sanity) o mantener como UI estática |
| 105-106 | `destinations.find(d => d.id === trip.destinationId)` | Lookup en hardcoded data | Recibir destinations como prop |
| 120 | `dest.heroImage` | `/images/hero-*.jpg` (local) | URL de Sanity CDN |

### 2. `SearchPage.tsx` (Página `/viajes`)

| Línea | Dato hardcodeado | Origen actual | Origen correcto |
|-------|-----------------|---------------|-----------------|
| 1-13 | `trips`, `destinations`, `continents`, `countries`, `searchDestinations`, `filterTripsAdvanced` | `travel-data.ts` | Props desde `viajes.astro` |
| 31-38 | `categoryFilters` | Hardcoded en componente | Props o mantener como UI estática |
| 44 | `popularDestinations = destinations.slice(0, 6)` | Hardcoded slice | Prop o calcular en server |
| 115-116 | `dest.heroImage`, `country.flag` en TripCard | Hardcoded data | Props de Sanity |
| 269 | `trips.filter(t => t.status !== "full").length` | Hardcoded trips | Prop: totalAvailableTrips |

### 3. `SearchIsland.tsx` (Home — Hero Search)

| Línea | Dato hardcodeado | Origen actual | Origen correcto |
|-------|-----------------|---------------|-----------------|
| 1-7 | `destinations`, `continents`, `searchDestinations` | `travel-data.ts` | Props desde `index.astro` |
| 27 | `popularDestinations = destinations.slice(0, 4)` | Hardcoded slice | Prop |
| 99 | `destinations.length` en contador | Hardcoded count | Prop |
| 153 | `dest.heroImage` en sugerencias de búsqueda | `/images/hero-*.jpg` | URL de Sanity CDN |

### 4. `destination-details.ts` (Fotos y FAQs de destinos)

| Función | Dato hardcodeado | Solución |
|---------|-----------------|----------|
| `getDestinationPhotos()` | URLs de `picsum.photos` (fotos genéricas) | Usar campo `gallery` de Sanity (ya existe en el schema de `destination`) |
| `getDestinationFaqs()` | FAQs hardcodeadas por destino | Usar campo `faqs` de Sanity (ya existe en el schema de `destination`) |
| `getTripExtra()` | Precios promo hardcodeados | Usar campos `promoPrice`/`promoLabel` del trip en Sanity (ya existen) |
| `lookupCoords()` | Coordenadas por nombre de ciudad | Usar campo `coordinates` de Sanity o lat/lng del itinerario |

### 5. `destino/[slug].astro` (Página de detalle del destino)

| Línea | Dato hardcodeado | Origen actual | Origen correcto |
|-------|-----------------|---------------|-----------------|
| 52-63 | `getTripExtra(t.id)` para itinerario y precios | `destination-details.ts` con IDs hardcodeados | Datos directos de Sanity (ya vienen en el trip/destination) |
| 71 | `photos = getDestinationPhotos(destination.id)` | `picsum.photos` | `destination.gallery` de Sanity (resolver URLs con `urlFor()`) |
| 72 | `faqs = getDestinationFaqs(destination.id)` | Hardcoded en `destination-details.ts` | `destination.faqs` directamente de Sanity |

### 6. Itinerario — origen incorrecto y desaparecido

**Estado actual del flujo del itinerario:**

```
destino/[slug].astro (líneas 52-63):
  para cada trip:
    extra = getTripExtra(t.id)           ← busca en destination-details.ts por ID hardcodeado
    itinerary = extra.itinerary          ← si encuentra, usa el hardcodeado con coords
                || t.itinerary.map(...)  ← si no, usa el itinerario del trip con lookupCoords()
```

**Por qué desapareció:**
- Cuando Sanity está configurado, los trip IDs son UUIDs (ej: `abc123-def456...`), no strings como `"japon-ss-2026"`
- `getTripExtra("abc123-def456...")` NO encuentra nada en el mapa `tripExtras` de `destination-details.ts`, devuelve `{}`
- `extra.itinerary` es `undefined`, así que cae al fallback `t.itinerary`
- `t.itinerary` viene de `mapTrip()` en `data-provider.ts`, que resuelve: `overrideItinerary.length > 0 ? override : destItinerary`
- Si el destino en Sanity NO tiene `itinerary` poblado → array vacío → el itinerario desaparece del diseño

**Modelo de datos incorrecto:**

El itinerario está duplicado en dos sitios incompatibles:

| Modelo | Campo | Uso actual |
|--------|-------|-----------|
| `travel-data.ts` (Trip hardcoded) | `trip.itinerary` | Array de 3 días resumidos por trip |
| `destination-details.ts` (TripExtras hardcoded) | `tripExtras[tripId].itinerary` | Array completo con coordenadas, solo para algunos trips |
| Sanity Destination schema | `destination.itinerary` | Campo `itineraryDay[]` — **el correcto**, pero puede estar vacío |
| Sanity Trip schema | `trip.itineraryOverride` | Override opcional por viaje |

**El modelo correcto es:**
- El itinerario **base** vive en el **destino** (Sanity `destination.itinerary`)
- Cada viaje puede tener un **override** opcional (`trip.itineraryOverride`)
- `data-provider.ts` ya implementa esta lógica en `mapTrip()`, pero el destino necesita tener el itinerario poblado en Sanity

### 7. Incluye / No incluye — origen incorrecto

**Estado actual:**

```
TripDetailPage.tsx (líneas 838, 858):
  featured.included     ← viene del trip
  featured.notIncluded  ← viene del trip
```

**Flujo en `data-provider.ts` `mapTrip()`:**
```
included = [
  ...siteSettings.defaultIncluded,          ← "Alojamiento", "Transporte", etc.
  ...destination.extraIncluded,             ← "Japan Rail Pass", "Crucero Nilo"
  ...trip.extraIncluded                     ← override del viaje (normalmente vacío)
]
```

**El problema:**
- En el hardcoded `travel-data.ts`, cada trip tiene su propia lista `included[]` y `notIncluded[]` completa y redundante
- En Sanity, la estructura correcta es: `siteSettings.defaultIncluded` + `destination.extraIncluded` + `trip.extraIncluded` (merge)
- `data-provider.ts` YA implementa este merge correctamente en `mapTrip()` con `ctx`
- PERO: `destino/[slug].astro` aplica DESPUÉS `getTripExtra(t.id)` que busca en `destination-details.ts` y puede sobreescribir todo

**Modelo correcto (ya soportado en Sanity):**

| Nivel | Campo | Ejemplo |
|-------|-------|---------|
| Site Settings | `defaultIncluded` | "Alojamiento", "Transporte interno", "Coordinador Travelhood" |
| Site Settings | `defaultNotIncluded` | "Vuelo internacional", "Comidas no especificadas", "Gastos personales" |
| Destination | `extraIncluded` | "Japan Rail Pass" (Japón), "Crucero por el Nilo" (Egipto) |
| Destination | `extraNotIncluded` | "Ropa térmica" (Laponia) |
| Trip | `extraIncluded` | Override puntual (normalmente vacío) |
| Trip | `extraNotIncluded` | Override puntual (normalmente vacío) |

---

## Flujos del sistema (arquitectura propuesta)

```
┌─────────────────────────┐
│  Astro pages (.astro)    │
│  └─ Llaman data-provider │  → Sanity fetch (server-side)
│     └─ Pasan TODO como   │
│        props a React     │
└──────┬──────────────────┘
       │ props: { trips, destinations, continents, countries, ... }
       ▼
┌─────────────────────────┐
│  React components        │
│  └─ CERO imports de      │  ← Solo usan props y estado local
│     travel-data.ts       │
│  └─ Filtrado/búsqueda   │  ← Lógica de filtro en el propio componente
│     local en memoria     │     (ya tienen los datos completos en props)
└─────────────────────────┘
```

### Flujo para `index.astro` → `SeasonExplorer`

```
index.astro:
  const [trips, destinations] = await Promise.all([getTrips(), getDestinations()])
  <SeasonExplorer trips={trips} destinations={destinations} client:load />

SeasonExplorer.tsx:
  props: { trips: Trip[], destinations: Destination[] }
  // Filtrado interno por categoría usando props.trips y props.destinations
```

### Flujo para `viajes.astro` → `SearchPage`

```
viajes.astro:
  const [trips, destinations, continents, countries] = await Promise.all([...])
  <SearchPage
    trips={trips}
    destinations={destinations}
    continents={continents}
    countries={countries}
    client:load
  />

SearchPage.tsx:
  props: { trips, destinations, continents, countries }
  // Toda la lógica de filtro/búsqueda usando props
  // searchDestinations() se reimplementa localmente con props.destinations
  // filterTripsAdvanced() se reimplementa localmente con props.trips + props.destinations
```

### Flujo para `destino/[slug].astro` → `TripDetailPage`

```
destino/[slug].astro:

  // 1. FOTOS — de Sanity gallery en vez de picsum
  const destRaw = await getDestinationRaw(slug)
  const photos = destRaw?.gallery?.map(img => urlFor(img).width(800).url()) ?? [destination.heroImage]

  // 2. FAQs — de Sanity en vez de destination-details.ts
  const faqs = destRaw?.faqs?.map(f => ({ question: f.question, answer: f.answer })) ?? []

  // 3. ITINERARIO — del destino/trip de Sanity, NO de getTripExtra()
  const destTrips = tripsRaw.map(t => ({
    ...t,
    itinerary: t.itinerary.map(d => ({
      ...d,
      lat: d.lat ?? lookupCoords(d.title)?.[0] ?? 0,
      lng: d.lng ?? lookupCoords(d.title)?.[1] ?? 0,
    })),
  }))

  // 4. INCLUYE/NO-INCLUYE — ya viene mergeado en t.included / t.notIncluded
  //    desde data-provider.ts mapTrip() = siteSettings + destination + trip
```

### Modelo de datos correcto: Destino como fuente principal

```
┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐
│  Site Settings   │     │   Destination    │     │     Trip      │
│  ─────────────   │     │   ───────────    │     │   ────────    │
│  defaultIncluded │     │  itinerary[]     │ ←── │  itineraryOvr │ (override)
│  defaultNotIncl. │     │  extraIncluded   │     │  extraIncl.   │
│                  │     │  extraNotIncl.   │     │  extraNotIncl.│
│                  │     │  gallery[]       │     │  promoPrice   │
│                  │     │  faqs[]          │     │  promoLabel   │
│                  │     │  heroImage       │     │               │
└────────┬────────┘     └────────┬────────┘     └───────┬───────┘
         │                       │                       │
         └──────── MERGE ────────┴───────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Trip final   │
              │  ───────────  │
              │  included[]   │ = settings + dest + trip extras
              │  notIncluded[]│ = settings + dest + trip extras
              │  itinerary[]  │ = dest.itinerary || trip.override
              │  promoPrice   │ = trip field
              │  promoLabel   │ = trip field
              └───────────────┘
```

---

## Solución óptima

### Paso 1: Corregir itinerario y incluye/no-incluye en `destino/[slug].astro`

**CRÍTICO — arregla el itinerario desaparecido.**

- Eliminar la dependencia de `getTripExtra(t.id)` del hardcoded `destination-details.ts`
- El itinerario ya viene resuelto en `t.itinerary` desde `mapTrip()` de `data-provider.ts`:
  - Si el trip tiene `itineraryOverride` → usa ese
  - Si no → usa `destination.itinerary` del destino en Sanity
- Las coordenadas: usar `lookupCoords()` como fallback temporal para trips cuyo itinerario no tenga lat/lng en Sanity
- Los precios promo: ya vienen del trip en Sanity (`t.promoPrice`, `t.promoLabel`), no necesitan `getTripExtra()`

**Cambio en `destino/[slug].astro`:**
```
// ANTES (roto con Sanity):
const destTrips = tripsRaw.map((t) => {
  const extra = getTripExtra(t.id);           // ← busca por ID hardcodeado, no encuentra nada
  const resolved = resolvePrice(t, extra);
  return {
    ...t,
    itinerary: extra.itinerary || t.itinerary.map(d => ({ ...d, lat: ..., lng: ... })),
  };
});

// DESPUÉS (funciona con Sanity):
const destTrips = tripsRaw.map((t) => ({
  ...t,
  promoPrice: t.promoPrice,                   // ← ya viene del trip de Sanity
  promoLabel: t.promoLabel,
  itinerary: t.itinerary.map(d => ({          // ← ya viene del destino/override de Sanity
    ...d,
    lat: d.lat ?? lookupCoords(d.title)?.[0] ?? 0,
    lng: d.lng ?? lookupCoords(d.title)?.[1] ?? 0,
  })),
}));
```

### Paso 2: Corregir incluye/no-incluye para que vengan del destino

- `data-provider.ts` `mapTrip()` ya hace el merge correcto: `siteSettings + destination + trip`
- Verificar que `TripDetailPage.tsx` usa `featured.included` / `featured.notIncluded` (ya lo hace)
- Asegurar que en Sanity:
  - `siteSettings.defaultIncluded` esté poblado con ["Alojamiento", "Transporte interno", "Actividades incluidas", "Coordinador Travelhood"]
  - `siteSettings.defaultNotIncluded` esté poblado con ["Vuelo internacional", "Comidas no especificadas", "Gastos personales"]
  - Cada destination tenga `extraIncluded` si aplica (ej: "Japan Rail Pass" en Japón)

### Paso 3: Fotos y FAQs del destino desde Sanity

- En `destino/[slug].astro`:
  - **Fotos**: extraer del campo `gallery` de Sanity (ya existe en el schema) usando `urlFor()`. Fallback: usar `[destination.heroImage]` si la galería está vacía
  - **FAQs**: extraer del campo `faqs` del destino de Sanity (ya existe en la query `destinationBySlugQuery`). Fallback: array vacío (la sección se oculta)
- Eliminar imports de `getDestinationPhotos` y `getDestinationFaqs` de `destination-details.ts`
- Crear helpers en `data-provider.ts`:
  - `getDestinationGallery(slug)` → resuelve las imágenes de la galería a URLs con `urlFor()`
  - Las FAQs ya se incluyen en `destinationBySlugQuery` → extraerlas directamente

### Paso 4: Actualizar `index.astro` — pasar datos a SeasonExplorer y SearchIsland

- Fetch `trips`, `destinations`, `continents` desde `data-provider.ts` (ya se hace parcialmente)
- Pasar como props a `<SeasonExplorer>` y `<SearchIsland>`

### Paso 5: Refactorizar `SeasonExplorer.tsx`

- Cambiar la firma del componente para aceptar `trips` y `destinations` como props
- Eliminar import de `travel-data.ts`
- Reimplementar `getTripsByCategory()` y `getTripsByTag()` como funciones locales que operan sobre props
- Las categorías de UI (los chips de "Playa & Sol", "Safari & Aventura", etc.) pueden seguir hardcodeadas ya que son filtros de UI, no datos de contenido

### Paso 6: Actualizar `viajes.astro` — pasar datos a SearchPage

- Fetch `trips`, `destinations`, `continents`, `countries` desde `data-provider.ts`
- Pasar como props a `<SearchPage>`

### Paso 7: Refactorizar `SearchPage.tsx`

- Cambiar la firma para aceptar `trips`, `destinations`, `continents`, `countries` como props
- Eliminar import de `travel-data.ts`
- Reimplementar `searchDestinations()` y `filterTripsAdvanced()` como funciones locales
- Las imágenes de los destinos ahora serán URLs de Sanity CDN (vienen en `destinations[].heroImage`)

### Paso 8: Refactorizar `SearchIsland.tsx`

- Cambiar la firma para aceptar `destinations`, `continents` como props
- Eliminar import de `travel-data.ts`
- Reimplementar `searchDestinations()` como función local

### Paso 9: Actualizar `data-provider.ts`

- Ampliar `Destination` type para incluir `gallery` y `faqs` cuando se obtiene por slug (detalle)
- Crear helper `getDestinationGallery(slug)` que devuelva URLs string resueltas con `urlFor()`
- Verificar que `mapTrip()` propaga correctamente `included`/`notIncluded` mergeados

### Paso 10: Limpiar `destination-details.ts`

- Eliminar `destinationPhotos` (reemplazado por `gallery` de Sanity)
- Eliminar `destinationFaqs` (reemplazado por `faqs` de Sanity)
- Eliminar `tripExtras` (reemplazado por campos del trip en Sanity)
- Mantener `lookupCoords()` temporalmente como fallback para coords
- Mantener tipos exportados (`DestinationFAQ`, `ItineraryCoord`) si aún se usan

---

## Edge Cases y Blind Spots

### 1. Serialización de props Astro → React
- Astro serializa props de componentes `client:*` como JSON. Los objetos de Sanity con `_type`, `_ref`, etc. deben resolverse a tipos simples **antes** de pasar como props
- Las imágenes de Sanity (`SanityImageSource`) deben resolverse a URLs string con `urlFor()` en el lado Astro, no en React

### 2. Tamaño del payload de props
- Pasar `trips[]` + `destinations[]` + `continents[]` + `countries[]` como props a `SearchPage` implica un JSON inline en el HTML
- Con ~35 trips y ~25 destinations, el payload es ~50-80KB (aceptable)
- Si escala mucho, considerar una API route en Astro o paginación server-side

### 3. Fallback cuando Sanity no tiene datos
- `data-provider.ts` ya maneja el fallback a datos hardcoded cuando `!isSanityConfigured()`
- Asegurarse de que las galerías vacías en Sanity no rompan el lightbox (necesita al menos 1 foto o mostrar heroImage como fallback)

### 4. FAQs vacías en Sanity
- Si un destino no tiene FAQs en Sanity, la sección FAQ debería ocultarse (no mostrar un bloque vacío)
- Actualmente `destination-details.ts` tiene FAQs hardcodeadas para todos los destinos — al migrar, verificar que Sanity tenga datos poblados

### 5. Campo `gallery` no incluido en `allDestinationsQuery`
- La query `allDestinationsQuery` NO incluye `gallery` (solo la incluye `destinationBySlugQuery`)
- Esto es correcto: la galería solo se necesita en la página de detalle, no en listados
- Pero para el detalle, necesitamos asegurar que se pasa como prop

### 6. IDs de Sanity vs IDs hardcodeados
- En Sanity los IDs son `_id` (UUIDs), en hardcoded son strings como `"japon"`, `"brasil"`
- `mapDestination()` ya usa `s._id` como `id` — las lookups como `destinations.find(d => d.id === trip.destinationId)` funcionarán si trip.destinationId también es el `_id` de Sanity

### 7. `destination-details.ts` sigue siendo necesario parcialmente
- `lookupCoords()` se usa para mapear nombres de ciudades a coordenadas en el itinerario — esto no tiene equivalente directo en Sanity a menos que los itineraryDay tengan lat/lng (el schema lo soporta pero puede no estar poblado)
- `tripExtras` hardcodeado tiene precios promo que ya deberían estar en Sanity (campos `promoPrice`/`promoLabel` del trip)

### 8. Imágenes del hero de la home
- `SearchIsland.tsx` referencia `/images/hero-main.jpg` como imagen de fondo del hero — esto es un asset estático, no de Sanity. Puede mantenerse así o migrarse a Site Settings

### 9. Consistencia de categorías entre UI y datos
- Los chips de categoría ("Playa & Sol", "Safari & Aventura") son labels de UI que mapean a valores de Sanity (`playa`, `aventura`, `nieve`, `cultural`, `naturaleza`)
- Estos labels de UI pueden mantenerse hardcodeados en los componentes ya que son parte del diseño, no contenido editable

### 10. Itinerario vacío en Sanity
- Si el campo `itinerary` del destino en Sanity NO está poblado, la sección de itinerario desaparece (array vacío)
- **Acción requerida**: Poblar el campo `itinerary` en cada destino en Sanity Studio con los datos completos (día, título, descripción, lat, lng)
- **Fallback UI**: Si `featuredItinerary.length === 0`, mostrar un mensaje tipo "Itinerario disponible próximamente" en vez de no renderizar nada

### 11. Itinerario con/sin coordenadas
- El schema `itineraryDay` de Sanity tiene `lat` y `lng` opcionales
- Si no están poblados, `lookupCoords()` sirve como fallback para mostrar el mapa
- Si ni Sanity ni lookupCoords tienen coords → el mapa no se muestra (correcto, `RouteMap` devuelve null si `deduped.length < 2`)
- El accordion del itinerario sigue mostrándose sin mapa (correcto)

### 12. Incluye/No-incluye vacíos
- Si `siteSettings.defaultIncluded` no está poblado en Sanity, el merge usa el fallback hardcoded de `data-provider.ts` (`hardDefaultIncluded`)
- Si el destino no tiene `extraIncluded`, simplemente no se añade nada extra → solo se muestran los defaults
- La sección "Qué incluye y qué no" depende de `featured` (el primer trip) — si no hay trips, la sección se oculta (`{featured && ...}`)

### 13. `resolvePrice()` y la eliminación de `getTripExtra()`
- `resolvePrice()` en `utils.ts` acepta un segundo parámetro `extra` de `destination-details.ts`
- Al eliminar `getTripExtra()`, el precio promo ya viene directamente del trip de Sanity (`t.promoPrice`, `t.promoLabel`)
- `resolvePrice()` puede simplificarse o eliminarse, ya que el precio ya está resuelto en el trip
