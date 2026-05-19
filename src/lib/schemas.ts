import {
  SITE_URL,
  FALLBACK_SITE_NAME,
  FALLBACK_INSTAGRAM_URL,
  FALLBACK_LEGAL_LICENSE_NUMBER,
  FALLBACK_LEGAL_LICENSE_TYPE,
  FALLBACK_TIKTOK_URL,
} from "@/lib/config"

const ORG_NAME = FALLBACK_SITE_NAME
const ORG_LOGO = `${SITE_URL}/icon.svg`

interface LegalLicenseSchemaInput {
  type?: string
  number?: string
}

export function generateTravelAgencySchema(priceRange?: string, legalLicense: LegalLicenseSchemaInput = {}) {
  const licenseType = legalLicense.type || FALLBACK_LEGAL_LICENSE_TYPE
  const licenseNumber = legalLicense.number || FALLBACK_LEGAL_LICENSE_NUMBER

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    description: "Viajes en grupo para jóvenes de 20 a 35 años con coordinador en destino y alojamiento incluidos.",
    priceRange: priceRange || "Consulta precios",
    ...(licenseNumber
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: licenseType,
            value: licenseNumber,
          },
        }
      : {}),
    areaServed: { "@type": "Country", name: "España" },
    audience: { "@type": "PeopleAudience", suggestedMinAge: 20, suggestedMaxAge: 35 },
    sameAs: [
      FALLBACK_INSTAGRAM_URL,
      FALLBACK_TIKTOK_URL,
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

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/viajes/?q={search_term_string}`,
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
    description: "Conoce la historia de Travel Hood. Viajes en grupo para jóvenes de 20 a 35 años.",
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
  description?: string
  startDate: string
  endDate: string
  location: string
  locationAddress?: string
  performer?: string
  price: number
  currency?: string
  availability?: string
  validFrom?: string
  url?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    startDate: opts.startDate,
    endDate: opts.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(opts.performer ? {
      performer: {
        "@type": "Organization",
        name: opts.performer,
      },
    } : {}),
    location: {
      "@type": "Place",
      name: opts.location,
      ...(opts.locationAddress ? {
        address: {
          "@type": "PostalAddress",
          addressCountry: opts.locationAddress,
        },
      } : {}),
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
      ...(opts.availability ? { availability: opts.availability } : {}),
      ...(opts.validFrom ? { validFrom: opts.validFrom } : {}),
      url: opts.url ? (opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`) : SITE_URL,
    },
    ...(opts.image ? { image: opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}` } : {}),
  }
}

export function generateSiteNavigationSchema() {
  const navItems = [
    { name: "Viajes y destinos", path: "/viajes/" },
    { name: "Cómo funciona", path: "/como-funciona/" },
    { name: "Opiniones", path: "/opiniones/" },
    { name: "Travel Hood", path: "/travelhood/" },
    { name: "Blog", path: "/blog/" },
    { name: "Preguntas frecuentes", path: "/preguntas-frecuentes/" },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Navegación principal",
    hasPart: navItems.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  }
}

export function toJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(schema)
}
