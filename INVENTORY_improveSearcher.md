# INVENTORY improveSearcher

Estado: inventario de solo lectura para la tarea «Inventariar buscador, rutas y estados actuales».

Fecha de inventario: 2026-07-11

## Alcance ejecutado

- Revisados `src/components/SearchIsland.tsx`, `src/components/SearchPage.tsx`, `src/pages/index.astro`, `src/pages/viajes.astro` y `src/pages/destino/[slug].astro`.
- Revisados datos y tipos en `src/lib/data-provider.ts`, `src/lib/travel-data.ts`, `src/lib/queries.ts` y `src/lib/utils.ts`.
- Revisados componentes adyacentes con lógica de filtrado similar: `src/components/SeasonExplorer.tsx`.
- **No se modificó código de la feature.** Solo documentación.
- **No se revirtieron** cambios locales preexistentes en los archivos inspeccionados.

## Resumen ejecutivo (flujo actual)

```
Home (/)
  └─ SearchIsland (client:load)
       └─ CTA «Buscar» → window.location.href = `/viajes/?donde={id}&cuando={id}#resultados`
            (sin filtros → `/viajes/#resultados`)

/viajes/
  └─ SearchPage (client:load)
       ├─ Lee URL: ?donde & ?cuando & ?tipo + hash #resultados
       ├─ Filtra trips en cliente (where / when / category)
       ├─ Sincroniza filtros → history.replaceState en /viajes/?...
       └─ TripCard → enlace canónico `/destino/{slug}/`

/destino/{slug}/
  └─ getStaticPaths() desde getDestinations() → params.slug = destination.slug
```

**Rutas canónicas identificadas**

| Intención | Ruta canónica | Generación |
| --- | --- | --- |
| Exploración / filtrado de catálogo | `/viajes/` (+ query `donde`, `cuando`, `tipo` opcionales; anchor `#resultados`) | Página estática + island React |
| Destino concreto (evaluación / conversión) | `/destino/{slug}/` | SSG vía `getDestinations()` en `getStaticPaths()` |

## Archivos y responsabilidades

### `src/pages/index.astro` (Home)

- Carga en build: `getDestinations()`, `getTrips()`, `getContinents()`, `getSiteSettings()`, `getGlobalFaqs('home')`.
- Pasa a `SearchIsland` solo `destinations` y `continents` (`client:load`).
- CTAs secundarios enlazan a `/viajes/#resultados` (barra móvil fija) sin parámetros.
- `SeasonExplorer` recibe `trips` + `destinations` con filtrado propio (no comparte estado con el buscador).

### `src/components/SearchIsland.tsx` (Hero)

- Island React del buscador compacto en home.
- Props: `destinations: Destination[]`, `continents: Continent[]`.
- Selectores:
  - **Dónde**: continente (`type: "continent"`) o destino (`type: "destination"`).
  - **Cuándo**: temporada flexible (`type: "period"`) o mes (`type: "month"`).
- Autocompletado por `name`, `slug` y `categories` del destino.
- Continentes mostrados: solo los que tienen al menos un destino (`destinations.some(d => d.continentId === c.id)`).
- Destinos populares: `destinations.slice(0, 4)` (orden del provider, sin criterio de popularidad real).
- **Navegación al buscar** (`handleSearch`):

```ts
params.set("donde", selectedWhere.id)   // si hay selección
params.set("cuando", selectedWhen.id)   // si hay selección
window.location.href = (qs ? `/viajes/?${qs}` : "/viajes/") + "#resultados"
```

- No soporta filtro `tipo` (categoría).
- No sincroniza URL en el hero; hace navegación completa (full page load).

### `src/pages/viajes.astro` (Página de resultados)

- Carga en build: `getDestinations()`, `getTrips()`, `getContinents()`, `getCountries()`, `getSiteSettings()`.
- Pasa todo el catálogo al island `SearchPage` (`client:load`).
- SEO: breadcrumb + ItemList con URLs `/destino/{slug}/` por destino.
- Título/meta orientados a «buscar viaje en grupo».

