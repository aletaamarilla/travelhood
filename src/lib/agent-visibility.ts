import { FALLBACK_SITE_NAME, SITE_URL } from "@/lib/config"

export type ResourceStatus = "available" | "planned" | "unsupported"

export type AgentVisibilityResource = {
  id: string
  path: string
  url: string
  contentType: string
  status: ResourceStatus
  description: string
}

export type LinkHeaderEntry = {
  href: string
  rel: string
  type?: string
  title?: string
}

export type AuthorizationServerMetadata = {
  issuer: string
  authorizationEndpoint: string
  tokenEndpoint: string
  jwksUri: string
  grantTypesSupported: readonly string[]
  responseTypesSupported: readonly string[]
  tokenEndpointAuthMethodsSupported: readonly string[]
  codeChallengeMethodsSupported: readonly string[]
  scopesSupported: readonly string[]
}

export type ProtectedResourceMetadata = {
  resource: string
  authorizationServers: readonly string[]
  scopesSupported: readonly string[]
  bearerMethodsSupported: readonly string[]
  resourceDocumentation: string
}

export type McpServerCard = {
  serverInfo: {
    name: string
    version: string
  }
  transport: {
    type: "streamable-http"
    endpoint: string
  }
  capabilities: {
    tools: boolean
    resources: boolean
    prompts: boolean
  }
  auth: {
    required: boolean
    authorizationServers: readonly string[]
    scopes: readonly string[]
  }
  documentation: string
}

export type AgentDiscoveryConfig = {
  siteOrigin: string
  issuer?: string
  authorizationEndpoint?: string
  tokenEndpoint?: string
  jwksUri?: string
  resourceIdentifier?: string
  mcpEndpoint?: string
  mcpServerName: string
  mcpServerVersion: string
  supportedScopes: readonly string[]
  supportedGrantTypes: readonly string[]
  supportedResponseTypes: readonly string[]
  tokenEndpointAuthMethods: readonly string[]
  codeChallengeMethods: readonly string[]
  lastReviewedAt: string
  hasAuthorizationServer: boolean
  hasProtectedResource: boolean
  hasMcpServer: boolean
}

const SITE_BASE_URL = SITE_URL.replace(/\/+$/, "")

