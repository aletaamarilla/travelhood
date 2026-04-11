import type { Destination, Trip, Country } from './travel-data'

export interface RelatedDestination {
  slug: string
  name: string
  heroImage: string
  countryName: string
  countryFlag: string
  priceFrom?: number
}

function computeScore(a: Destination, b: Destination, priceA?: number, priceB?: number): number {
  let score = 0

  if (a.countryId && b.countryId && a.countryId === b.countryId) score += 40
  if (a.continentId && b.continentId && a.continentId === b.continentId) score += 20

  const catsA = new Set(a.categories)
  const shared = b.categories.filter((c) => catsA.has(c))
  if (shared.length > 0) score += 25

  if (priceA != null && priceB != null && priceA > 0 && priceB > 0) {
    const avg = (priceA + priceB) / 2
    if (Math.abs(priceA - priceB) / avg < 0.2) score += 10
  }

  if (a.climateByMonth?.length && b.climateByMonth?.length) {
    const idealA = new Set(a.climateByMonth.filter((m) => m.recommendation === 'Ideal').map((m) => m.month))
    const idealB = b.climateByMonth.filter((m) => m.recommendation === 'Ideal').map((m) => m.month)
    const overlap = idealB.some((m) => idealA.has(m))
    if (overlap) score += 5
  }

  return score
}

const MIN_SCORE = 20
const MIN_RESULTS = 2
const DEFAULT_MAX = 3

export function getRelatedDestinations(
  current: Destination,
  allDestinations: Destination[],
  allTrips: Trip[],
  countries: Country[],
  maxResults = DEFAULT_MAX,
): RelatedDestination[] {
  const priceByDest = new Map<string, number>()
  for (const t of allTrips) {
    if (t.status === 'full' || t.priceFrom <= 0) continue
    const prev = priceByDest.get(t.destinationId)
    if (prev == null || t.priceFrom < prev) {
      priceByDest.set(t.destinationId, t.priceFrom)
    }
  }

  const currentPrice = priceByDest.get(current.id)
  const countryMap = new Map(countries.map((c) => [c.id, c]))

  const scored = allDestinations
    .filter((d) => d.id !== current.id)
    .map((d) => ({
      destination: d,
      score: computeScore(current, d, currentPrice, priceByDest.get(d.id)),
    }))
    .filter((entry) => entry.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.destination.name.localeCompare(b.destination.name))

  if (scored.length < MIN_RESULTS) return []

  return scored.slice(0, maxResults).map(({ destination }) => {
    const country = countryMap.get(destination.countryId)
    return {
      slug: destination.slug,
      name: destination.name,
      heroImage: destination.heroImage,
      countryName: country?.name ?? '',
      countryFlag: country?.flag ?? '',
      priceFrom: priceByDest.get(destination.id),
    }
  })
}
