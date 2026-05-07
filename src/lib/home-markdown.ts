import { resources, site } from "@/lib/agent-visibility"
import { buildWhatsAppUrl, FALLBACK_WHATSAPP_PHONE, FALLBACK_WA_COMMUNITY_URL } from "@/lib/config"
import {
  calculatePriceRange,
  getContinents,
  getDestinations,
  getGlobalFaqs,
  getSiteSettings,
  getTrips,
} from "@/lib/data-provider"

const WHATSAPP_INTENT = "Hola! Me interesa saber mas sobre vuestros viajes"
const MAX_DESTINATIONS = 12
const MAX_TRIPS = 8
const MAX_FAQS = 8

type MarkdownLine = string | false | null | undefined

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function markdownLink(label: string, href: string): string {
  return `[${label.replace(/[[\]]/g, "")}](${href})`
}

function destinationUrl(slug: string): string {
  return `/destino/${slug}/`
}

function formatDate(date: string): string {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate)
}

function formatTripPrice(price?: number): string {
  return typeof price === "number" && price > 0
    ? `desde ${price.toLocaleString("es-ES")} EUR`
    : "precio por confirmar"
}

function joinLines(lines: MarkdownLine[]): string {
  return lines.filter((line): line is string => typeof line === "string").join("\n")
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.split(/\s+/).filter(Boolean).length * 1.35)
}

export async function renderHomeMarkdown(): Promise<string> {
  const [destinations, trips, continents, settings, faqBlocks] = await Promise.all([
    getDestinations(),
    getTrips(),
    getContinents(),
    getSiteSettings(),
    getGlobalFaqs("home"),
  ])

  const priceRange = calculatePriceRange(trips)
  const whatsappPhone = settings?.whatsappPhone ?? FALLBACK_WHATSAPP_PHONE
  const whatsappCommunityUrl = settings?.whatsappCommunityUrl ?? FALLBACK_WA_COMMUNITY_URL
  const homeFaqs = faqBlocks.flatMap((block) => block.faqs).slice(0, MAX_FAQS)
  const continentById = new Map(continents.map((continent) => [continent.id, continent.name]))
  const activeTrips = trips.filter((trip) => trip.status !== "full" && trip.placesLeft > 0)
  const activeDestinationIds = new Set(activeTrips.map((trip) => trip.destinationId))
  const highlightedDestinations = destinations
    .filter((destination) => activeDestinationIds.has(destination.id))
    .slice(0, MAX_DESTINATIONS)
  const highlightedTrips = activeTrips
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .slice(0, MAX_TRIPS)

  const destinationLines = highlightedDestinations.map((destination) => {
    const summary = destination.shortDescription || destination.description
    const continent = continentById.get(destination.continentId)
    const metadata = [
      continent ? `continente: ${continent}` : null,
      destination.categories.length ? `tipo: ${destination.categories.join(", ")}` : null,
      destination.hasCoordinator ? "coordinador incluido" : null,
    ].filter(Boolean)

    return `- ${markdownLink(destination.name, destinationUrl(destination.slug))}: ${cleanText(summary)}${metadata.length ? ` (${metadata.join("; ")})` : ""}`
  })

  const tripLines = highlightedTrips.map((trip) => {
    const destination = destinations.find((item) => item.id === trip.destinationId)
    const destinationLabel = destination
      ? markdownLink(destination.name, destinationUrl(destination.slug))
      : "Destino por confirmar"
    const visiblePrice = trip.promoPrice ?? trip.priceFrom

    return `- ${trip.title}: ${destinationLabel}, salida ${formatDate(trip.departureDate)}, ${trip.durationDays} dias, ${formatTripPrice(visiblePrice)}, ${trip.placesLeft} plazas disponibles.`
  })

  const faqLines = homeFaqs.flatMap((faq) => [
    `### ${cleanText(faq.question)}`,
    cleanText(faq.answer),
  ])

  const markdown = joinLines([
    `# ${site.name}`,
    "",
    "> Tu pones las ganas, nosotros el grupo.",
    "",
    "Travel Hood organiza viajes en grupos reducidos para personas jovenes. El itinerario, el alojamiento y el coordinador en destino estan incluidos.",
    "",
    "## Datos clave",
    "",
    `- Idioma principal: ${site.language}.`,
    `- Destinos publicados: ${destinations.length}.`,
    `- Rango de precios: ${priceRange ? `${priceRange.formatted} sin vuelo internacional` : "consulta precios actualizados"}.`,
    "- Grupo habitual: 12-13 personas de 20 a 35 anos.",
    "- La mayoria de viajeros reservan sin acompanante.",
    "- Precio cerrado: sin fondo comun ni costes sorpresa en destino.",
    "- Incluye normalmente: coordinador, alojamiento y actividades indicadas en cada ficha.",
    "",
    "## Enlaces principales",
    "",
    `- ${markdownLink("Ver viajes disponibles", "/viajes/#resultados")}.`,
    `- ${markdownLink("Como funciona Travel Hood", "/como-funciona/")}.`,
    `- ${markdownLink("Preguntas frecuentes", "/preguntas-frecuentes/")}.`,
    `- ${markdownLink("Sobre Travel Hood", "/travelhood/")}.`,
    `- ${markdownLink("Escribir por WhatsApp", buildWhatsAppUrl(whatsappPhone, WHATSAPP_INTENT))}.`,
    whatsappCommunityUrl ? `- ${markdownLink("Unirse a la comunidad de WhatsApp", whatsappCommunityUrl)}.` : null,
    "",
    "## Destinos destacados",
    "",
    destinationLines.length ? destinationLines.join("\n") : "- Consulta la pagina de viajes para ver los destinos disponibles.",
    "",
    "## Proximas salidas",
    "",
    tripLines.length ? tripLines.join("\n") : "- No hay salidas abiertas publicadas en este momento.",
    "",
    "## Como funciona",
    "",
    "1. Elige el destino y la fecha que mejor encajen contigo.",
    "2. Revisa la ficha del viaje: itinerario, alojamiento, actividades incluidas y precio.",
    "3. Contacta con Travel Hood para resolver dudas antes de reservar.",
    "4. Viaja con un grupo reducido y coordinador en destino.",
    "",
    "## Preguntas frecuentes",
    "",
    faqLines.length ? faqLines.join("\n\n") : "Consulta la pagina de preguntas frecuentes para mas informacion.",
    "",
    "## Informacion para agentes",
    "",
    `- Recurso canonico HTML: ${resources.home.url}`,
    `- Recurso Markdown: ${resources.homeMarkdown.url}`,
    "- Esta representacion esta generada desde datos publicos de la web; no contiene informacion privada ni permite reservar, pagar o enviar mensajes automaticamente.",
  ])

  return `${markdown}\n`
}
