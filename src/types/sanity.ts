import type {SanityImageSource} from '@sanity/image-url'

// ── Shared ──

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityGeopoint {
  _type: 'geopoint'
  lat: number
  lng: number
}

export interface SanityFaq {
  _key: string
  question: string
  answer: string
}

export interface SanitySeo {
  title?: string
  description?: string
  keywords?: string
  ogImage?: SanityImageSource
}

export interface SanityRef {
  _id: string
}

// ── Site Settings ──

export interface SanitySiteSettings {
  _id: string
  siteName: string
  siteUrl: string
  orgLogo?: SanityImageSource
  priceRange?: string
  depositAmount?: number
  contactEmail?: string
  socialLinks?: {platform: string; url: string}[]
  whatsappPhone?: string
  whatsappCommunityUrl?: string
  legalLicenseType?: string
  legalLicenseNumber?: string
  trustpilotProfileUrl?: string
  reviewsAttributionText?: string
  reviewsLastReviewedAt?: string
  reviewsCtaLabel?: string
  defaultSeoImage?: SanityImageSource
  defaultIncluded?: string[]
  defaultNotIncluded?: string[]
  // Home images
  homeHeroImage?: SanityImageSource
  homeHeroImageAlt?: string
  homeWhyUsImage?: SanityImageSource
  homeHowItWorksImage?: SanityImageSource
  homeAboutBgImage?: SanityImageSource
  homeAboutPhoto?: SanityImageSource
  homeAboutPhotoAlt?: string
  // Travelhood page images
  travelhood_heroImage?: SanityImageSource
  travelhood_heroImageAlt?: string
  travelhood_purposePhoto?: SanityImageSource
  travelhood_purposePhotoAlt?: string
  travelhood_diffPhoto?: SanityImageSource
  travelhood_diffPhotoAlt?: string
  travelhood_communityPhotos?: (SanityImageSource & {alt?: string})[]
  // Page hero images
  blog_heroImage?: SanityImageSource
  blog_heroImageAlt?: string
  opiniones_heroImage?: SanityImageSource
  opiniones_heroImageAlt?: string
  comoFunciona_heroImage?: SanityImageSource
  comoFunciona_heroImageAlt?: string
  viajes_heroImage?: SanityImageSource
  viajes_heroImageAlt?: string
  ofertas_heroImage?: SanityImageSource
  ofertas_heroImageAlt?: string
  faq_heroImage?: SanityImageSource
  faq_heroImageAlt?: string
}

// ── Continent ──

export interface SanityContinent {
  _id: string
  name: string
  slug: SanitySlug
  editorialIntro: string
  heroImage: SanityImageSource
  heroImageAlt?: string
  bestMonths?: string
  faqs?: SanityFaq[]
  seo?: SanitySeo
}

// ── Country ──

export interface SanityCountry {
  _id: string
  name: string
  slug: SanitySlug
  flag: string
  currency?: string
  currencyRate?: string
  language?: string
  timezone?: string
  visaRequired?: boolean
  visaInfo?: string
  vaccinesRecommended?: string
  continent?: SanityRef & Pick<SanityContinent, 'name' | 'slug'>
  seo?: SanitySeo
}

// ── Destination ──

export interface SanityClimateMonth {
  month: string
  avgTemp?: string
  rainfall?: string
  recommendation?: string
  note?: string
}

export interface SanityBudgetPerDay {
  mealCostLow?: string
  mealCostMid?: string
  beerCost?: string
  dailyBudget?: string
  totalExtras?: string
}

export interface SanityDestinationSeo extends SanitySeo {
  cuandoViajarTitle?: string
  cuandoViajarDescription?: string
  presupuestoTitle?: string
  presupuestoDescription?: string
}

export interface SanityDestination {
  _id: string
  name: string
  slug: SanitySlug
  description: string
  shortDescription: string
  heroImage: SanityImageSource
  heroImageAlt?: string
  gallery?: (SanityImageSource & {alt?: string})[]
  highlights?: string[]
  idealFor?: string
  climate: string
  categories?: string[]
  hasCoordinator?: boolean
  climateByMonth?: SanityClimateMonth[]
  budgetPerDay?: SanityBudgetPerDay
  coordinates?: SanityGeopoint
  country?: SanityRef & Pick<SanityCountry, 'name' | 'slug' | 'flag' | 'currency' | 'currencyRate' | 'language' | 'timezone' | 'visaRequired' | 'visaInfo' | 'vaccinesRecommended'>
  continent?: SanityRef & Pick<SanityContinent, 'name' | 'slug'>
  included?: string[]
  notIncluded?: string[]
  itinerary?: SanityItineraryDay[]
  faqs?: SanityFaq[]
  seo?: SanityDestinationSeo
  pdfUrl?: string
}

// ── Coordinator ──

export interface SanityCoordinator {
  _id: string
  name: string
  slug: SanitySlug
  age?: number
  role?: string
  bio: string
  quote?: string
  image: SanityImageSource
  imageAlt?: string
  destinations?: (SanityRef & Pick<SanityDestination, 'name' | 'slug'>)[]
}

