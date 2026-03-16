/**
 * Unified data provider: fetches from Sanity when configured, falls back to hardcoded data.
 * This allows gradual migration without breaking the build.
 */
import { sanityFetch, urlFor } from './sanity'
import {
  allContinentsQuery,
  continentBySlugQuery,
  allCountriesQuery,
  countryBySlugQuery,
  allDestinationsQuery,
  destinationBySlugQuery,
  destinationsByContinentQuery,
  allTripsQuery,
  tripsByDestinationQuery,
  tripsByTagQuery,
  allCoordinatorsQuery,
  allTestimonialsQuery,
  featuredTestimonialsQuery,
  testimonialsByDestinationQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  allSeasonsQuery,
  seasonBySlugQuery,
  allBlogPostsQuery,
  blogPostBySlugQuery,
  allComparisonsQuery,
  comparisonBySlugQuery,
  allLandingPagesQuery,
  landingBySlugQuery,
  siteSettingsQuery,
} from './queries'
import type {
  SanityContinent,
  SanityCountry,
  SanityDestination,
  SanityTrip,
  SanityCoordinator,
  SanityTestimonial,
  SanityTripCategory,
  SanitySeason,
  SanityBlogPost,
  SanityComparison,
  SanityLandingPage,
  SanitySiteSettings,
} from '@/types/sanity'
import type { SanityImageSource } from '@sanity/image-url'
import {
  continents as hardContinents,
  countries as hardCountries,
  destinations as hardDestinations,
  trips as hardTrips,
  coordinators as hardCoordinators,
  testimonials as hardTestimonials,
  tripCategories as hardTripCategories,
  seasons as hardSeasons,
  defaultIncluded as hardDefaultIncluded,
  defaultNotIncluded as hardDefaultNotIncluded,
  getDestinationsByContinent as hardGetDestsByContinent,
  type Continent,
  type Country,
  type Destination,
  type Trip,
  type Coordinator,
  type Testimonial,
  type TripCategoryData,
  type SeasonData,
} from './travel-data'
import { blogPosts as hardBlogPosts, type BlogPost } from './blog-data'
import { comparisons as hardComparisons, type Comparison } from './comparisons'
import { lookupCoords } from './destination-details'

const isSanityConfigured = (): boolean => {
  try {
    const pid = import.meta.env.SANITY_PROJECT_ID
    return Boolean(pid && pid !== 'YOUR_PROJECT_ID')
  } catch {
    return false
  }
}

// ── Settings Cache ──

let cachedSettings: SanitySiteSettings | null = null

async function ensureSettings(): Promise<{ defaultIncluded: string[]; defaultNotIncluded: string[] }> {
  if (!isSanityConfigured()) {
    return { defaultIncluded: hardDefaultIncluded, defaultNotIncluded: hardDefaultNotIncluded }
  }
  if (!cachedSettings) {
    cachedSettings = await sanityFetch<SanitySiteSettings | null>(siteSettingsQuery)
  }
  return {
    defaultIncluded: cachedSettings?.defaultIncluded ?? hardDefaultIncluded,
    defaultNotIncluded: cachedSettings?.defaultNotIncluded ?? hardDefaultNotIncluded,
  }
}

function resolveImage(img?: SanityImageSource | null): string {
  if (!img) return ''
  if (typeof img === 'string') return img
  try {
    return urlFor(img).width(1920).auto('format').url()
  } catch {
    return ''
  }
}

function resolveImageThumb(img?: SanityImageSource | null, w = 800): string {
  if (!img) return ''
  if (typeof img === 'string') return img
  try {
    return urlFor(img).width(w).auto('format').url()
  } catch {
    return ''
  }
}

// ── Continents ──

function mapContinent(s: SanityContinent): Continent {
  return {
    id: s._id,
    name: s.name,
    slug: s.slug?.current ?? '',
    editorialIntro: s.editorialIntro,
    heroImage: resolveImage(s.heroImage),
    bestMonths: s.bestMonths ?? '',
    faqs: s.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    seoTitle: s.seo?.title ?? `Viajes en grupo a ${s.name} | Travelhood`,
    seoDescription: s.seo?.description ?? '',
  }
}

export async function getContinents(): Promise<Continent[]> {
  if (!isSanityConfigured()) return hardContinents
  const data = await sanityFetch<SanityContinent[]>(allContinentsQuery)
  return data.map(mapContinent)
}

export async function getContinentBySlug(slug: string): Promise<Continent | undefined> {
  if (!isSanityConfigured()) return hardContinents.find((c) => c.slug === slug)
  const data = await sanityFetch<SanityContinent | null>(continentBySlugQuery, { slug })
  return data ? mapContinent(data) : undefined
}

// ── Countries ──

