import assert from "node:assert/strict"

import {
  filterTripsForSearch,
  getAvailableMonthsForSearch,
  hasMatchesForSearch,
  tripMatchesDateSelection,
  type SearchAvailabilityDestination,
  type SearchAvailabilityTrip,
} from "./search-availability.ts"

const todayStart = new Date(2026, 6, 11)

const destinations: SearchAvailabilityDestination[] = [
  { id: "egipto", continentId: "africa", categories: ["cultural"] },
  { id: "brasil", continentId: "south-america", categories: ["aventura", "naturaleza"] },
]

const trips: SearchAvailabilityTrip[] = [
  {
    destinationId: "egipto",
    departureDate: "2026-05-15",
    status: "open",
    tags: ["puente-mayo"],
  },
  {
    destinationId: "egipto",
    departureDate: "2026-11-06",
    status: "open",
    tags: ["puente-noviembre"],
  },
  {
    destinationId: "brasil",
    departureDate: "2026-11-28",
    returnDate: "2026-12-02",
    status: "open",
    tags: ["puente-noviembre"],
  },
]

// Past puente de mayo trips are not bookable results after July 2026.
{
  const matched = filterTripsForSearch(trips, destinations, todayStart, {
    date: { mode: "specific", kind: "period", periodId: "puente-mayo" },
  })

  assert.deepEqual(matched, [])
}

// A month with an explicit year only matches that year's departures.
{
  const october2027: SearchAvailabilityTrip = {
    destinationId: "brasil",
    departureDate: "2027-10-12",
    status: "open",
    tags: ["puente-octubre"],
  }
  assert.equal(
    tripMatchesDateSelection(october2027, { mode: "specific", kind: "month", monthIndex: 9, year: 2026 }),
    false,
  )
  assert.equal(
    tripMatchesDateSelection(october2027, { mode: "specific", kind: "month", monthIndex: 9, year: 2027 }),
    true,
  )
}

// A selected interval matches trips that overlap it, including cross-month trips.
{
  const crossMonthTrip = trips.find((trip) => trip.destinationId === "brasil")
  assert.ok(crossMonthTrip)
  assert.equal(
    tripMatchesDateSelection(crossMonthTrip, { mode: "specific", kind: "range", startDate: "2026-12-01", endDate: "2026-12-10" }),
    true,
  )
  assert.equal(
    tripMatchesDateSelection(crossMonthTrip, { mode: "specific", kind: "range", startDate: "2027-01-01", endDate: "2027-01-10" }),
    false,
  )
}

// Available month options are grouped by year and count overlapping departures.
{
  const months = getAvailableMonthsForSearch(trips, destinations, todayStart)
  assert.deepEqual(months, [
    { year: 2026, monthIndex: 10, count: 2 },
    { year: 2026, monthIndex: 11, count: 1 },
  ])
}

// Month search matches any month covered by the trip date range, not just departure.
{
  const crossMonthTrip = trips.find((trip) => trip.destinationId === "brasil")
  assert.ok(crossMonthTrip)

  assert.equal(
    tripMatchesDateSelection(crossMonthTrip, { mode: "specific", kind: "month", monthIndex: 10 }),
    true,
  )
  assert.equal(
    tripMatchesDateSelection(crossMonthTrip, { mode: "specific", kind: "month", monthIndex: 11 }),
    true,
  )
  assert.equal(
    tripMatchesDateSelection(crossMonthTrip, { mode: "specific", kind: "month", monthIndex: 9 }),
    false,
  )
  assert.equal(
    hasMatchesForSearch(trips, destinations, todayStart, {
      destination: { mode: "specific", kind: "destination", destinationId: "brasil" },
      date: { mode: "specific", kind: "month", monthIndex: 11 },
    }),
    true,
  )
}

// Cross-year trips should be searchable in both December and January.
{
  const crossYearTrip: SearchAvailabilityTrip = {
    destinationId: "egipto",
    departureDate: "2026-12-28",
    returnDate: "2027-01-03",
    status: "open",
    tags: ["fin-de-anio"],
  }

  assert.equal(
    tripMatchesDateSelection(crossYearTrip, { mode: "specific", kind: "month", monthIndex: 11 }),
    true,
  )
  assert.equal(
    tripMatchesDateSelection(crossYearTrip, { mode: "specific", kind: "month", monthIndex: 0 }),
    true,
  )
}

// Trips without returnDate keep the original departure-month behavior.
{
  const oneWayAvailabilityTrip: SearchAvailabilityTrip = {
    destinationId: "egipto",
    departureDate: "2026-11-06",
    status: "open",
    tags: ["puente-noviembre"],
  }

  assert.equal(
    tripMatchesDateSelection(oneWayAvailabilityTrip, { mode: "specific", kind: "month", monthIndex: 10 }),
    true,
  )
  assert.equal(
    tripMatchesDateSelection(oneWayAvailabilityTrip, { mode: "specific", kind: "month", monthIndex: 11 }),
    false,
  )
}

// Destination options are cross-filtered by the selected date.
{
  assert.equal(
    hasMatchesForSearch(trips, destinations, todayStart, {
      destination: { mode: "specific", kind: "destination", destinationId: "egipto" },
      date: { mode: "specific", kind: "period", periodId: "puente-mayo" },
    }),
    false,
  )

  assert.equal(
    hasMatchesForSearch(trips, destinations, todayStart, {
      destination: { mode: "specific", kind: "destination", destinationId: "egipto" },
      date: { mode: "specific", kind: "period", periodId: "puente-noviembre" },
    }),
    true,
  )
}

// A stale period tag outside its calendar window should not masquerade as that date filter.
{
  const staleTaggedTrip: SearchAvailabilityTrip = {
    destinationId: "egipto",
    departureDate: "2026-07-15",
    status: "open",
    tags: ["puente-mayo"],
  }

  assert.equal(
    tripMatchesDateSelection(staleTaggedTrip, {
      mode: "specific",
      kind: "period",
      periodId: "puente-mayo",
    }),
    false,
  )
}