function publicEnvUrl(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    return undefined
  }

  return normalizedValue
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${SITE_BASE_URL}${normalizedPath}`
}

export const site = {
  name: FALLBACK_SITE_NAME,
  url: SITE_BASE_URL,
  language: "es-ES",
  description:
    "Viajes en grupo reducido para personas jovenes, con itinerario, alojamiento y coordinador incluidos.",
  visibilityVersion: "agent-visibility-v1",
} as const

const configuredIssuer = publicEnvUrl(import.meta.env.PUBLIC_AGENT_AUTH_ISSUER)
const configuredAuthorizationEndpoint = publicEnvUrl(
  import.meta.env.PUBLIC_AGENT_AUTHORIZATION_ENDPOINT,
)
const configuredTokenEndpoint = publicEnvUrl(import.meta.env.PUBLIC_AGENT_TOKEN_ENDPOINT)
const configuredJwksUri = publicEnvUrl(import.meta.env.PUBLIC_AGENT_JWKS_URI)
const configuredResourceIdentifier = publicEnvUrl(import.meta.env.PUBLIC_AGENT_RESOURCE)
const configuredMcpEndpoint = publicEnvUrl(import.meta.env.PUBLIC_AGENT_MCP_ENDPOINT)

const hasCompleteAuthorizationServerConfig = Boolean(
  configuredIssuer &&
    configuredAuthorizationEndpoint &&
    configuredTokenEndpoint &&
    configuredJwksUri,
)

// Public capability flags must only flip when the matching discovery route or
// MCP card is implemented, not merely because future env values are present.
const publishesAuthorizationServerDiscovery = false
const publishesMcpServerCard = false
const hasAuthorizationServer = publishesAuthorizationServerDiscovery && hasCompleteAuthorizationServerConfig
const hasProtectedResource = Boolean(hasAuthorizationServer && configuredResourceIdentifier)
const hasMcpServer = publishesMcpServerCard && Boolean(configuredMcpEndpoint)

const supportedScopes = hasProtectedResource
  ? [
      "travelhood.public.read",
      ...(hasMcpServer ? ["travelhood.mcp.read"] : []),
    ]
  : []

export const agentDiscoveryConfig = {
  siteOrigin: SITE_BASE_URL,
  issuer: configuredIssuer,
  authorizationEndpoint: configuredAuthorizationEndpoint,
  tokenEndpoint: configuredTokenEndpoint,
  jwksUri: configuredJwksUri,
  resourceIdentifier: configuredResourceIdentifier,
  mcpEndpoint: configuredMcpEndpoint,
  mcpServerName: "Travel Hood MCP",
  mcpServerVersion: "0.0.0",
  supportedScopes,
  supportedGrantTypes: hasAuthorizationServer ? ["authorization_code"] : [],
  supportedResponseTypes: hasAuthorizationServer ? ["code"] : [],
  tokenEndpointAuthMethods: hasAuthorizationServer ? ["client_secret_post", "none"] : [],
  codeChallengeMethods: hasAuthorizationServer ? ["S256"] : [],
  lastReviewedAt: "2026-05-07",
  hasAuthorizationServer,
  hasProtectedResource,
  hasMcpServer,
} as const satisfies AgentDiscoveryConfig

export const resources = {
  home: {
    id: "home",
    path: "/",
    url: absoluteUrl("/"),
    contentType: "text/html; charset=utf-8",
    status: "available",
    description: "Home publica de Travel Hood para navegadores y crawlers.",
  },
  robots: {
    id: "robots",
    path: "/robots.txt",
    url: absoluteUrl("/robots.txt"),
    contentType: "text/plain; charset=utf-8",
    status: "available",
    description: "Reglas de crawling y sitemap canonico del sitio.",
  },
  sitemapIndex: {
    id: "sitemap-index",
    path: "/sitemap-index.xml",
    url: absoluteUrl("/sitemap-index.xml"),
    contentType: "application/xml; charset=utf-8",
    status: "available",
    description: "Indice de sitemaps generado por Astro.",
  },
  rss: {
    id: "rss",
    path: "/rss.xml",
    url: absoluteUrl("/rss.xml"),
    contentType: "application/rss+xml; charset=utf-8",
    status: "available",
    description: "Feed RSS publico del blog.",
  },
  apiCatalog: {
    id: "api-catalog",
    path: "/.well-known/api-catalog",
    url: absoluteUrl("/.well-known/api-catalog"),
    contentType: "application/linkset+json; charset=utf-8",
    status: "available",
    description: "Catalogo linkset JSON de recursos publicos automatizables.",
  },
  agentSkillsIndex: {
    id: "agent-skills-index",
    path: "/.well-known/agent-skills/index.json",
    url: absoluteUrl("/.well-known/agent-skills/index.json"),
    contentType: "application/json; charset=utf-8",
    status: "available",
    description: "Indice de skills publicas con digests verificables.",
  },
  homeMarkdown: {
    id: "home-markdown",
    path: "/.well-known/travelhood-home.md",
    url: absoluteUrl("/.well-known/travelhood-home.md"),
    contentType: "text/markdown; charset=utf-8",
    status: "available",
    description: "Representacion Markdown controlada de la home.",
  },
} as const satisfies Record<string, AgentVisibilityResource>

export const contentSignals = {
  aiTrain: "no",
  search: "yes",
  aiInput: "yes",
  robotsDirective: "Content-Signal",
  value: "ai-train=no, search=yes, ai-input=yes",
} as const

export const apiCatalog = {
  endpoint: resources.apiCatalog,
  contentType: resources.apiCatalog.contentType,
  cacheControl: "public, max-age=3600",
  describedResourceIds: [
    resources.home.id,
    resources.robots.id,
    resources.sitemapIndex.id,
    resources.rss.id,
    resources.agentSkillsIndex.id,
    resources.homeMarkdown.id,
  ],
} as const

export const agentSkills = {
  index: resources.agentSkillsIndex,
  skills: [
    {
      id: "recomendar-viaje",
      name: "Recomendar viaje",
      description:
        "Ayuda a elegir opciones de viaje de Travel Hood usando solo informacion publica del sitio.",
      path: "/.well-known/agent-skills/recomendar-viaje.md",
      url: absoluteUrl("/.well-known/agent-skills/recomendar-viaje.md"),
      contentType: "text/markdown; charset=utf-8",
      status: "available",
      safetyLimits: [
        "Solo usa informacion publica.",
        "No reserva plazas ni confirma disponibilidad.",
        "No procesa pagos.",
        "No solicita, envia ni almacena datos personales.",
        "No ejecuta acciones irreversibles.",
      ],
    },
    {
      id: "preparar-contacto-whatsapp",
      name: "Preparar contacto por WhatsApp",
      description:
        "Redacta un borrador de mensaje para WhatsApp que la persona revisa y envia manualmente.",
      path: "/.well-known/agent-skills/preparar-contacto-whatsapp.md",
      url: absoluteUrl("/.well-known/agent-skills/preparar-contacto-whatsapp.md"),
      contentType: "text/markdown; charset=utf-8",
      status: "available",
      safetyLimits: [
        "Solo prepara un borrador editable.",
        "No abre WhatsApp ni envia mensajes.",
        "No rellena formularios.",
        "No procesa pagos ni reservas.",
        "No incluye datos personales sensibles.",
        "No ejecuta acciones irreversibles.",
      ],
    },
  ],
} as const

export const webMcpTools = {
  scriptPath: "/scripts/webmcp.js",
  scriptUrl: absoluteUrl("/scripts/webmcp.js"),
  dataPath: "/webmcp-data.json",
  dataUrl: absoluteUrl("/webmcp-data.json"),
  status: "available",
  tools: [
    {
      id: "travelhood.listDestinations",
      destructive: false,
      readsPersonalData: false,
      sendsMessages: false,
      description: "Listar destinos publicos disponibles para viajes en grupo.",
    },
    {
      id: "travelhood.summarizeTripTypes",
      destructive: false,
      readsPersonalData: false,
      sendsMessages: false,
      description: "Resumir tipos de viaje y enlaces publicos relevantes.",
    },
    {
      id: "travelhood.prepareWhatsAppMessage",
      destructive: false,
      readsPersonalData: false,
      sendsMessages: false,
      description: "Preparar un borrador de consulta sin enviarlo ni abrir WhatsApp.",
    },
  ],
} as const

// These flags are intentionally false. The WebMCP browser script above exposes
// local, public-data helpers only; it is not an OAuth issuer, protected resource
// server, or standalone MCP server with a tested transport and server card.
export const unsupportedCapabilities = {
  oauthDiscovery: {
    supported: false,
    reason: "No hay login publico, issuer OAuth ni authorization server real para agentes.",
    routes: [
      "/.well-known/openid-configuration",
      "/.well-known/oauth-authorization-server",
    ],
  },
  protectedResourceMetadata: {
    supported: false,
    reason: "No hay recursos publicos protegidos por token ni scopes documentados.",
    routes: ["/.well-known/oauth-protected-resource"],
  },
  mcpServerCard: {
    supported: false,
    reason: "No existe servidor MCP publico ni transporte probado que anunciar.",
    routes: ["/.well-known/mcp/server-card.json"],
  },
} as const

export const capabilityFlags = {
  oauthDiscovery: agentDiscoveryConfig.hasAuthorizationServer,
  protectedResourceMetadata: agentDiscoveryConfig.hasProtectedResource,
  mcpServerCard: agentDiscoveryConfig.hasMcpServer,
} as const

export const agentDiscoveryLinks = [
  {
    href: resources.apiCatalog.path,
    rel: "service-desc",
    type: "application/linkset+json",
    title: "Travel Hood API catalog",
  },
  {
    href: resources.agentSkillsIndex.path,
    rel: "describedby",
    type: "application/json",
    title: "Travel Hood agent skills",
  },
  {
    href: resources.robots.path,
    rel: "robots",
    type: "text/plain",
  },
  {
    href: resources.sitemapIndex.path,
    rel: "sitemap",
    type: "application/xml",
  },
  {
    href: resources.homeMarkdown.path,
    rel: "alternate",
    type: "text/markdown",
    title: "Travel Hood home in Markdown",
  },
] as const satisfies readonly LinkHeaderEntry[]

function quoteHeaderParam(value: string): string {
  return value.replace(/["\\]/g, "\\$&")
}

export function linkHeaderValue(links: readonly LinkHeaderEntry[] = agentDiscoveryLinks): string {
  return links
    .map((link) => {
      const params = [
        `rel="${quoteHeaderParam(link.rel)}"`,
        link.type ? `type="${quoteHeaderParam(link.type)}"` : null,
        link.title ? `title="${quoteHeaderParam(link.title)}"` : null,
      ].filter(Boolean)

      return `<${link.href}>; ${params.join("; ")}`
    })
    .join(", ")
}

export const agentLinkHeaderValue = linkHeaderValue()
