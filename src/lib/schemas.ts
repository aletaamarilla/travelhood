const SITE_URL = "https://travelhood.es"
const ORG_NAME = "Travelhood"
const ORG_LOGO = `${SITE_URL}/icon.svg`

export function generateTravelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    description: "Viajes en grupo para jóvenes de 20 a 35 años con coordinador en destino, alojamiento y seguro incluidos.",
    priceRange: "590€ - 1590€",
    areaServed: { "@type": "Country", name: "España" },
    audience: { "@type": "PeopleAudience", suggestedMinAge: 20, suggestedMaxAge: 35 },
    sameAs: [
      "https://instagram.com/travelhood.es",
      "https://tiktok.com/@travelhood.es",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
  }
}

/** @deprecated Use generateTravelAgencySchema instead */
export const generateOrganizationSchema = generateTravelAgencySchema

export function generateAggregateRatingSchema(reviewCount: number, ratingValue: number = 5) {
  return {
    "@type": "AggregateRating",
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: "5",
    worstRating: "1",
  }
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/viajes?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(opts: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}`,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Organization",
      name: opts.author ?? ORG_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      logo: { "@type": "ImageObject", url: ORG_LOGO },
    },
  }
}

export function generateTouristDestinationSchema(opts: {
  name: string
  description: string
  url: string
  image: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    image: opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}`,
    touristType: "Jóvenes de 20 a 35 años",
  }
}

export function generateProductSchema(opts: {
  name: string
  description: string
  url: string
  image: string
  price: number
  promoPrice?: number
  currency?: string
}) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: opts.promoPrice ?? opts.price,
    priceCurrency: opts.currency ?? "EUR",
    availability: "https://schema.org/InStock",
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}`,
    offers: offer,
  }
}

export function generateHowToSchema(opts: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function generateItemListSchema(opts: {
  name: string
  items: { name: string; url: string; position: number }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    itemListElement: opts.items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      name: item.name,
    })),
  }
}

export function generateCollectionPageSchema(opts: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    isPartOf: { "@type": "WebSite", name: ORG_NAME, url: SITE_URL },
  }
}

export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Sobre ${ORG_NAME}`,
    description: "Conoce la historia de Travelhood. Viajes en grupo para jóvenes de 20 a 35 años.",
    url: `${SITE_URL}/travelhood/`,
    mainEntity: {
      "@type": "TravelAgency",
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

export function generateOfferCatalogSchema(opts: {
  name: string
  description: string
  offers: {
    name: string
    price: number
    promoPrice: number
    url: string
    image: string
  }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: opts.name,
    description: opts.description,
    itemListElement: opts.offers.map((offer) => ({
      "@type": "Product",
      name: offer.name,
      image: offer.image.startsWith("http") ? offer.image : `${SITE_URL}${offer.image}`,
      offers: {
        "@type": "Offer",
        price: offer.promoPrice,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: offer.url.startsWith("http") ? offer.url : `${SITE_URL}${offer.url}`,
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: offer.price,
            priceCurrency: "EUR",
            priceType: "https://schema.org/ListPrice",
          },
          {
            "@type": "UnitPriceSpecification",
            price: offer.promoPrice,
            priceCurrency: "EUR",
            priceType: "https://schema.org/SalePrice",
          },
        ],
      },
    })),
  }
}

export function generateEventSchema(opts: {
  name: string
  startDate: string
  endDate: string
  location: string
  price: number
  currency?: string
  availability?: string
  url?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    startDate: opts.startDate,
    endDate: opts.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: opts.location,
    },
    organizer: {
      "@type": "TravelAgency",
      name: ORG_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.currency ?? "EUR",
      availability: opts.availability ?? "https://schema.org/InStock",
      url: opts.url ? (opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`) : SITE_URL,
    },
    ...(opts.image ? { image: opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}` } : {}),
  }
}

export function toJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(schema)
}