### `src/components/SearchPage.tsx` (Resultados + buscador flotante)

- Island React de página completa: hero mini, barra de búsqueda, chips de categoría, grid de resultados, paginación, CTAs.
- Props: `trips`, `destinations`, `continents`, `countries`, `heroImage`, `heroImageAlt`, `whatsappPhone`.
- **Inicialización desde URL** (`parseUrlParams` en `useEffect` mount).
- **Sincronización saliente**: `updateUrl()` con `history.replaceState` cuando cambian filtros.
- **Botón Buscar** en `/viajes/`: no navega; hace scroll a `#resultados` (ya estás en la página).
- Filtrado (`filteredTrips`):
  1. Excluye `status === "full"`.
  2. Solo viajes futuros (`departureDate >= hoy`).
  3. `donde` destino → `trip.destinationId === whereValue.id`.
  4. `donde` continente → `dest.continentId === whereValue.id`.
  5. `cuando` periodo → `trip.tags.includes(whenValue.id)`.
  6. `cuando` mes → `departureDate.getMonth() === Number(whenValue.id)`.
  7. `tipo` categoría → `dest.categories.includes(categoryValue)` (si no es `"all"`).
  8. Orden por `departureDate` asc.
  9. `deduplicateTripsByDestination()` → 1 card por destino (viaje más próximo/barato).
- Paginación: 9 resultados/página.
- `TripCard` enlaza a `/destino/{dest.slug}/` (usa **slug** en URL pública, no `id`).
- Destinos populares: `destinations.slice(0, 6)` (distinto del hero: 4).

### `src/pages/destino/[slug].astro` (Destino)

- `getStaticPaths()`: `getDestinations().map(d => ({ params: { slug: d.slug } }))` — **confirmado**.
- Resolución de datos por `getDestinationBySlug(slug)`, `getTripsByDestination(slug)`, etc.
- Enlaces internos de salida relevantes para el buscador:
  - Cards relacionadas → `/destino/{slug}/`
  - «Ver catálogo de viajes» → `/viajes/`
  - Temporadas → `/temporada/{season.slug}/`
  - Tipos → `/tipos/{category}/`
  - Continente → `/destinos/{continent.slug}/`

## Parámetros URL y resolución de IDs

### Parámetros soportados en `/viajes/`

| Parámetro | Valores escritos | Valores aceptados al leer | Resolución |
| --- | --- | --- | --- |
| `donde` | `destination.id` o `continent.id` (lo que guarda el estado interno) | `id` **o** `slug` de continente/destino | `parseUrlParams` normaliza siempre a `.id` interno |
| `cuando` | `TripTag` (`semana-santa`, `verano`, …) o índice de mes `"0"`–`"11"` | Igual + mes como entero 0–11 | Periodo por lista `periods`; mes por `Number(cuando)` |
| `tipo` | `DestinationCategory` o `"all"` (no se escribe si es `all`) | Id de `categoryFilters` | Solo en `SearchPage`; **no lo emite el hero** |
| hash | `#resultados` | `#resultados` | Scroll automático al montar |

### Qué ID usa cada selector al **escribir**

| Selector | Campo guardado en estado | Valor en query `donde`/`cuando`/`tipo` |
| --- | --- | --- |
| Continente (ambos buscadores) | `continent.id` | `donde={continent.id}` |
| Destino (ambos buscadores) | `destination.id` | `donde={destination.id}` |
| Temporada flexible | `period.id` (`TripTag`) | `cuando={period.id}` |
| Mes | `String(monthIndex)` 0–11 | `cuando={monthIndex}` |
| Categoría (solo SearchPage) | `categoryFilters[].id` | `tipo={category}` |

### Qué ID usa cada selector al **leer / filtrar**

