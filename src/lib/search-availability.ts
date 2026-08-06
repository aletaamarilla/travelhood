import type { DestinationCategory, Trip, TripTag } from "@/lib/travel-data"
import type { DatePresetId, DateSelection, DestinationSelection } from "@/lib/search-intent"

export type SearchAvailabilityTrip = Pick<Trip, "destinationId" | "departureDate" | "status" | "tags"> &
  Partial<Pick<Trip, "returnDate">>

export type SearchAvailabilityDestination = {
  id: string
  continentId: string
  categories: readonly DestinationCategory[]
}

type SearchAvailabilityFilters = {
  destination?: DestinationSelection
  date?: DateSelection
  category?: DestinationCategory | "all"
}

export function parseTripDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null

  const dateOnly = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const parsed = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(dateStr)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function getTodayStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function isBookableTrip(trip: Pick<Trip, "departureDate" | "status">, todayStart: Date): boolean {
  const departureDate = parseTripDate(trip.departureDate)
  return trip.status !== "full" && !!departureDate && departureDate >= todayStart
}

export function tripDepartsInMonth(
  trip: Pick<Trip, "departureDate"> & Partial<Pick<Trip, "returnDate">>,
  monthIndex: number,
  year?: number,
): boolean {
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) return false

  const departureDate = parseTripDate(trip.departureDate)
  if (!departureDate) return false

  const parsedReturnDate = parseTripDate(trip.returnDate)
  const returnDate = parsedReturnDate && parsedReturnDate >= departureDate ? parsedReturnDate : departureDate
  const cursor = new Date(departureDate.getFullYear(), departureDate.getMonth(), 1)
  const endMonth = new Date(returnDate.getFullYear(), returnDate.getMonth(), 1)

  while (cursor <= endMonth) {
    if (cursor.getMonth() === monthIndex && (year === undefined || cursor.getFullYear() === year)) return true
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return false
}

const PERIOD_MONTHS: Record<TripTag, readonly number[]> = {
  "semana-santa": [2, 3],
  "puente-mayo": [3, 4],
  verano: [5, 6, 7],
  septiembre: [8],
  "puente-octubre": [9],
  "puente-noviembre": [9, 10],
  navidad: [11],
  "fin-de-anio": [11, 0],
}

function tripDateFitsPeriod(trip: Pick<Trip, "departureDate">, periodId: TripTag): boolean {
  const departureDate = parseTripDate(trip.departureDate)
  return !!departureDate && PERIOD_MONTHS[periodId].includes(departureDate.getMonth())
}

const PRESET_PERIODS: Record<Exclude<DatePresetId, "proximas">, readonly TripTag[]> = {
  puentes: ["puente-mayo", "puente-octubre", "puente-noviembre"],
  "navidad-fin-de-anio": ["navidad", "fin-de-anio"],
}

function tripMatchesPreset(
  trip: Pick<Trip, "departureDate" | "tags">,
  presetId: DatePresetId,
): boolean {
  if (presetId === "proximas") return true
  return PRESET_PERIODS[presetId].some(
    (periodId) => trip.tags.includes(periodId) && tripDateFitsPeriod(trip, periodId),
  )
}

function tripOverlapsRange(
  trip: Pick<Trip, "departureDate"> & Partial<Pick<Trip, "returnDate">>,
  startDate: string,
  endDate: string,
): boolean {
  const departureDate = parseTripDate(trip.departureDate)
  const selectedStart = parseTripDate(startDate)
  const selectedEnd = parseTripDate(endDate)
  if (!departureDate || !selectedStart || !selectedEnd || selectedEnd < selectedStart) return false

  const parsedReturnDate = parseTripDate(trip.returnDate)
  const returnDate = parsedReturnDate && parsedReturnDate >= departureDate ? parsedReturnDate : departureDate
  return departureDate <= selectedEnd && returnDate >= selectedStart
}