function mapCountry(s: SanityCountry): Country {
  return {
    id: s._id,
    name: s.name,
    slug: s.slug?.current ?? '',
    continentId: s.continent?._id ?? '',
    flag: s.flag,
  }
}

export async function getCountries(): Promise<Country[]> {
  if (!isSanityConfigured()) return hardCountries
  const data = await sanityFetch<SanityCountry[]>(allCountriesQuery)
  return data.map(mapCountry)
}

export async function getCountryBySlug(slug: string): Promise<Country | undefined> {
  if (!isSanityConfigured()) return hardCountries.find((c) => c.slug === slug)
  const data = await sanityFetch<SanityCountry | null>(countryBySlugQuery, { slug })
  return data ? mapCountry(data) : undefined
}

// ── Destinations ──

function mapDestination(s: SanityDestination): Destination {
  return {
    id: s._id,
    name: s.name,
    slug: s.slug?.current ?? '',
    countryId: s.country?._id ?? '',
    continentId: s.continent?._id ?? '',
    description: s.description,
    shortDescription: s.shortDescription,
    heroImage: resolveImage(s.heroImage),
    highlights: s.highlights ?? [],
    idealFor: s.idealFor ?? '',
    climate: s.climate,
    categories: (s.categories ?? []) as Destination['categories'],
    extraIncluded: s.extraIncluded ?? [],
    extraNotIncluded: s.extraNotIncluded ?? [],
    itinerary: (s.itinerary ?? []).map((d) => ({
      day: d.day,
      title: d.title,
      description: d.description ?? '',
    })),
  }
}

export async function getDestinations(): Promise<Destination[]> {
  if (!isSanityConfigured()) return hardDestinations
  const data = await sanityFetch<SanityDestination[]>(allDestinationsQuery)
  return data.map(mapDestination)
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  if (!isSanityConfigured()) return hardDestinations.find((d) => d.slug === slug)
  const data = await sanityFetch<SanityDestination | null>(destinationBySlugQuery, { slug })
  return data ? mapDestination(data) : undefined
}

export async function getDestinationsByContinent(continentSlugOrId: string): Promise<Destination[]> {
  if (!isSanityConfigured()) {
    const continent = hardContinents.find((c) => c.slug === continentSlugOrId || c.id === continentSlugOrId)
    return continent ? hardGetDestsByContinent(continent.id) : []
  }
  const data = await sanityFetch<SanityDestination[]>(destinationsByContinentQuery, { slug: continentSlugOrId })
  return data.map(mapDestination)
}

export async function getDestinationRaw(slug: string): Promise<SanityDestination | null> {
  if (!isSanityConfigured()) return null
  return sanityFetch<SanityDestination | null>(destinationBySlugQuery, { slug })
}

export async function getDestinationGallery(slug: string): Promise<string[]> {
  const raw = await getDestinationRaw(slug)
  if (!raw?.gallery?.length) return []
  return raw.gallery.map((img) => resolveImageThumb(img, 800))
}

export async function getDestinationSanityFaqs(slug: string): Promise<{ question: string; answer: string }[]> {
  const raw = await getDestinationRaw(slug)
  if (!raw?.faqs?.length) return []
  return raw.faqs.map((f) => ({ question: f.question, answer: f.answer }))
}

// ── Trips ──

interface MergeContext {
  defaultIncluded: string[]
  defaultNotIncluded: string[]
  destinationData?: {
    extraIncluded?: string[]
    extraNotIncluded?: string[]
    itinerary?: { day: number; title: string; description?: string }[]
  }
}

function mapItineraryDay(d: { day: number; title: string; description?: string }) {
  return { day: d.day, title: d.title, description: d.description ?? '' }
}

function mapTrip(s: SanityTrip, ctx?: MergeContext): Trip {
  const destData = ctx?.destinationData ?? {
    extraIncluded: s.destination?.extraIncluded,
    extraNotIncluded: s.destination?.extraNotIncluded,
    itinerary: s.destination?.itinerary,
  }

  const included = ctx
    ? [...new Set([
        ...ctx.defaultIncluded,
        ...(destData?.extraIncluded ?? []),
        ...(s.extraIncluded ?? []),
      ])]
    : s.extraIncluded ?? []

  const notIncluded = ctx
    ? [...new Set([
        ...ctx.defaultNotIncluded,
        ...(destData?.extraNotIncluded ?? []),
        ...(s.extraNotIncluded ?? []),
      ])]
    : s.extraNotIncluded ?? []

  const destItinerary = Array.isArray(destData?.itinerary) ? destData.itinerary : []
  const overrideItinerary = s.itineraryOverride ?? []
  const resolvedItinerary = overrideItinerary.length > 0
    ? overrideItinerary.map(mapItineraryDay)
    : destItinerary.map(mapItineraryDay)

  return {
    id: s._id,
    destinationId: s.destination?._id ?? '',
    title: s.title,
    departureDate: s.departureDate,
    returnDate: s.returnDate,
    durationDays: s.durationDays,
    priceFrom: s.priceFrom,
    promoPrice: s.promoPrice,
    promoLabel: s.promoLabel,
    flightEstimate: s.flightEstimate,
    totalPlaces: s.totalPlaces,
    placesLeft: s.placesLeft,
    coordinatorId: s.coordinator?._id ?? '',
    status: s.status,
    included,
    notIncluded,
    extraIncluded: s.extraIncluded ?? [],
    extraNotIncluded: s.extraNotIncluded ?? [],
    itinerary: resolvedItinerary,
    itineraryOverride: overrideItinerary.map(mapItineraryDay),
    tags: (s.tags ?? []) as Trip['tags'],
  }
}

