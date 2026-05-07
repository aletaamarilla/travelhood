import { webMcpTools, site } from "@/lib/agent-visibility"
import { getDestinations, getTripCategories } from "@/lib/data-provider"

export const prerender = true

const MAX_TEXT_LENGTH = 220

function compactText(value?: string, maxLength = MAX_TEXT_LENGTH): string {
  const text = (value ?? "").replace(/\s+/g, " ").trim()
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text
}

export async function GET() {
  const [destinations, tripTypes] = await Promise.all([
    getDestinations(),
    getTripCategories(),
  ])

  const publicData = {
    id: "travelhood.webmcp.public-data",
    site: {
      name: site.name,
      url: site.url,
      language: site.language,
    },
    webMcp: {
      scriptPath: webMcpTools.scriptPath,
      status: webMcpTools.status,
      tools: webMcpTools.tools,
    },
    travel: {
      audience: "Personas de 20 a 35 anos que quieren viajar en grupo.",
      group: "Grupos reducidos con coordinador en destino, alojamiento e itinerario organizado.",
      destinations: destinations.map((destination) => ({
        name: destination.name,
        slug: destination.slug,
        url: `/destino/${destination.slug}/`,
        categories: destination.categories,
        shortDescription: compactText(destination.shortDescription),
        idealFor: compactText(destination.idealFor, 160),
        highlights: destination.highlights.slice(0, 5),
        hasCoordinator: destination.hasCoordinator,
      })),
      tripTypes: tripTypes.map((tripType) => ({
        name: tripType.name,
        slug: tripType.slug,
        url: `/tipos/${tripType.slug}/`,
        summary: compactText(tripType.editorial),
        idealProfile: compactText(tripType.idealProfile, 180),
      })),
    },
    safety: {
      personalData: false,
      formData: false,
      destructiveActions: false,
      sendsMessages: false,
      note: "Solo contiene informacion publica minima para herramientas WebMCP de bajo riesgo.",
    },
  }

  return new Response(`${JSON.stringify(publicData, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