export function tripMatchesDateSelection(
  trip: Pick<Trip, "departureDate" | "tags"> & Partial<Pick<Trip, "returnDate">>,
  date: DateSelection = { mode: "any" },
): boolean {
  if (date.mode === "any") return true

  if (date.kind === "period") {
    return trip.tags.includes(date.periodId) && tripDateFitsPeriod(trip, date.periodId)
  }

  if (date.kind === "preset") {
    return tripMatchesPreset(trip, date.presetId)
  }

  if (date.kind === "range") {
    return tripOverlapsRange(trip, date.startDate, date.endDate)
  }

  return tripDepartsInMonth(trip, date.monthIndex, date.year)
}

function tripMatchesDestinationSelection(
  trip: Pick<Trip, "destinationId">,
  destination: DestinationSelection = { mode: "any" },
  destinations: readonly SearchAvailabilityDestination[],
): boolean {
  if (destination.mode === "any") return true

  if (destination.kind === "destination") {
    return trip.destinationId === destination.destinationId
  }

  const matchedDestination = destinations.find((item) => item.id === trip.destinationId)
  return matchedDestination?.continentId === destination.continentId
}

function tripMatchesCategory(
  trip: Pick<Trip, "destinationId">,
  category: DestinationCategory | "all" | undefined,
  destinations: readonly SearchAvailabilityDestination[],
): boolean {
  if (!category || category === "all") return true

  const matchedDestination = destinations.find((item) => item.id === trip.destinationId)
  return !!matchedDestination?.categories.includes(category)
}

export function filterTripsForSearch<TTrip extends SearchAvailabilityTrip>(
  trips: readonly TTrip[],
  destinations: readonly SearchAvailabilityDestination[],
  todayStart: Date,
  filters: SearchAvailabilityFilters = {},
): TTrip[] {
  return trips.filter(
    (trip) =>
      isBookableTrip(trip, todayStart) &&
      tripMatchesDestinationSelection(trip, filters.destination, destinations) &&
      tripMatchesDateSelection(trip, filters.date) &&
      tripMatchesCategory(trip, filters.category, destinations),
  )
}

export function hasMatchesForSearch(
  trips: readonly SearchAvailabilityTrip[],
  destinations: readonly SearchAvailabilityDestination[],
  todayStart: Date,
  filters: SearchAvailabilityFilters = {},
): boolean {
  return filterTripsForSearch(trips, destinations, todayStart, filters).length > 0
}

export interface AvailableSearchMonth {
  year: number
  monthIndex: number
  count: number
}

export function getAvailableMonthsForSearch(
  trips: readonly SearchAvailabilityTrip[],
  destinations: readonly SearchAvailabilityDestination[],
  todayStart: Date,
  filters: Omit<SearchAvailabilityFilters, "date"> = {},
): AvailableSearchMonth[] {
  const bookableTrips = filterTripsForSearch(trips, destinations, todayStart, {
    ...filters,
    date: { mode: "any" },
  })
  const counts = new Map<string, AvailableSearchMonth>()

  for (const trip of bookableTrips) {
    const departureDate = parseTripDate(trip.departureDate)
    if (!departureDate) continue
    const parsedReturnDate = parseTripDate(trip.returnDate)
    const returnDate = parsedReturnDate && parsedReturnDate >= departureDate ? parsedReturnDate : departureDate
    const cursor = new Date(departureDate.getFullYear(), departureDate.getMonth(), 1)
    const lastMonth = new Date(returnDate.getFullYear(), returnDate.getMonth(), 1)

    while (cursor <= lastMonth) {
      const year = cursor.getFullYear()
      const monthIndex = cursor.getMonth()
      const key = year + "-" + monthIndex
      const current = counts.get(key)
      counts.set(key, { year, monthIndex, count: (current?.count ?? 0) + 1 })
      cursor.setMonth(cursor.getMonth() + 1)
    }
  }

  return [...counts.values()].sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
}
