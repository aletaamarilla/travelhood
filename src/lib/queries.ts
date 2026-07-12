// ── Continents ──
export const allContinentsQuery = `*[_type == "continent"] | order(name asc) {
  _id, name, slug, editorialIntro, heroImage, heroImageAlt, bestMonths, faqs, seo
}`

export const continentBySlugQuery = `*[_type == "continent" && slug.current == $slug][0] {
  _id, name, slug, editorialIntro, heroImage, heroImageAlt, bestMonths, faqs, seo
}`

// ── Countries ──
export const allCountriesQuery = `*[_type == "country"] | order(name asc) {
  _id, name, slug, flag, currency, currencyRate, language, timezone,
  visaRequired, visaInfo, vaccinesRecommended,
  continent->{_id, name, slug},
  seo
}`

export const countryBySlugQuery = `*[_type == "country" && slug.current == $slug][0] {
  _id, name, slug, flag, currency, currencyRate, language, timezone,
  visaRequired, visaInfo, vaccinesRecommended,
  continent->{_id, name, slug},
  seo
}`

// ── Destinations ──
export const allDestinationsQuery = `*[_type == "destination"] | order(name asc) {
  _id, name, slug, description, shortDescription, heroImage, heroImageAlt,
  gallery, highlights, idealFor, climate, categories, hasCoordinator,
  climateByMonth, budgetPerDay, coordinates,
  included, notIncluded, itinerary,
  country->{_id, name, slug, flag},
  continent->{_id, name, slug},
  faqs, seo,
  "pdfUrl": pdfFile.asset->url
}`

export const destinationBySlugQuery = `*[_type == "destination" && slug.current == $slug][0] {
  _id, name, slug, description, shortDescription, heroImage, heroImageAlt,
  gallery, highlights, idealFor, climate, categories, hasCoordinator,
  climateByMonth, budgetPerDay, coordinates,
  included, notIncluded, itinerary,
  country->{_id, name, slug, flag, currency, currencyRate, language, timezone, visaRequired, visaInfo, vaccinesRecommended},
  continent->{_id, name, slug},
  faqs, seo,
  "pdfUrl": pdfFile.asset->url
}`

export const destinationsByContinentQuery = `*[_type == "destination" && continent->slug.current == $slug] | order(name asc) {
  _id, name, slug, description, shortDescription, heroImage, heroImageAlt,
  gallery, highlights, idealFor, categories, climate, hasCoordinator,
  climateByMonth, budgetPerDay, coordinates,
  included, notIncluded, itinerary,
  country->{_id, name, slug, flag},
  continent->{_id, name, slug},
  faqs, seo,
  "pdfUrl": pdfFile.asset->url
}`

// ── Trips ──
export const allTripsQuery = `*[_type == "trip" && status != "full"] | order(departureDate asc) {
  _id, title, slug, departureDate, returnDate, durationDays,
  priceFrom, promoPrice, promoLabel, flightEstimate,
  totalPlaces, placesLeft, status, tags,
  destination->{_id, name, slug, heroImage, heroImageAlt, shortDescription, included, notIncluded, itinerary, hasCoordinator, country->{name, flag}, continent->{name, slug}},
  coordinator->{_id, name, slug, image, imageAlt, role}
}`

export const tripsByDestinationQuery = `*[_type == "trip" && destination->slug.current == $slug] | order(departureDate asc) {
  _id, title, slug, departureDate, returnDate, durationDays,
  priceFrom, promoPrice, promoLabel, flightEstimate,
  totalPlaces, placesLeft, status, tags,
  destination->{_id, name, slug, included, notIncluded, itinerary, hasCoordinator},
  coordinator->{_id, name, slug, image, imageAlt, role, bio, quote}
}`

export const tripsByTagQuery = `*[_type == "trip" && $tag in tags] | order(departureDate asc) {
  _id, title, slug, departureDate, returnDate, durationDays,
  priceFrom, promoPrice, promoLabel, flightEstimate,
  totalPlaces, placesLeft, status, tags,
  destination->{_id, name, slug, heroImage, heroImageAlt, shortDescription, included, notIncluded, itinerary, hasCoordinator, country->{name, flag}, continent->{name, slug}},
  coordinator->{_id, name, slug, image, imageAlt, role}
}`

// ── Coordinators ──
export const allCoordinatorsQuery = `*[_type == "coordinator"] | order(name asc) {
  _id, name, slug, age, role, bio, quote, image, imageAlt,
  destinations[]->{_id, name, slug}
}`

export const coordinatorBySlugQuery = `*[_type == "coordinator" && slug.current == $slug][0] {
  _id, name, slug, age, role, bio, quote, image, imageAlt,
  destinations[]->{_id, name, slug}
}`

// ── Testimonials ──
export const allTestimonialsQuery = `*[_type == "testimonial" && isVisible != false && verificationStatus != "retired"] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  _id, name, age, city, quote, rating, image, imageAlt, featured,
  source, verificationStatus, externalReviewUrl, sourceProfileUrl,
  experienceDateLabel, experienceDate, editorialReviewedAt, editorialEvidenceRef,
  isVisible, sortOrder,
  destination->{_id, name, slug}
}`

export const featuredTestimonialsQuery = `*[_type == "testimonial" && featured == true && isVisible != false && verificationStatus != "retired"] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  _id, name, age, city, quote, rating, image, imageAlt, featured,
  source, verificationStatus, externalReviewUrl, sourceProfileUrl,
  experienceDateLabel, experienceDate, editorialReviewedAt, editorialEvidenceRef,
  isVisible, sortOrder,
  destination->{_id, name, slug}
}`

