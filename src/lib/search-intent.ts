import type { DestinationCategory, TripTag } from "@/lib/travel-data"

/** Internal sentinel for open destination preference. Never use as UI copy. */
export const ANY_DESTINATION_ID = "any" as const

/** Internal sentinel for open date preference. Never use as UI copy. */
export const ANY_DATE_ID = "any" as const

export const SEARCH_RESULTS_PATH = "/viajes/" as const
export const SEARCH_RESULTS_HASH = "#resultados" as const

export type DestinationMode = "any" | "specific"
export type DateMode = "any" | "specific"

export type DatePresetId = "proximas" | "puentes" | "navidad-fin-de-anio"

export type DestinationSelection =
  | { mode: "any" }
  | { mode: "specific"; kind: "destination"; destinationId: string }
  | { mode: "specific"; kind: "continent"; continentId: string }

export type DateSelection =
  | { mode: "any" }
  | { mode: "specific"; kind: "period"; periodId: TripTag }
  | { mode: "specific"; kind: "preset"; presetId: DatePresetId }
  | { mode: "specific"; kind: "month"; monthIndex: number; year?: number }
  | { mode: "specific"; kind: "range"; startDate: string; endDate: string }

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

const DATE_PRESET_IDS: readonly DatePresetId[] = ["proximas", "puentes", "navidad-fin-de-anio"]

function isDatePresetId(value: string): value is DatePresetId {
  return (DATE_PRESET_IDS as readonly string[]).includes(value)
}

function isValidYear(value: number): boolean {
  return Number.isInteger(value) && value >= 2000 && value <= 2100
}

function isValidDateOnly(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
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
  const desde = params.get("desde")
  const hasta = params.get("hasta")
  const cuando = params.get("cuando")
  if (isValidDateOnly(desde) && isValidDateOnly(hasta) && desde <= hasta) {
    date = { mode: "specific", kind: "range", startDate: desde, endDate: hasta }
  } else if (cuando && cuando !== ANY_DATE_ID) {
    if (isTripPeriodId(cuando)) {
      date = { mode: "specific", kind: "period", periodId: cuando }
    } else if (isDatePresetId(cuando)) {
      date = { mode: "specific", kind: "preset", presetId: cuando }
    } else {
      const monthYear = cuando.match(/^(\d{4})-(\d{2})$/)
      if (monthYear) {
        const year = Number(monthYear[1])
        const monthIndex = Number(monthYear[2]) - 1
        if (isValidYear(year) && isValidMonthIndex(monthIndex)) {
          date = { mode: "specific", kind: "month", monthIndex, year }
        }
      } else {
        const monthIndex = Number(cuando)
        if (isValidMonthIndex(monthIndex)) {
          date = { mode: "specific", kind: "month", monthIndex }
        }
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
    } else if (intent.date.kind === "preset") {
      params.set("cuando", intent.date.presetId)
    } else if (intent.date.kind === "month") {
      params.set(
        "cuando",
        intent.date.year
          ? intent.date.year + "-" + String(intent.date.monthIndex + 1).padStart(2, "0")
          : String(intent.date.monthIndex),
      )
    } else {
      params.set("desde", intent.date.startDate)
      params.set("hasta", intent.date.endDate)
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