| Entidad | Match en `parseUrlParams` | Match en filtrado de trips |
| --- | --- | --- |
| `destination.id` | `d.id === donde \|\| d.slug === donde` → normaliza a `id` | `trip.destinationId === whereValue.id` |
| `destination.slug` | Aceptado en lectura; reescrito a `id` en estado | No se usa slug en filtro |
| `continent.id` | `c.id === donde \|\| c.slug === donde` → normaliza a `id` | `dest.continentId === whereValue.id` |
| `continent.slug` | Aceptado en lectura | No directo; requiere pasar por normalización |
| `TripTag` | `periods.find(p => p.id === cuando)` | `trip.tags.includes(tag)` |
| Mes | `Number(cuando)` entero 0–11 | `departureDate.getMonth()` |
| Categoría | `categoryFilters.find(c => c.id === tipo)` | `dest.categories.includes(tipo)` |

### Diferencia fallback vs Sanity (crítico para URLs)

| Fuente | `destination.id` | `destination.slug` | `continent.id` | `trip.destinationId` |
| --- | --- | --- | --- | --- |
| Hardcoded (`travel-data.ts`) | Igual al slug semántico (`"brasil"`) | Slug público (`"brasil"`) | Slug semántico (`"europe"`, `"south-america"`) | Mismo string que `destination.id` |
| Sanity (`data-provider`) | `_id` de documento Sanity | `slug.current` | `_id` del continente referenciado | `_id` del destino referenciado |

Implicación: las URLs con `donde=` emitidas por el buscador llevan **IDs internos** (en Sanity, IDs opacos), no slugs. La lectura tolera slugs por compatibilidad, pero la escritura no los usa. Las URLs públicas de destino sí usan slug: `/destino/{slug}/`.

## Datos mínimos del buscador vs carga actual

### Campos realmente consumidos por la UI de búsqueda

**Destination (mínimo)**

- `id`, `name`, `slug`, `continentId`, `categories`, `heroImage`, `shortDescription`

**Continent (mínimo)**

- `id`, `name`, `slug`

**Trip (mínimo para filtrar y card)**

- `id`, `destinationId`, `departureDate`, `status`, `tags`, `durationDays`, `priceFrom`, `promoPrice`, `promoLabel`, `flightEstimate`, `placesLeft`

**Country (mínimo para TripCard)**

- `id`, `name`, `flag` (vía `dest.countryId`)

### Carga actual (pesada)

| Página | Funciones data-provider | Observación |
| --- | --- | --- |
| `index.astro` | `getDestinations()`, `getTrips()`, `getContinents()`, … | Home serializa **destinos completos** al HTML del island aunque `SearchIsland` solo usa ~7 campos. También carga todos los trips para `SeasonExplorer`. |
| `viajes.astro` | `getDestinations()`, `getTrips()`, `getContinents()`, `getCountries()` | Serializa catálogo completo: destinos con `description`, `itinerary`, `faqs`, `gallery`, `climateByMonth`, `budgetPerDay`, `seo`, etc., más trips con `included`/`notIncluded`/`itinerary` mergeados. |

`getDestinations()` ejecuta `allDestinationsQuery` (Sanity) o devuelve el array hardcoded completo — **no existe hoy un endpoint/query «lite» para el buscador**.

## Duplicaciones detectadas

### 1. Listas de temporadas (`periods` / `TripTag`)

Duplicadas literalmente en:

- `SearchIsland.tsx` (líneas 6–15, sin tipado `TripTag`)
- `SearchPage.tsx` (líneas 84–93, tipado `{ id: TripTag; label: string }[]`)

Mismos 8 valores: `semana-santa`, `puente-mayo`, `verano`, `septiembre`, `puente-octubre`, `puente-noviembre`, `navidad`, `fin-de-anio`.

Fuente de verdad tipada: `TripTag` en `src/lib/travel-data.ts`. También alineado con entidad `season` del dominio y páginas `/temporada/{slug}/`.

### 2. Nombres de meses

