#!/usr/bin/env npx tsx
/**
 * Validates that every destination offered by the search catalog resolves to a
 * statically generated `/destino/[slug]/` page (no 404 navigation).
 *
 * Usage: npm run check:search-destinations
 */

import * as dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config({ path: resolve(process.cwd(), ".env") })

interface ValidationFailure {
  name: string
  id: string
  slug: string
  reason: string
}

function bridgeSanityEnv(): void {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> }
  if (!meta.env) {
    meta.env = {} as ImportMetaEnv & Record<string, string | undefined>
  }
  for (const key of ["SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_API_VERSION"] as const) {
    const value = process.env[key]
    if (value) meta.env[key] = value
  }
}

function formatFailure(failure: ValidationFailure): string {
  return [
    `  destination="${failure.name}"`,
    `id="${failure.id}"`,
    `slug="${failure.slug}"`,
    `reason=${failure.reason}`,
  ].join(" ")
}

async function main(): Promise<void> {
  bridgeSanityEnv()

  const {
    getSearchCatalog,
    getDestinations,
    getDestinationBySlug,
    toSearchDestinationRefs,
  } = await import("../src/lib/data-provider.ts")
  const { resolveSearchNavigation } = await import("../src/lib/search-intent.ts")

  const [{ destinations: searchable }, allDestinations] = await Promise.all([
    getSearchCatalog(),
    getDestinations(),
  ])

  const staticPathSlugs = new Set(
    allDestinations.map((destination) => destination.slug?.trim()).filter(Boolean),
  )

  const failures: ValidationFailure[] = []
  const bySlug = new Map<string, typeof searchable>()
  const byId = new Map<string, typeof searchable>()

  for (const destination of searchable) {
    const name = destination.name?.trim() || "(sin nombre)"
    const id = destination.id?.trim() ?? ""
    const slug = destination.slug?.trim() ?? ""

    if (!slug) {
      failures.push({
        name,
        id,
        slug: destination.slug ?? "",
        reason: "missing-slug",
      })
      continue
    }

    if (!id) {
      failures.push({
        name,
        id: destination.id ?? "",
        slug,
        reason: "missing-id",
      })
      continue
    }

    const slugGroup = bySlug.get(slug) ?? []
    slugGroup.push(destination)
    bySlug.set(slug, slugGroup)

    const idGroup = byId.get(id) ?? []
    idGroup.push(destination)
    byId.set(id, idGroup)
  }

  for (const [slug, destinations] of bySlug) {
    if (destinations.length <= 1) continue
    for (const destination of destinations) {
      failures.push({
        name: destination.name?.trim() || "(sin nombre)",
        id: destination.id,
        slug,
        reason: "duplicate-slug",
      })
    }
  }

  for (const [id, destinations] of byId) {
    if (destinations.length <= 1) continue
    for (const destination of destinations) {
      failures.push({
        name: destination.name?.trim() || "(sin nombre)",
        id,
        slug: destination.slug,
        reason: "duplicate-id",
      })
    }
  }

  const refs = toSearchDestinationRefs(searchable)

  for (const destination of searchable) {
    const name = destination.name?.trim() || "(sin nombre)"
    const id = destination.id
    const slug = destination.slug.trim()

    if (!staticPathSlugs.has(slug)) {
      failures.push({
        name,
        id,
        slug,
        reason: "slug-not-generable",
      })
    }

    const resolved = await getDestinationBySlug(slug)
    if (!resolved) {
      failures.push({
        name,
        id,
        slug,
        reason: "destination-lookup-missing",
      })
    } else if (resolved.id !== id) {
      failures.push({
        name,
        id,
        slug,
        reason: "destination-lookup-id-mismatch",
      })
    }

    const navigation = resolveSearchNavigation(
      {
        destination: { mode: "specific", kind: "destination", destinationId: id },
        date: { mode: "any" },
      },
      refs,
    )

    const expectedHref = `/destino/${slug}/`
    if (navigation.href !== expectedHref) {
      failures.push({
        name,
        id,
        slug,
        reason: `navigation-href-mismatch:${navigation.href}`,
      })
    }
  }

  const dataSource =
    import.meta.env.SANITY_PROJECT_ID &&
    import.meta.env.SANITY_PROJECT_ID !== "YOUR_PROJECT_ID"
      ? "sanity"
      : "hardcoded"

  if (failures.length > 0) {
    console.error(`check:search-destinations FAILED (${dataSource} data)`)
    console.error(`${failures.length} searchable destination issue(s):\n`)
    for (const failure of failures) {
      console.error(formatFailure(failure))
    }
    console.error(
      "\nFix: ensure searchable destinations pass filterSearchableDestinations() and each slug exists in getDestinations() static paths.",
    )
    process.exit(1)
  }

  console.log(
    `check:search-destinations OK (${dataSource} data): ${searchable.length} searchable destination(s), ${staticPathSlugs.size} static /destino/ path(s)`,
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`check:search-destinations ERROR: ${message}`)
  process.exit(1)
})