export async function getTrips(): Promise<Trip[]> {
  if (!isSanityConfigured()) return hardTrips
  const [data, settings] = await Promise.all([
    sanityFetch<SanityTrip[]>(allTripsQuery),
    ensureSettings(),
  ])
  return data.map((s) => mapTrip(s, settings))
}

export async function getTripsByDestination(slug: string): Promise<Trip[]> {
  if (!isSanityConfigured()) {
    const dest = hardDestinations.find((d) => d.slug === slug)
    return dest ? hardTrips.filter((t) => t.destinationId === dest.id) : []
  }
  const [data, settings] = await Promise.all([
    sanityFetch<SanityTrip[]>(tripsByDestinationQuery, { slug }),
    ensureSettings(),
  ])
  return data.map((s) => {
    const destData = s.destination as unknown as MergeContext['destinationData']
    return mapTrip(s, { ...settings, destinationData: destData ?? undefined })
  })
}

export async function getTripsByTag(tag: string): Promise<Trip[]> {
  if (!isSanityConfigured()) return hardTrips.filter((t) => t.tags.includes(tag as Trip['tags'][number]))
  const [data, settings] = await Promise.all([
    sanityFetch<SanityTrip[]>(tripsByTagQuery, { tag }),
    ensureSettings(),
  ])
  return data.map((s) => mapTrip(s, settings))
}

// ── Coordinators ──

function mapCoordinator(s: SanityCoordinator): Coordinator {
  return {
    id: s._id,
    name: s.name,
    age: s.age ?? 0,
    role: s.role ?? '',
    bio: s.bio,
    destinations: s.destinations?.map((d) => d._id) ?? [],
    quote: s.quote ?? '',
    image: resolveImageThumb(s.image, 400),
  }
}

export async function getCoordinators(): Promise<Coordinator[]> {
  if (!isSanityConfigured()) return hardCoordinators
  const data = await sanityFetch<SanityCoordinator[]>(allCoordinatorsQuery)
  return data.map(mapCoordinator)
}

// ── Testimonials ──

function mapTestimonial(s: SanityTestimonial): Testimonial {
  return {
    id: s._id,
    name: s.name,
    age: s.age,
    city: s.city,
    destinationId: s.destination?._id ?? '',
    quote: s.quote,
    rating: s.rating,
    image: resolveImageThumb(s.image, 200),
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) return hardTestimonials
  const data = await sanityFetch<SanityTestimonial[]>(allTestimonialsQuery)
  return data.map(mapTestimonial)
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) return hardTestimonials
  const data = await sanityFetch<SanityTestimonial[]>(featuredTestimonialsQuery)
  return data.map(mapTestimonial)
}

export async function getTestimonialsByDestination(slug: string): Promise<Testimonial[]> {
  if (!isSanityConfigured()) {
    const dest = hardDestinations.find((d) => d.slug === slug)
    return dest ? hardTestimonials.filter((t) => t.destinationId === dest.id) : []
  }
  const data = await sanityFetch<SanityTestimonial[]>(testimonialsByDestinationQuery, { slug })
  return data.map(mapTestimonial)
}

// ── Trip Categories ──

function mapTripCategory(s: SanityTripCategory): TripCategoryData {
  return {
    name: s.name,
    slug: s.slug?.current as TripCategoryData['slug'],
    editorial: s.editorial,
    heroImage: resolveImage(s.heroImage),
    idealProfile: s.idealProfile ?? '',
    faqs: s.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    seoTitle: s.seo?.title ?? `${s.name} — Viajes en grupo | Travelhood`,
    seoDescription: s.seo?.description ?? '',
  }
}

export async function getTripCategories(): Promise<TripCategoryData[]> {
  if (!isSanityConfigured()) return hardTripCategories
  const data = await sanityFetch<SanityTripCategory[]>(allCategoriesQuery)
  return data.map(mapTripCategory)
}