- `monthNames` (abreviados): duplicado en `SearchIsland.tsx` y `SearchPage.tsx`.
- `monthNamesFull`: solo en `SearchPage.tsx` (labels al seleccionar mes y al parsear URL).

### 3. Emojis de continente (`continentEmoji`)

Duplicado idéntico en `SearchIsland.tsx` y `SearchPage.tsx`. Claves = `continent.id` hardcoded (`europe`, `asia`, …). **Riesgo en Sanity**: si `continent.id` es `_id` opaco, el mapa de emojis no encuentra clave y no muestra emoji.

### 4. Hook `useClickOutside`

Copiado en `SearchIsland.tsx` y `SearchPage.tsx` (misma implementación).

### 5. UI del selector «Dónde» (estructura y lógica)

Patrón casi gemelo entre ambos componentes:

- Estado `selectedWhere` / `whereValue`, dropdown, input de búsqueda, sugerencias, grid de continentes, lista de populares.
- Misma función de sugerencias (`name`, `slug`, `categories`).
- Diferencias menores de copy, tamaños de imagen y recuento de populares (4 vs 6).

### 6. UI del selector «Cuándo»

Patrón gemelo: tabs flexible/meses, misma lista de periodos, misma grilla de meses.

Diferencias de copy:

| Elemento | SearchIsland | SearchPage |
| --- | --- | --- |
| Tab temporada | «Flexible» | «Temporada» |
| Label mes seleccionado | Abreviado (`Ene`) | Completo (`Enero`) |

### 7. Chips de categoría / filtrado por tipo

Tres implementaciones distintas:

| Ubicación | Chips | Lógica |
| --- | --- | --- |
| `SearchPage.tsx` | `categoryFilters`: Todos, Playa, Safari, Auroras/Nieve, Cultura, Naturaleza | Filtra `dest.categories`; sincroniza `tipo` en URL |
| `SeasonExplorer.tsx` | Todos, Playa, Safari, Auroras, **Puentes**, **Verano**, Cultura, **Navidad & Fin de Año** | Combina tags + categorías; ids distintos (`auroras`, `puentes`, `navidad`) |
| `SearchIsland.tsx` | — | No tiene filtro de tipo |

Los labels «Safari & Aventura» / «Auroras & Nieve» se repiten entre `SearchPage` y `SeasonExplorer` con ids diferentes para nieve (`nieve` vs `auroras`).

### 8. Lógica de filtrado de viajes

- `SearchPage`: filtro compuesto where/when/tipo + futuro + no-full + dedup + paginación.
- `SeasonExplorer`: filtro por categoría/tag propio + dedup; **no** excluye viajes pasados explícitamente (solo `status !== "full"`).
- `LastChance.astro`, `ofertas.astro`, `/temporada/[slug].astro`: patrones similares fuera del buscador (no unificados).

### 9. Deduplicación por destino

`deduplicateTripsByDestination()` en `src/lib/utils.ts` — compartida por `SearchPage` y `SeasonExplorer` (único punto común actual).

## Estados y comportamientos divergentes

| Comportamiento | SearchIsland (hero) | SearchPage (/viajes/) |
| --- | --- | --- |
| Acción «Buscar» | Navegación a `/viajes/?…#resultados` | Scroll a `#resultados` in-page |
| Sync URL | No | `replaceState` continuo |
| Filtro `tipo` | No existe | Chips + param `tipo` |
| Popstate / back | No escucha | Re-parsea URL en `popstate` |
| Enter en input dónde | Dispara búsqueda (`handleKeyDown`) | No enlazado a buscar |
| Texto libre sin selección | Permite buscar sin `selectedWhere` (solo pone query visual, no filtra) | Igual: texto sin selección no filtra resultados |
| Viajes pasados | N/A (no filtra) | Excluidos (`isUpcomingTrip`) |
| Anchor `#resultados` | Destino de navegación | Scroll al montar si hash presente |

**Hallazgo UX**: escribir un destino en el input sin pulsar una sugerencia no aplica filtro ni en hero ni en `/viajes/`; solo afecta el texto mostrado hasta que se selecciona un ítem del dropdown.

