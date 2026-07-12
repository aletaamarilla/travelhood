import assert from "node:assert/strict"

import {
  buildSearchableDestinationContext,
  filterContinentsWithSearchableDestinations,
  filterSearchableDestinations,
  getSearchableDestinationRejectReason,
  toSearchDestinationRefs,
} from "./data-provider.ts"
import {
  continents as hardContinents,
  countries as hardCountries,
  destinations as hardDestinations,
} from "./travel-data.ts"
import { resolveSearchNavigation } from "./search-intent.ts"

const context = buildSearchableDestinationContext(hardCountries, hardContinents)
const searchable = filterSearchableDestinations(hardDestinations, context)
const searchableSlugs = new Set(searchable.map((destination) => destination.slug))

// Hardcoded imports without hero stay out of the catalog
for (const slug of [
  "lofoten",
  "azores",
  "camino-de-santiago",
  "indonesia",
  "tailandia-verano",
  "tailandia-invierno",
  "filipinas-verano",
  "filipinas-invierno",
  "puerto-rico",
  "sri-lanka-verano",
  "sri-lanka-otono",
  "sri-lanka-invierno",
]) {
  assert.equal(searchableSlugs.has(slug), false, `expected ${slug} to be excluded`)
}

// Established destinations with full content stay searchable
for (const slug of ["brasil", "japon", "islandia", "colombia"]) {
  assert.equal(searchableSlugs.has(slug), true, `expected ${slug} to be searchable`)
}

assert.equal(
  getSearchableDestinationRejectReason(hardDestinations.find((d) => d.slug === "camino-de-santiago")!, context),
  "placeholder-short-description",
)
assert.equal(
  getSearchableDestinationRejectReason(hardDestinations.find((d) => d.slug === "lofoten")!, context),
  "missing-hero-image",
)

const searchableContinents = filterContinentsWithSearchableDestinations(hardContinents, searchable)
for (const continent of searchableContinents) {
  assert.ok(
    searchable.some((destination) => destination.continentId === continent.id),
    `continent ${continent.slug} must have at least one searchable destination`,
  )
}

const refs = toSearchDestinationRefs(searchable)
for (const ref of refs) {
  assert.ok(ref.slug.trim())
  assert.ok(ref.id.trim())
}

// Every searchable slug resolves to a destination landing via search-intent
for (const destination of searchable) {
  const navigation = resolveSearchNavigation(
    {
      destination: { mode: "specific", kind: "destination", destinationId: destination.id },
      date: { mode: "any" },
    },
    refs,
  )
  assert.equal(navigation.href, `/destino/${destination.slug}/`)
  assert.equal(navigation.target, "destination")
}

console.log(`searchable-destinations: ${searchable.length}/${hardDestinations.length} destinations pass publishability`)