export const testimonialsByDestinationQuery = `*[_type == "testimonial" && destination->slug.current == $slug && isVisible != false && verificationStatus != "retired"] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  _id, name, age, city, quote, rating, image, imageAlt, featured,
  source, verificationStatus, externalReviewUrl, sourceProfileUrl,
  experienceDateLabel, experienceDate, editorialReviewedAt, editorialEvidenceRef,
  isVisible, sortOrder,
  destination->{_id, name, slug}
}`

// ── Trip Categories ──
export const allCategoriesQuery = `*[_type == "tripCategory"] | order(name asc) {
  _id, name, slug, editorial, heroImage, heroImageAlt, idealProfile, faqs, seo
}`

export const categoryBySlugQuery = `*[_type == "tripCategory" && slug.current == $slug][0] {
  _id, name, slug, editorial, heroImage, heroImageAlt, idealProfile, faqs, seo
}`

// ── Seasons ──
export const allSeasonsQuery = `*[_type == "season"] | order(name asc) {
  _id, name, slug, tags, editorial, heroImage, heroImageAlt, faqs, seo
}`

export const seasonBySlugQuery = `*[_type == "season" && slug.current == $slug][0] {
  _id, name, slug, tags, editorial, heroImage, heroImageAlt, faqs, seo
}`

// ── Blog Posts ──
export const allBlogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, excerpt, category, image, imageAlt,
  publishedAt, updatedAt, readTime, featured, author, tags,
  sections, seo,
  relatedDestinations[]->{_id, name, slug, heroImage, shortDescription},
  relatedPosts[]->{_id, title, slug, excerpt, image, imageAlt, category, publishedAt}
}`

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, excerpt, category, image, imageAlt,
  publishedAt, updatedAt, readTime, featured, author, tags,
  sections, seo,
  relatedDestinations[]->{_id, name, slug, heroImage, shortDescription},
  relatedPosts[]->{_id, title, slug, excerpt, image, imageAlt, category, publishedAt}
}`

// ── Comparisons ──
export const allComparisonsQuery = `*[_type == "comparison"] {
  _id, slug, verdict, seo,
  destinationA->{_id, name, slug, heroImage, shortDescription, climate, categories, country->{name, flag}},
  destinationB->{_id, name, slug, heroImage, shortDescription, climate, categories, country->{name, flag}}
}`

export const comparisonBySlugQuery = `*[_type == "comparison" && slug.current == $slug][0] {
  _id, slug, verdict, seo,
  destinationA->{
    _id, name, slug, heroImage, heroImageAlt, description, shortDescription,
    climate, categories, highlights, idealFor,
    climateByMonth, budgetPerDay, coordinates,
    country->{name, flag, currency, currencyRate, language, timezone, visaRequired, visaInfo},
    continent->{name, slug}
  },
  destinationB->{
    _id, name, slug, heroImage, heroImageAlt, description, shortDescription,
    climate, categories, highlights, idealFor,
    climateByMonth, budgetPerDay, coordinates,
    country->{name, flag, currency, currencyRate, language, timezone, visaRequired, visaInfo},
    continent->{name, slug}
  }
}`

// ── Landing Pages ──
export const allLandingPagesQuery = `*[_type == "landingPage"] {
  _id, title, slug, headline, subtitle, heroImage, heroImageAlt,
  editorial, stats, faqs, seo,
  featuredDestinations[]->{_id, name, slug, heroImage, shortDescription}
}`

export const landingBySlugQuery = `*[_type == "landingPage" && slug == $slug][0] {
  _id, title, slug, headline, subtitle, heroImage, heroImageAlt,
  editorial, stats, faqs, seo,
  featuredDestinations[]->{_id, name, slug, heroImage, heroImageAlt, shortDescription, country->{name, flag}}
}`

// ── Legal Pages ──
export const allLegalPagesQuery = `*[_type == "legalPage"] | order(title asc) {
  _id, title, slug, version, effectiveDate, lastReviewedAt, body, seo
}`

export const legalPageBySlugQuery = `*[_type == "legalPage" && slug.current == $slug][0] {
  _id, title, slug, version, effectiveDate, lastReviewedAt, body, seo
}`

// ── Global FAQs ──
export const globalFaqsByPageQuery = `*[_type == "globalFaq" && $page in pages] | order(order asc) {
  title,
  "slug": slug.current,
  order,
  faqs[]{ question, answer }
}`

export const allGlobalFaqsQuery = `*[_type == "globalFaq"] | order(order asc) {
  title,
  "slug": slug.current,
  faqs[]{ question, answer }
}`

// ── Site Settings ──
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id, siteName, siteUrl, orgLogo, priceRange, depositAmount, contactEmail, whatsappPhone, whatsappCommunityUrl,
  legalLicenseType, legalLicenseNumber,
  socialLinks, trustpilotProfileUrl, reviewsAttributionText, reviewsLastReviewedAt, reviewsCtaLabel,
  defaultSeoImage, defaultIncluded, defaultNotIncluded,
  homeHeroImage, homeHeroImageAlt, homeWhyUsImage, homeHowItWorksImage,
  homeAboutBgImage, homeAboutPhoto, homeAboutPhotoAlt,
  travelhood_heroImage, travelhood_heroImageAlt,
  travelhood_purposePhoto, travelhood_purposePhotoAlt,
  travelhood_diffPhoto, travelhood_diffPhotoAlt,
  travelhood_communityPhotos,
  blog_heroImage, blog_heroImageAlt,
  opiniones_heroImage, opiniones_heroImageAlt,
  comoFunciona_heroImage, comoFunciona_heroImageAlt,
  viajes_heroImage, viajes_heroImageAlt,
  ofertas_heroImage, ofertas_heroImageAlt,
  faq_heroImage, faq_heroImageAlt
}`
