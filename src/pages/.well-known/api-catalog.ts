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

const allResources = Object.values(resources) as readonly AgentVisibilityResource[]
const catalogResources = apiCatalog.describedResourceIds.map((resourceId) => {
  const resource = allResources.find((candidate) => candidate.id === resourceId)

  if (!resource) {
    throw new Error(`Missing agent visibility resource: ${resourceId}`)
  }

  return resource
})

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
