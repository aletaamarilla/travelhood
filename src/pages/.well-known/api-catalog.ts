import {
  apiCatalog,
  resources,
  site,
  type AgentVisibilityResource,
} from "@/lib/agent-visibility"

type LinksetTarget = {
  href: string
  type?: string
  title?: string
}

type LinksetEntry = {
  anchor: string
  "service-desc": LinksetTarget[]
  item: LinksetTarget[]
}

const catalogResources = [
  resources.home,
  resources.robots,
  resources.sitemapIndex,
  resources.rss,
  resources.agentSkillsIndex,
  resources.homeMarkdown,
] as const satisfies readonly AgentVisibilityResource[]

function mediaType(contentType: string): string {
  return contentType.split(";")[0]?.trim() || contentType
}

function toLinksetTarget(resource: AgentVisibilityResource): LinksetTarget {
  return {
    href: resource.url,
    type: mediaType(resource.contentType),
    title: resource.description,
  }
}

export function GET() {
  const linkset: { linkset: LinksetEntry[] } = {
    linkset: [
      {
        anchor: site.url,
        "service-desc": [toLinksetTarget(apiCatalog.endpoint)],
        item: catalogResources.map(toLinksetTarget),
      },
    ],
  }

  return new Response(`${JSON.stringify(linkset, null, 2)}\n`, {
    headers: {
      "Content-Type": apiCatalog.contentType,
      "Cache-Control": apiCatalog.cacheControl,
    },
  })
}
