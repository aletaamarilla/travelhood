import type { DestinationCategory, TripTag } from "@/lib/travel-data"

/** Internal sentinel for open destination preference. Never use as UI copy. */
export const ANY_DESTINATION_ID = "any" as const

/** Internal sentinel for open date preference. Never use as UI copy. */
export const ANY_DATE_ID = "any" as const

export const SEARCH_RESULTS_PATH = "/viajes/" as const
export const SEARCH_RESULTS_HASH = "#resultados" as const

export type DestinationMode = "any" | "specific"
export type DateMode = "any" | "specific"

export type DestinationSelection =
  | { mode: "any" }
  | { mode: "specific"; kind: "destination"; destinationId: string }
  | { mode: "specific"; kind: "continent"; continentId: string }

export type DateSelection =
  | { mode: "any" }
  | { mode: "specific"; kind: "period"; periodId: TripTag }
  | { mode: "specific"; kind: "month"; monthIndex: number }

export interface SearchIntent {
  destination: DestinationSelection
  date: DateSelection
}

export type SearchNavigationTarget = "destination" | "results"

export interface ResolvedSearchNavigation {
  href: string
  target: SearchNavigationTarget
  reason: string
}

/** Minimal fields required to resolve destination URLs safely. */
export interface SearchDestinationRef {
  id: string
  slug: string
}

/** Slim payload for hero/search combobox (display + filtering only). */
export interface SearchCatalogDestination {
  id: string
  slug: string
  name: string
  shortDescription: string
  heroImage: string
  categories: DestinationCategory[]
  continentId: string
}

/** Slim continent row for search dropdown chips. */
export interface SearchCatalogContinent {
  id: string
  name: string
}

/** Minimal fields required to parse legacy `donde` query values. */
export interface SearchContinentRef {
  id: string
  slug: string
}

export const TRIP_PERIOD_IDS: readonly TripTag[] = [
  "semana-santa",
  "puente-mayo",
  "verano",
  "septiembre",
  "puente-octubre",
  "puente-noviembre",
  "navidad",
  "fin-de-anio",
] as const

function isTripPeriodId(value: string): value is TripTag {
  return (TRIP_PERIOD_IDS as readonly string[]).includes(value)
}

function isValidMonthIndex(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 11
}

export function createDefaultSearchIntent(): SearchIntent {
  return {
    destination: { mode: "any" },
    date: { mode: "any" },
  }
}

export function findDestinationByRef(
  ref: string,
  destinations: readonly SearchDestinationRef[],
): SearchDestinationRef | undefined {
  return destinations.find((destination) => destination.id === ref || destination.slug === ref)
}

export function findContinentByRef(
  ref: string,
  continents: readonly SearchContinentRef[],
): SearchContinentRef | undefined {
  return continents.find((continent) => continent.id === ref || continent.slug === ref)
}

/**
 * Reads legacy `/viajes/` query params (`donde`, `cuando`) into a typed intent.
 * Accepts destination/continent ids or slugs for `donde`, and period ids or month
 * indices for `cuando`.
 */
export function parseSearchIntentFromUrlSearch(
  search: string,
  destinations: readonly SearchDestinationRef[],
  continents: readonly SearchContinentRef[] = [],
): SearchIntent {
  const normalizedSearch = search.startsWith("?") ? search : search ? `?${search}` : ""
  const params = new URLSearchParams(normalizedSearch)

  let destination: DestinationSelection = { mode: "any" }
  const donde = params.get("donde")
  if (donde && donde !== ANY_DESTINATION_ID) {
    const continent = findContinentByRef(donde, continents)
    if (continent) {
      destination = { mode: "specific", kind: "continent", continentId: continent.id }
    } else {
      const matchedDestination = findDestinationByRef(donde, destinations)
      if (matchedDestination) {
        destination = {
          mode: "specific",
          kind: "destination",
          destinationId: matchedDestination.id,
        }
      }
    }
  }

  let date: DateSelection = { mode: "any" }
  const cuando = params.get("cuando")
  if (cuando && cuando !== ANY_DATE_ID) {
    if (isTripPeriodId(cuando)) {
      date = { mode: "specific", kind: "period", periodId: cuando }
    } else {
      const monthIndex = Number(cuando)
      if (isValidMonthIndex(monthIndex)) {
        date = { mode: "specific", kind: "month", monthIndex }
      }
    }
  }

  return { destination, date }
}

/** Builds the canonical `/viajes/` URL for catalog exploration and filtering. */
export function buildSearchResultsHref(intent: SearchIntent): string {
  const params = new URLSearchParams()

  if (intent.destination.mode === "specific") {
    if (intent.destination.kind === "destination") {
      params.set("donde", intent.destination.destinationId)
    } else {
      params.set("donde", intent.destination.continentId)
    }
  }

  if (intent.date.mode === "specific") {
    if (intent.date.kind === "period") {
      params.set("cuando", intent.date.periodId)
    } else {
      params.set("cuando", String(intent.date.monthIndex))
    }
  }

  const query = params.toString()
  return (query ? `${SEARCH_RESULTS_PATH}?${query}` : SEARCH_RESULTS_PATH) + SEARCH_RESULTS_HASH
}

/**
 * Resolves a search intent into a safe public URL.
 * Specific destinations only navigate to `/destino/{slug}/` when the slug exists in
 * `availableDestinations`; otherwise the resolver falls back to `/viajes/#resultados`.
 */
export function resolveSearchNavigation(
  intent: SearchIntent,
  availableDestinations: readonly SearchDestinationRef[],
): ResolvedSearchNavigation {
  const { destination, date } = intent

  if (destination.mode === "specific" && destination.kind === "destination") {
    const matchedDestination = availableDestinations.find(
      (item) => item.id === destination.destinationId,
    )

    if (matchedDestination?.slug) {
      return {
        href: `/destino/${matchedDestination.slug}/`,
        target: "destination",
        reason:
          date.mode === "specific"
            ? `Destino concreto publicado (${matchedDestination.slug}); la fecha se evalua en la landing del destino.`
            : `Destino concreto publicado (${matchedDestination.slug}).`,
      }
    }

    return {
      href: buildSearchResultsHref({ destination: { mode: "any" }, date }),
      target: "results",
      reason:
        "El destino seleccionado no esta en el catalogo publicado; se muestra el listado de viajes.",
    }
  }

  let reason: string
  if (destination.mode === "any" && date.mode === "any") {
    reason = "Exploracion abierta sin filtros de destino ni fecha."
  } else if (destination.mode === "any" && date.mode === "specific") {
    reason = "Listado filtrado por fecha sin destino concreto."
  } else if (destination.mode === "specific" && destination.kind === "continent") {
    reason =
      date.mode === "specific"
        ? "Listado filtrado por continente y fecha."
        : "Listado filtrado por continente."
  } else {
    reason = "Listado de viajes con los filtros seleccionados."
  }

  return {
    href: buildSearchResultsHref(intent),
    target: "results",
    reason,
  }
}
