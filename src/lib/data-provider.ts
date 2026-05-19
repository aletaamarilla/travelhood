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
  allLegalPagesQuery,
  legalPageBySlugQuery,
  siteSettingsQuery,
  globalFaqsByPageQuery,
  allGlobalFaqsQuery,
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
  SanityLegalPage,
  SanitySiteSettings,
  SanityGlobalFaq,
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
import { filterVisibleReviews, sortReviews } from './reviews'

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

export function resolveImage(img?: SanityImageSource | null): string {
  if (!img) return ''
  if (typeof img === 'string') return img
  try {
    return urlFor(img).width(1920).auto('format').url()
  } catch {
    return ''
  }
}

export function resolveImageThumb(img?: SanityImageSource | null, w = 800): string {
  if (!img) return ''
  if (typeof img === 'string') return img
  try {
    const ref = (img as Record<string, unknown>)?.asset as Record<string, string> | undefined
    const isSvg = ref?._ref?.endsWith('-svg')
    if (isSvg) return urlFor(img).url()
    return urlFor(img).width(w).auto('format').url()
  } catch {
    return ''
  }
}

// ── Resolved Settings Images ──

export interface ResolvedSettingsImages {
  homeHeroImage: string
  homeHeroImageAlt: string
  homeWhyUsImage: string
  homeHowItWorksImage: string
  homeAboutBgImage: string
  homeAboutPhoto: string
  homeAboutPhotoAlt: string
  travelhood_heroImage: string
  travelhood_heroImageAlt: string
  travelhood_purposePhoto: string
  travelhood_purposePhotoAlt: string
  travelhood_diffPhoto: string
  travelhood_diffPhotoAlt: string
  travelhood_communityPhotos: { url: string; alt: string }[]
  blog_heroImage: string
  blog_heroImageAlt: string
  opiniones_heroImage: string
  opiniones_heroImageAlt: string
  comoFunciona_heroImage: string
  comoFunciona_heroImageAlt: string
  viajes_heroImage: string
  viajes_heroImageAlt: string
  ofertas_heroImage: string
  ofertas_heroImageAlt: string
  faq_heroImage: string
  faq_heroImageAlt: string
  orgLogoUrl: string
  defaultSeoImageUrl: string
}