// ── Trip ──

export interface SanityItineraryDay {
  day: number
  title: string
  description?: string
  lat?: number
  lng?: number
}

export interface SanityTrip {
  _id: string
  title: string
  slug?: SanitySlug
  departureDate: string
  returnDate: string
  durationDays: number
  priceFrom: number
  promoPrice?: number
  promoLabel?: string
  flightEstimate: number
  totalPlaces: number
  placesLeft: number
  status: 'open' | 'almost-full' | 'full'
  tags?: string[]
  destination?: SanityRef & Pick<SanityDestination, 'name' | 'slug' | 'heroImage' | 'heroImageAlt' | 'shortDescription' | 'included' | 'notIncluded' | 'itinerary' | 'hasCoordinator'> & {
    country?: Pick<SanityCountry, 'name' | 'flag'>
    continent?: Pick<SanityContinent, 'name' | 'slug'>
  }
  coordinator?: SanityRef & Pick<SanityCoordinator, 'name' | 'slug' | 'image' | 'imageAlt' | 'role' | 'bio' | 'quote'>
}

// ── Testimonial ──

export type SanityTestimonialSource = 'trustpilot' | 'editorial'
export type SanityTestimonialVerificationStatus =
  | 'individual-link'
  | 'profile-link'
  | 'pending-review'
  | 'retired'

export interface SanityTestimonial {
  _id: string
  name: string
  age?: number
  city?: string
  quote: string
  rating: number
  image?: SanityImageSource
  imageAlt?: string
  featured?: boolean
  source?: SanityTestimonialSource
  verificationStatus?: SanityTestimonialVerificationStatus
  externalReviewUrl?: string
  sourceProfileUrl?: string
  experienceDateLabel?: string
  experienceDate?: string
  editorialReviewedAt?: string
  editorialEvidenceRef?: string
  isVisible?: boolean
  sortOrder?: number
  destination?: SanityRef & Pick<SanityDestination, 'name' | 'slug'>
}

// ── Trip Category ──

export interface SanityTripCategory {
  _id: string
  name: string
  slug: SanitySlug
  editorial: string
  heroImage: SanityImageSource
  heroImageAlt?: string
  idealProfile?: string
  faqs?: SanityFaq[]
  seo?: SanitySeo
}

// ── Season ──

export interface SanitySeason {
  _id: string
  name: string
  slug: SanitySlug
  tags?: string[]
  editorial: string
  heroImage: SanityImageSource
  heroImageAlt?: string
  faqs?: SanityFaq[]
  seo?: SanitySeo
}

// ── Blog ──

export interface SanityBlogSection {
  _key: string
  heading: string
  body: string
  image?: SanityImageSource
  imageAlt?: string
  cta?: {text?: string; href?: string}
}

export interface SanityBlogSeo {
  metaDescription?: string
  keywords?: string
  ogImage?: SanityImageSource
  noIndex?: boolean
}

export interface SanityBlogPost {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  category: string
  image: SanityImageSource
  imageAlt: string
  publishedAt: string
  updatedAt?: string
  readTime?: string
  featured?: boolean
  author?: {name?: string; role?: string}
  tags?: string[]
  sections?: SanityBlogSection[]
  seo?: SanityBlogSeo
  relatedDestinations?: (SanityRef & Pick<SanityDestination, 'name' | 'slug' | 'heroImage' | 'shortDescription'>)[]
  relatedPosts?: (SanityRef & Pick<SanityBlogPost, 'title' | 'slug' | 'excerpt' | 'image' | 'imageAlt' | 'category' | 'publishedAt'>)[]
}

// ── Comparison ──

export interface SanityComparison {
  _id: string
  slug?: SanitySlug
  verdict: string
  seo?: SanitySeo
  destinationA?: SanityDestination
  destinationB?: SanityDestination
}

// ── Legal Page ──

export interface SanityLegalPage {
  _id: string
  title: string
  slug: SanitySlug
  version: string
  effectiveDate: string
  lastReviewedAt?: string
  body: any[]
  seo?: {title?: string; description?: string}
}

// ── Global FAQ ──

export interface SanityGlobalFaq {
  title: string
  slug: string
  order: number
  pages: string[]
  faqs: Array<{ question: string; answer: string }>
}

// ── Landing Page ──

export interface SanityStatItem {
  _key: string
  value: string
  label: string
}

export interface SanityLandingPage {
  _id: string
  title: string
  slug: string
  headline: string
  subtitle?: string
  heroImage: SanityImageSource
  heroImageAlt?: string
  editorial: string
  featuredDestinations?: (SanityRef & Pick<SanityDestination, 'name' | 'slug' | 'heroImage' | 'heroImageAlt' | 'shortDescription'> & {
    country?: Pick<SanityCountry, 'name' | 'flag'>
  })[]
  faqs?: SanityFaq[]
  stats?: SanityStatItem[]
  seo?: SanitySeo
}