## Navegación y embudo (growth / dominio)

Flujo documentado en `domain` skill:

> Descubrimiento: Home → buscador → `/viajes/#resultados` → Evaluación: `/destino/[slug]/`

- El hero cumple el primer salto con query params opcionales.
- La conversión final ocurre en `/destino/{slug}/` (WhatsApp, fechas, precio).
- `SearchPage` incluye bloque SEO answer-first, trust strip y CTA WhatsApp al pie (alineado con growth-standards).
- Mobile: barra fija en home apunta a `/viajes/#resultados` sin filtros.

## Cambios locales no relacionados (no revertidos)

Al inspeccionar el working tree:

| Archivo | Estado git | Cambios no relacionados con improveSearcher |
| --- | --- | --- |
| `SearchIsland.tsx` | Limpio (sin diff) | — |
| `SearchPage.tsx` | Limpio (sin diff) | — |
| `index.astro` | Limpio (sin diff) | — |
| `viajes.astro` | Limpio (sin diff) | — |
| `destino/[slug].astro` | **Modificado** | Refactor galería (ya no `getDestinationGallery`), bloque clima/presupuesto/coordenadas, SEO canonical/`destination.seo`, schema Event ampliado, enlaces a continente/tipos/temporadas/catálogo, tracking WhatsApp `data-destination-whatsapp`. **Nada de esto afecta al buscador directamente**, pero conviene no revertir al trabajar en destino. |

## Hallazgos críticos para siguientes tareas del roadmap

1. **Dos buscadores gemelos** (`SearchIsland` + barra interna de `SearchPage`) con listas y UI duplicadas; cualquier cambio parcial divergirá comportamiento/copy/IDs.
2. **URLs emiten `id`, no `slug`**, en `donde`/`cuando`; slugs solo en enlaces a `/destino/{slug}/`. El roadmap siguiente pide explícitamente slug en URL pública de destino.
3. **Payload inflado**: ambas páginas serializan destinos y viajes completos al cliente; no hay contrato «lite» para el buscador.
4. **`continentEmoji` acoplado a ids hardcoded** — posible regresión visual con datos Sanity.
5. **Tres vocabularios de «tipo»** (SearchPage categories, SeasonExplorer chips, páginas `/tipos/{slug}/`) con ids y agrupaciones distintas.
6. **Texto libre en «Dónde» no filtra** — posible expectativa rota del usuario si cree que escribir + Buscar filtra resultados.
7. **`SeasonExplorer` no alinea filtros temporales** con el buscador (usa tags compuestos como «puentes» y no comparte query params).

## Validación de la tarea

| Criterio | Cumple |
| --- | --- |
| Nota breve con flujo actual y duplicaciones | **Sí** — secciones «Resumen ejecutivo» y «Duplicaciones detectadas» |
| Rutas canónicas `/viajes/` y `/destino/{slug}/` identificadas | **Sí** |
| Datos mínimos del buscador vs carga pesada documentados | **Sí** — sección «Datos mínimos del buscador vs carga actual» |
| Archivo de evidencia en raíz | **Sí** — `INVENTORY_improveSearcher.md` |
| Sin modificar código de la feature | **Sí** |
| Sin marcar tareas [DONE] en roadmap | **Sí** |

## Referencias de código

- Hero → navegación: `SearchIsland.tsx` `handleSearch()` → `/viajes/?donde=&cuando=#resultados`
- Parseo URL: `SearchPage.tsx` `parseUrlParams()`
- Filtrado: `SearchPage.tsx` `filteredTrips` useMemo
- SSG destino: `destino/[slug].astro` `getStaticPaths()` con `getDestinations()`
- Tipos: `TripTag`, `DestinationCategory` en `src/lib/travel-data.ts`
- Provider: `getDestinations()`, `getTrips()`, `getContinents()` en `src/lib/data-provider.ts`