export async function getTripCategoryBySlug(slug: string): Promise<TripCategoryData | undefined> {
  if (!isSanityConfigured()) return hardTripCategories.find((c) => c.slug === slug)
  const data = await sanityFetch<SanityTripCategory | null>(categoryBySlugQuery, { slug })
  return data ? mapTripCategory(data) : undefined
}

// ── Seasons ──

function mapSeason(s: SanitySeason): SeasonData {
  return {
    name: s.name,
    slug: s.slug?.current ?? '',
    tags: (s.tags ?? []) as SeasonData['tags'],
    editorial: s.editorial,
    heroImage: resolveImage(s.heroImage),
    faqs: s.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    seoTitle: s.seo?.title ?? `${s.name} — Viajes | Travelhood`,
    seoDescription: s.seo?.description ?? '',
  }
}

export async function getSeasons(): Promise<SeasonData[]> {
  if (!isSanityConfigured()) return hardSeasons
  const data = await sanityFetch<SanitySeason[]>(allSeasonsQuery)
  return data.map(mapSeason)
}

export async function getSeasonBySlug(slug: string): Promise<SeasonData | undefined> {
  if (!isSanityConfigured()) return hardSeasons.find((s) => s.slug === slug)
  const data = await sanityFetch<SanitySeason | null>(seasonBySlugQuery, { slug })
  return data ? mapSeason(data) : undefined
}

// ── Blog ──

function mapBlogPost(s: SanityBlogPost): BlogPost {
  const pubDate = s.publishedAt ? new Date(s.publishedAt) : new Date()
  return {
    slug: s.slug?.current ?? '',
    title: s.title,
    excerpt: s.excerpt,
    metaDescription: s.seo?.metaDescription ?? s.excerpt,
    category: s.category,
    image: resolveImage(s.image),
    imageAlt: s.imageAlt ?? '',
    date: pubDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    dateISO: s.publishedAt ?? pubDate.toISOString().split('T')[0],
    readTime: s.readTime ?? '',
    featured: s.featured ?? false,
    author: { name: s.author?.name ?? 'Travelhood', role: s.author?.role ?? '' },
    relatedDestinations: s.relatedDestinations?.map((d) => d.slug?.current ?? '').filter(Boolean) ?? [],
    relatedSlugs: s.relatedPosts?.map((p) => p.slug?.current ?? '').filter(Boolean) ?? [],
    tags: s.tags ?? [],
    sections: s.sections?.map((sec) => ({
      heading: sec.heading,
      body: sec.body,
      image: resolveImage(sec.image),
      imageAlt: sec.imageAlt ?? '',
      cta: sec.cta ? { text: sec.cta.text ?? '', href: sec.cta.href ?? '' } : undefined,
    })) ?? [],
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured()) return hardBlogPosts
  const data = await sanityFetch<SanityBlogPost[]>(allBlogPostsQuery)
  return data.map(mapBlogPost)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSanityConfigured()) return hardBlogPosts.find((p) => p.slug === slug)
  const data = await sanityFetch<SanityBlogPost | null>(blogPostBySlugQuery, { slug })
  return data ? mapBlogPost(data) : undefined
}

// ── Comparisons ──

function mapComparison(s: SanityComparison): Comparison {
  return {
    slugA: s.destinationA?.slug?.current ?? '',
    slugB: s.destinationB?.slug?.current ?? '',
    verdict: s.verdict,
  }
}

export async function getComparisons(): Promise<Comparison[]> {
  if (!isSanityConfigured()) return hardComparisons
  const data = await sanityFetch<SanityComparison[]>(allComparisonsQuery)
  return data.map(mapComparison)
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | undefined> {
  if (!isSanityConfigured()) {
    return hardComparisons.find((c) => `${c.slugA}-vs-${c.slugB}` === slug)
  }
  const data = await sanityFetch<SanityComparison | null>(comparisonBySlugQuery, { slug })
  return data ? mapComparison(data) : undefined
}

// ── Site Settings ──

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  if (!isSanityConfigured()) return null
  return sanityFetch<SanitySiteSettings | null>(siteSettingsQuery)
}

// ── Landing Pages ──

export async function getLandingPages(): Promise<SanityLandingPage[]> {
  if (!isSanityConfigured()) return []
  return sanityFetch<SanityLandingPage[]>(allLandingPagesQuery)
}

export async function getLandingBySlug(slug: string): Promise<SanityLandingPage | null> {
  if (!isSanityConfigured()) return null
  return sanityFetch<SanityLandingPage | null>(landingBySlugQuery, { slug })
}

// ── Re-export helpers that don't change ──

export { lookupCoords }