export function resolveSettingsImages(s: SanitySiteSettings): ResolvedSettingsImages {
  return {
    homeHeroImage: resolveImage(s.homeHeroImage),
    homeHeroImageAlt: s.homeHeroImageAlt ?? '',
    homeWhyUsImage: resolveImage(s.homeWhyUsImage),
    homeHowItWorksImage: resolveImage(s.homeHowItWorksImage),
    homeAboutBgImage: resolveImage(s.homeAboutBgImage),
    homeAboutPhoto: resolveImage(s.homeAboutPhoto),
    homeAboutPhotoAlt: s.homeAboutPhotoAlt ?? '',
    travelhood_heroImage: resolveImage(s.travelhood_heroImage),
    travelhood_heroImageAlt: s.travelhood_heroImageAlt ?? '',
    travelhood_purposePhoto: resolveImage(s.travelhood_purposePhoto),
    travelhood_purposePhotoAlt: s.travelhood_purposePhotoAlt ?? '',
    travelhood_diffPhoto: resolveImage(s.travelhood_diffPhoto),
    travelhood_diffPhotoAlt: s.travelhood_diffPhotoAlt ?? '',
    travelhood_communityPhotos: (s.travelhood_communityPhotos ?? []).map((img) => ({
      url: resolveImageThumb(img, 800),
      alt: (img as SanityImageSource & { alt?: string }).alt ?? '',
    })),
    blog_heroImage: resolveImage(s.blog_heroImage),
    blog_heroImageAlt: s.blog_heroImageAlt ?? '',
    opiniones_heroImage: resolveImage(s.opiniones_heroImage),
    opiniones_heroImageAlt: s.opiniones_heroImageAlt ?? '',
    comoFunciona_heroImage: resolveImage(s.comoFunciona_heroImage),
    comoFunciona_heroImageAlt: s.comoFunciona_heroImageAlt ?? '',
    viajes_heroImage: resolveImage(s.viajes_heroImage),
    viajes_heroImageAlt: s.viajes_heroImageAlt ?? '',
    ofertas_heroImage: resolveImage(s.ofertas_heroImage),
    ofertas_heroImageAlt: s.ofertas_heroImageAlt ?? '',
    faq_heroImage: resolveImage(s.faq_heroImage),
    faq_heroImageAlt: s.faq_heroImageAlt ?? '',
    orgLogoUrl: resolveImageThumb(s.orgLogo, 200),
    defaultSeoImageUrl: resolveImage(s.defaultSeoImage),
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
    seoTitle: s.seo?.title ?? `Viajes en grupo a ${s.name} | Travel Hood`,
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
    included: s.included ?? [],
    notIncluded: s.notIncluded ?? [],
    itinerary: (s.itinerary ?? []).map((d) => ({
      day: d.day,
      title: d.title,
      description: d.description ?? '',
      lat: d.lat,
      lng: d.lng,
    })),
    pdfUrl: s.pdfUrl ?? undefined,
    hasCoordinator: s.hasCoordinator ?? true,
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
}

function mapTrip(s: SanityTrip, ctx?: MergeContext): Trip {
  const destIncluded = s.destination?.included ?? []
  const destNotIncluded = s.destination?.notIncluded ?? []
  const destItinerary = s.destination?.itinerary ?? []
  const destHasCoordinator = s.destination?.hasCoordinator ?? true

  let baseIncluded = ctx?.defaultIncluded ?? []
  if (!destHasCoordinator) {
    baseIncluded = baseIncluded.filter(
      (item) => !item.toLowerCase().includes('coordinador')
    )
  }

  const included = ctx
    ? [...new Set([...baseIncluded, ...destIncluded])]
    : destIncluded

  const notIncluded = ctx
    ? [...new Set([...ctx.defaultNotIncluded, ...destNotIncluded])]
    : destNotIncluded

  const itinerary = destItinerary.map((d) => ({
    day: d.day,
    title: d.title,
    description: d.description ?? '',
    lat: d.lat,
    lng: d.lng,
  }))

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
    itinerary,
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
  return data.map((s) => mapTrip(s, settings))
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

function normalizeTestimonials(testimonials: Testimonial[], featuredOnly = false): Testimonial[] {
  const visibleTestimonials = filterVisibleReviews(testimonials)
    .filter((t) => !featuredOnly || t.featured === true)

  return sortReviews(visibleTestimonials)
}

function mapTestimonial(s: SanityTestimonial): Testimonial {
  return {
    id: s._id,
    name: s.name,
    age: s.age,
    city: s.city,
    destinationId: s.destination?._id,
    quote: s.quote,
    rating: s.rating,
    image: resolveImageThumb(s.image, 200),
    featured: s.featured ?? false,
    source: s.source ?? 'editorial',
    verificationStatus: s.verificationStatus ?? 'pending-review',
    externalReviewUrl: s.externalReviewUrl,
    sourceProfileUrl: s.sourceProfileUrl,
    experienceDateLabel: s.experienceDateLabel,
    experienceDate: s.experienceDate,
    editorialReviewedAt: s.editorialReviewedAt,
    editorialEvidenceRef: s.editorialEvidenceRef,
    isVisible: s.isVisible ?? true,
    sortOrder: s.sortOrder,
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) return normalizeTestimonials(hardTestimonials)
  const data = await sanityFetch<SanityTestimonial[]>(allTestimonialsQuery)
  return normalizeTestimonials(data.map(mapTestimonial))
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) return normalizeTestimonials(hardTestimonials, true)
  const data = await sanityFetch<SanityTestimonial[]>(featuredTestimonialsQuery)
  return normalizeTestimonials(data.map(mapTestimonial), true)
}

export async function getTestimonialsByDestination(slug: string): Promise<Testimonial[]> {
  if (!isSanityConfigured()) {
    const dest = hardDestinations.find((d) => d.slug === slug)
    return dest ? normalizeTestimonials(hardTestimonials.filter((t) => t.destinationId === dest.id)) : []
  }
  const data = await sanityFetch<SanityTestimonial[]>(testimonialsByDestinationQuery, { slug })
  return normalizeTestimonials(data.map(mapTestimonial))
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
    seoTitle: s.seo?.title ?? `${s.name} — Viajes en grupo | Travel Hood`,
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
    seoTitle: s.seo?.title ?? `${s.name} — Viajes | Travel Hood`,
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
    author: { name: s.author?.name ?? 'Travel Hood', role: s.author?.role ?? '' },
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
  const sanityPosts = data.map(mapBlogPost)
  const sanitySlugs = new Set(sanityPosts.map((p) => p.slug))
  const extras = hardBlogPosts.filter((p) => !sanitySlugs.has(p.slug))
  return [...sanityPosts, ...extras]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSanityConfigured()) return hardBlogPosts.find((p) => p.slug === slug)
  const data = await sanityFetch<SanityBlogPost | null>(blogPostBySlugQuery, { slug })
  if (data) return mapBlogPost(data)
  return hardBlogPosts.find((p) => p.slug === slug)
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

// ── Legal Pages ──

export async function getLegalPages(): Promise<SanityLegalPage[]> {
  if (!isSanityConfigured()) return []
  return sanityFetch<SanityLegalPage[]>(allLegalPagesQuery)
}

export async function getLegalPageBySlug(slug: string): Promise<SanityLegalPage | null> {
  if (!isSanityConfigured()) return null
  return sanityFetch<SanityLegalPage | null>(legalPageBySlugQuery, { slug })
}

// ── Global FAQs ──

const FALLBACK_FAQS: SanityGlobalFaq[] = [
  {
    title: 'Preguntas generales',
    slug: 'preguntas-generales',
    order: 0,
    pages: ['home', 'preguntas-frecuentes', 'como-funciona', 'trip-detail', 'viajar-sola'],
    faqs: [
      {
        question: '¿Cómo reservo mi viaje?',
        answer: 'Elige el viaje que más te guste, rellena el formulario de reserva y realiza el pago de la señal. Recibirás un email de confirmación con todos los detalles.',
      },
      {
        question: '¿Qué incluye el viaje?',
        answer: 'Cada viaje detalla en su ficha lo que incluye y lo que no. Generalmente incluye alojamiento, actividades y coordinador de viaje. El vuelo internacional no está incluido.',
      },
      {
        question: '¿Es seguro viajar con Travel Hood?',
        answer: 'Todos nuestros viajes incluyen seguro de viaje y están organizados por coordinadores experimentados que conocen el destino. Tu seguridad es nuestra prioridad.',
      },
      {
        question: '¿Puedo cancelar mi reserva?',
        answer: 'Puedes cancelar tu viaje según nuestra política de cancelación. Consulta los Términos y Condiciones para conocer los plazos y condiciones de reembolso.',
      },
      {
        question: '¿Hay fondo común o "bote" durante el viaje?',
        answer: 'No. En Travel Hood el precio de tu viaje es cerrado. Lo que ves en la ficha es lo que pagas. No hay fondo común, "bote" ni gastos sorpresa en destino. Tú gestionas tu dinero en todo momento.',
      },
      {
        question: '¿Viajo sola o en grupo?',
        answer: 'Viajas en grupo reducido con otras viajeras. Es la forma perfecta de conocer gente nueva mientras descubres destinos increíbles con total seguridad.',
      },
    ],
  },
]

export async function getGlobalFaqs(page?: string): Promise<SanityGlobalFaq[]> {
  if (!isSanityConfigured()) return FALLBACK_FAQS
  try {
    const data = page
      ? await sanityFetch<SanityGlobalFaq[]>(globalFaqsByPageQuery, { page })
      : await sanityFetch<SanityGlobalFaq[]>(allGlobalFaqsQuery)
    return data.length > 0 ? data : FALLBACK_FAQS
  } catch {
    return FALLBACK_FAQS
  }
}

// ── Price Range Calculation ──

export interface PriceRange {
  minPrice: number
  maxPrice: number
  formatted: string
}

export function calculatePriceRange(trips: Trip[]): PriceRange | null {
  const activeTrips = trips.filter((t) => t.status !== 'full' && t.priceFrom > 0)
  if (activeTrips.length === 0) return null
  const prices = activeTrips.map((t) => t.priceFrom)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return {
    minPrice: min,
    maxPrice: max,
    formatted:
      min === max
        ? `Desde ${min.toLocaleString('es-ES')}€`
        : `${min.toLocaleString('es-ES')}€ – ${max.toLocaleString('es-ES')}€`,
  }
}

export async function getDepositAmount(): Promise<number> {
  const settings = await getSiteSettings()
  return settings?.depositAmount ?? 250
}

// ── Featured Destinations ──

export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  const [allDests, allTrips] = await Promise.all([getDestinations(), getTrips()])
  const activeDestIds = new Set(allTrips.filter((t) => t.status !== 'full').map((t) => t.destinationId))
  const withActiveTrips = allDests.filter((d) => activeDestIds.has(d.id))
  const tripCount = (d: Destination) => allTrips.filter((t) => t.destinationId === d.id && t.status !== 'full').length
  return withActiveTrips.sort((a, b) => tripCount(b) - tripCount(a)).slice(0, limit)
}

// ── Re-export helpers that don't change ──

export { lookupCoords }
