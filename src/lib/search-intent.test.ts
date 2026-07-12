import assert from "node:assert/strict"

import {
  ANY_DATE_ID,
  ANY_DESTINATION_ID,
  buildSearchResultsHref,
  createDefaultSearchIntent,
  parseSearchIntentFromUrlSearch,
  resolveSearchNavigation,
  type SearchDestinationRef,
  type SearchIntent,
} from "./search-intent.ts"

const destinations: SearchDestinationRef[] = [
  { id: "destination-brasil", slug: "brasil" },
  { id: "destination-japon", slug: "japon" },
]

const continents = [{ id: "south-america", slug: "south-america" }]

function intent(partial: Partial<SearchIntent> & Pick<SearchIntent, "destination" | "date">): SearchIntent {
  return partial
}

// Case 1: any destination + any date
{
  const navigation = resolveSearchNavigation(createDefaultSearchIntent(), destinations)
  assert.equal(navigation.href, "/viajes/#resultados")
  assert.equal(navigation.target, "results")
}

// Case 2: specific destination + any date
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "specific", kind: "destination", destinationId: "destination-brasil" },
      date: { mode: "any" },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/destino/brasil/")
  assert.equal(navigation.target, "destination")
  assert.match(navigation.href, /brasil/)
  assert.doesNotMatch(navigation.href, /destination-brasil/)
}

// Case 3: specific destination + specific date (period)
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "specific", kind: "destination", destinationId: "destination-japon" },
      date: { mode: "specific", kind: "period", periodId: "verano" },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/destino/japon/")
  assert.equal(navigation.target, "destination")
}

// Case 4: any destination + specific date (month)
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "any" },
      date: { mode: "specific", kind: "month", monthIndex: 7 },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/viajes/?cuando=7#resultados")
  assert.equal(navigation.target, "results")
}

// Invariant: unknown destination id never resolves to /destino/
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "specific", kind: "destination", destinationId: "ghost-destination" },
      date: { mode: "specific", kind: "period", periodId: "navidad" },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/viajes/?cuando=navidad#resultados")
  assert.equal(navigation.target, "results")
  assert.doesNotMatch(navigation.href, /^\/destino\//)
}

// Continent selections stay on results with legacy `donde`
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "specific", kind: "continent", continentId: "south-america" },
      date: { mode: "any" },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/viajes/?donde=south-america#resultados")
  assert.equal(navigation.target, "results")
}

// Reading compatibility: slug and id in `donde`, month and period in `cuando`
{
  const fromSlug = parseSearchIntentFromUrlSearch("?donde=brasil&cuando=verano", destinations, continents)
  assert.deepEqual(fromSlug.destination, {
    mode: "specific",
    kind: "destination",
    destinationId: "destination-brasil",
  })
  assert.deepEqual(fromSlug.date, { mode: "specific", kind: "period", periodId: "verano" })

  const fromContinentSlug = parseSearchIntentFromUrlSearch("?donde=south-america", destinations, continents)
  assert.deepEqual(fromContinentSlug.destination, {
    mode: "specific",
    kind: "continent",
    continentId: "south-america",
  })
}

// Internal sentinels are not emitted in results URLs
{
  const href = buildSearchResultsHref(createDefaultSearchIntent())
  assert.equal(href, "/viajes/#resultados")
  assert.ok(!href.includes(ANY_DESTINATION_ID))
  assert.ok(!href.includes(ANY_DATE_ID))
}


// Case: specific destination + specific month still lands on destination page
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "specific", kind: "destination", destinationId: "destination-brasil" },
      date: { mode: "specific", kind: "month", monthIndex: 3 },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/destino/brasil/")
  assert.equal(navigation.target, "destination")
}

// Case: any destination + period (temporada)
{
  const navigation = resolveSearchNavigation(
    intent({
      destination: { mode: "any" },
      date: { mode: "specific", kind: "period", periodId: "verano" },
    }),
    destinations,
  )
  assert.equal(navigation.href, "/viajes/?cuando=verano#resultados")
  assert.equal(navigation.target, "results")
}

// Legacy parse: unknown slug in `donde` keeps open destination
{
  const parsed = parseSearchIntentFromUrlSearch("?donde=slug-inexistente&cuando=5", destinations, continents)
  assert.deepEqual(parsed.destination, { mode: "any" })
  assert.deepEqual(parsed.date, { mode: "specific", kind: "month", monthIndex: 5 })
}

// Legacy parse: destination id (not slug) in `donde`
{
  const parsed = parseSearchIntentFromUrlSearch("?donde=destination-japon", destinations, continents)
  assert.deepEqual(parsed.destination, {
    mode: "specific",
    kind: "destination",
    destinationId: "destination-japon",
  })
}

// Legacy parse: month index in `cuando`
{
  const parsed = parseSearchIntentFromUrlSearch("?cuando=11", destinations, continents)
  assert.deepEqual(parsed.date, { mode: "specific", kind: "month", monthIndex: 11 })
}

// Legacy parse: sentinel values mean open filters
{
  const parsed = parseSearchIntentFromUrlSearch("?donde=any&cuando=any", destinations, continents)
  assert.deepEqual(parsed, createDefaultSearchIntent())
}

// buildSearchResultsHref: continent + period legacy params
{
  const href = buildSearchResultsHref(
    intent({
      destination: { mode: "specific", kind: "continent", continentId: "south-america" },
      date: { mode: "specific", kind: "period", periodId: "navidad" },
    }),
  )
  assert.equal(href, "/viajes/?donde=south-america&cuando=navidad#resultados")
}
console.log("search-intent.test.ts: all assertions passed")
