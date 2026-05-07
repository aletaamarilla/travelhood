#!/usr/bin/env node

import assert from "node:assert/strict"
import { createHash } from "node:crypto"

const REQUIRED_LINKS = [
  {
    path: "/.well-known/api-catalog",
    rel: "service-desc",
    type: "application/linkset+json",
  },
  {
    path: "/.well-known/agent-skills/index.json",
    rel: "describedby",
    type: "application/json",
  },
  {
    path: "/robots.txt",
    rel: "robots",
    type: "text/plain",
  },
  {
    path: "/sitemap-index.xml",
    rel: "sitemap",
    type: "application/xml",
  },
  {
    path: "/.well-known/travelhood-home.md",
    rel: "alternate",
    type: "text/markdown",
  },
]

const REQUIRED_CATALOG_PATHS = [
  "/",
  "/robots.txt",
  "/sitemap-index.xml",
  "/rss.xml",
  "/.well-known/agent-skills/index.json",
  "/.well-known/travelhood-home.md",
]

const UNSUPPORTED_DISCOVERY_PATHS = [
  "/.well-known/openid-configuration",
  "/.well-known/oauth-authorization-server",
  "/.well-known/oauth-protected-resource",
  "/.well-known/mcp/server-card.json",
]

const SKILL_DIGEST_ALGORITHM = "sha-256"
const DEFAULT_NEGOTIATION = "auto"
const DEFAULT_TIMEOUT_MS = 10_000

const checks = []
const warnings = []
const failures = []

function usage() {
  return `Usage: npm run check:visibility -- <base-url> [options]

Options:
  --base-url <url>                 Base URL to check.
  --negotiation <auto|required|skip>
                                   Validate Accept: text/markdown rewrite handling.
                                   Default: auto.
  --timeout-ms <ms>                Per-request timeout. Default: ${DEFAULT_TIMEOUT_MS}.
  -h, --help                       Show this help.

Examples:
  npm run check:visibility -- http://localhost:4321
  npm run check:visibility -- https://travelhood.es --negotiation required
`
}

function parseArgs(argv) {
  const options = {
    baseUrl: "",
    negotiation: DEFAULT_NEGOTIATION,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "-h" || arg === "--help") {
      console.log(usage())
      process.exit(0)
    }

    if (arg === "--base-url") {
      options.baseUrl = argv[++index] ?? ""
      continue
    }

    if (arg.startsWith("--base-url=")) {
      options.baseUrl = arg.slice("--base-url=".length)
      continue
    }

    if (arg === "--negotiation") {
      options.negotiation = argv[++index] ?? ""
      continue
    }

    if (arg.startsWith("--negotiation=")) {
      options.negotiation = arg.slice("--negotiation=".length)
      continue
    }

    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[++index])
      continue
    }

    if (arg.startsWith("--timeout-ms=")) {
      options.timeoutMs = Number(arg.slice("--timeout-ms=".length))
      continue
    }

    if (!options.baseUrl && !arg.startsWith("-")) {
      options.baseUrl = arg
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  assert.ok(options.baseUrl, "Missing base URL. Pass one positional URL or --base-url <url>.")
  assert.match(options.baseUrl, /^https?:\/\//i, "Base URL must start with http:// or https://.")
  assert.ok(
    ["auto", "required", "skip"].includes(options.negotiation),
    "--negotiation must be one of: auto, required, skip.",
  )
  assert.ok(
    Number.isFinite(options.timeoutMs) && options.timeoutMs > 0,
    "--timeout-ms must be a positive number.",
  )

  const url = new URL(options.baseUrl)
  url.pathname = url.pathname.replace(/\/+$/, "")
  url.search = ""
  url.hash = ""

  return { ...options, baseUrl: url.toString().replace(/\/+$/, "") }
}

function contentType(response) {
  return response.headers.get("content-type") ?? ""
}

function mediaType(response) {
  return contentType(response).split(";")[0].trim().toLowerCase()
}

function assertContentType(response, expected, label) {
  assert.equal(
    mediaType(response),
    expected,
    `${label} returned Content-Type "${contentType(response) || "(missing)"}"; expected "${expected}".`,
  )
}

function assertOk(response, label) {
  assert.ok(
    response.ok,
    `${label} returned HTTP ${response.status} ${response.statusText}; expected 2xx.`,
  )
}

function digestSha256(content) {
  return `${SKILL_DIGEST_ALGORITHM}=${createHash("sha256").update(content, "utf8").digest("hex")}`
}

function isLocalBaseUrl(baseUrl) {
  const host = new URL(baseUrl).hostname
  return host === "localhost" || host === "127.0.0.1" || host === "::1"
}

function pathFromHref(href, context) {
  assert.ok(typeof href === "string" && href.length > 0, `${context} is missing href.`)
  return new URL(href, "https://travelhood.es").pathname
}

function supportsVercelRewrites(response, baseUrl) {
  return (
    !isLocalBaseUrl(baseUrl) ||
    response.headers.has("x-vercel-id") ||
    /vercel/i.test(response.headers.get("server") ?? "")
  )
}

function splitUnquoted(value, separator) {
  const parts = []
  let current = ""
  let quoted = false
  let escaped = false

  for (const char of value) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }

    if (char === "\\" && quoted) {
      current += char
      escaped = true
      continue
    }

    if (char === '"') {
      quoted = !quoted
      current += char
      continue
    }

    if (char === separator && !quoted) {
      parts.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  if (current.trim()) {
    parts.push(current.trim())
  }

  return parts
}

function unquoteHeaderValue(value) {
  const trimmedValue = value.trim()

  if (!trimmedValue.startsWith('"') || !trimmedValue.endsWith('"')) {
    return trimmedValue
  }

  return trimmedValue.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
}

function parseLinkHeader(linkHeader) {
  return splitUnquoted(linkHeader, ",").map((entry) => {
    const match = /^<([^>]+)>\s*(?:;(.*))?$/.exec(entry)
    assert.ok(match, `Malformed Link header entry: ${entry}`)

    const params = {}

    for (const param of splitUnquoted(match[2] ?? "", ";")) {
      const equalsIndex = param.indexOf("=")
      assert.ok(equalsIndex > 0, `Malformed Link header parameter: ${param}`)
      const key = param.slice(0, equalsIndex).trim().toLowerCase()
      const value = param.slice(equalsIndex + 1)
      params[key] = unquoteHeaderValue(value)
    }

    return { href: match[1], params }
  })
}

function checkLinkHeader(linkHeader) {
  assert.ok(linkHeader, "/ response is missing Link header.")
  const entries = parseLinkHeader(linkHeader)

  for (const link of REQUIRED_LINKS) {
    const entry = entries.find((item) => item.href === link.path)
    assert.ok(entry, `/ Link header is missing resource ${link.path}.`)
    assert.ok(
      entry.params.rel?.split(/\s+/).includes(link.rel),
      `/ Link header is missing rel="${link.rel}" for ${link.path}.`,
    )
    assert.equal(
      entry.params.type,
      link.type,
      `/ Link header is missing type="${link.type}" for ${link.path}.`,
    )
  }

  for (const path of UNSUPPORTED_DISCOVERY_PATHS) {
    assert.ok(
      !entries.some((entry) => pathFromHref(entry.href, "/ Link header entry") === path),
      `/ Link header must not advertise unsupported discovery route ${path}.`,
    )
  }
}

function checkCatalog(catalog) {
  assert.ok(catalog && typeof catalog === "object", "API catalog JSON must be an object.")
  assert.ok(Array.isArray(catalog.linkset), 'API catalog JSON must contain a "linkset" array.')
  assert.ok(catalog.linkset.length > 0, "API catalog linkset must not be empty.")

  const items = catalog.linkset.flatMap((entry) => {
    assert.ok(entry && typeof entry === "object", "API catalog linkset entries must be objects.")
    assert.ok(Array.isArray(entry.item), 'API catalog linkset entry must contain an "item" array.')
    return entry.item
  })

  const catalogPaths = new Set(items.map((item) => pathFromHref(item.href, "API catalog item")))

  for (const path of REQUIRED_CATALOG_PATHS) {
    assert.ok(catalogPaths.has(path), `API catalog is missing item ${path}.`)
  }

  for (const path of UNSUPPORTED_DISCOVERY_PATHS) {
    assert.ok(!catalogPaths.has(path), `API catalog must not advertise unsupported route ${path}.`)
  }
}

function checkSkillsIndex(skillsIndex) {
  assert.ok(skillsIndex && typeof skillsIndex === "object", "Skills index JSON must be an object.")
  assert.ok(Array.isArray(skillsIndex.skills), 'Skills index JSON must contain a "skills" array.')
  assert.ok(skillsIndex.skills.length > 0, "Skills index must list at least one skill.")

  for (const skill of skillsIndex.skills) {
    assert.ok(skill && typeof skill === "object", "Skills index entries must be objects.")
    assert.ok(typeof skill.id === "string" && skill.id.length > 0, "Skill entry is missing id.")
    assert.ok(typeof skill.url === "string" && skill.url.length > 0, `Skill ${skill.id} is missing url.`)
    assert.equal(
      skill.digestAlgorithm,
      SKILL_DIGEST_ALGORITHM,
      `Skill ${skill.id} uses digestAlgorithm "${skill.digestAlgorithm}"; expected "${SKILL_DIGEST_ALGORITHM}".`,
    )
    assert.match(
      skill.digest,
      /^sha-256=[a-f0-9]{64}$/,
      `Skill ${skill.id} digest must match sha-256=<64 lowercase hex chars>.`,
    )
  }
}

async function fetchText(baseUrl, path, options) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs)
  const headers = new Headers(options.headers)

  if (!headers.has("accept")) {
    headers.set("Accept", "*/*")
  }

  if (!headers.has("user-agent")) {
    headers.set("User-Agent", "TravelHoodAgentVisibilityCheck/1.0 (+https://travelhood.es)")
  }

  try {
    const response = await fetch(new URL(path, `${baseUrl}/`), {
      headers,
      redirect: "follow",
      signal: controller.signal,
    })
    const body = await response.text()
    return { response, body }
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`${path} timed out after ${options.timeoutMs}ms.`)
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function runCheck(name, fn) {
  try {
    await fn()
    checks.push(name)
    console.log(`OK ${name}`)
  } catch (error) {
    failures.push({ name, error })
    console.error(`FAIL ${name}: ${error.message}`)
  }
}

const options = parseArgs(process.argv.slice(2))

console.log(`Checking agent visibility at ${options.baseUrl}`)

let directHomeMarkdown = ""

await runCheck("home Link header", async () => {
  const { response } = await fetchText(options.baseUrl, "/", options)
  assertOk(response, "/")
  const linkHeader = response.headers.get("link")

  if (!linkHeader && isLocalBaseUrl(options.baseUrl)) {
    warnings.push(
      "Local Astro preview does not apply Vercel header rules; run against a Vercel/production URL for strict Link header validation.",
    )
    return
  }

  checkLinkHeader(linkHeader)
})

await runCheck("robots Content-Signal", async () => {
  const { response, body } = await fetchText(options.baseUrl, "/robots.txt", options)
  assertOk(response, "/robots.txt")
  assertContentType(response, "text/plain", "/robots.txt")
  assert.match(
    body,
    /^Content-Signal:\s*ai-train=no,\s*search=yes,\s*ai-input=yes$/m,
    "/robots.txt is missing the expected Content-Signal directive.",
  )
})

await runCheck("api catalog JSON linkset", async () => {
  let { response, body } = await fetchText(options.baseUrl, "/.well-known/api-catalog", options)
  let usedLocalFallback = false

  if (response.status === 404 && isLocalBaseUrl(options.baseUrl)) {
    warnings.push(
      "Local Astro preview does not apply the Vercel /.well-known/api-catalog rewrite; validated /.well-known/api-catalog/ instead.",
    )
    const fallbackResult = await fetchText(options.baseUrl, "/.well-known/api-catalog/", options)
    response = fallbackResult.response
    body = fallbackResult.body
    usedLocalFallback = true
  }

  assertOk(response, "/.well-known/api-catalog")
  if (usedLocalFallback && !mediaType(response)) {
    warnings.push(
      "Local Astro preview returned an empty Content-Type for the extensionless API catalog fallback; Vercel/production URLs are still checked strictly.",
    )
  } else {
    assertContentType(response, "application/linkset+json", "/.well-known/api-catalog")
  }
  checkCatalog(JSON.parse(body))
})

await runCheck("unsupported standard discovery routes absent", async () => {
  for (const path of UNSUPPORTED_DISCOVERY_PATHS) {
    const { response } = await fetchText(options.baseUrl, path, options)
    assert.ok(
      !response.ok,
      `${path} returned HTTP ${response.status}; unsupported OAuth/MCP discovery routes must not publish metadata.`,
    )
  }
})

await runCheck("agent skills index", async () => {
  const { response, body } = await fetchText(
    options.baseUrl,
    "/.well-known/agent-skills/index.json",
    options,
  )
  assertOk(response, "/.well-known/agent-skills/index.json")
  assertContentType(response, "application/json", "/.well-known/agent-skills/index.json")
  const skillsIndex = JSON.parse(body)
  checkSkillsIndex(skillsIndex)

  for (const skill of skillsIndex.skills) {
    const skillPath = pathFromHref(skill.url, `Skill ${skill.id} url`)
    const skillResult = await fetchText(options.baseUrl, skillPath, options)
    assertOk(skillResult.response, skillPath)
    assertContentType(skillResult.response, "text/markdown", skillPath)
    assert.match(skillResult.body, /^#\s+/m, `Skill ${skill.id} Markdown must start with a heading.`)
    assert.equal(
      digestSha256(skillResult.body),
      skill.digest,
      `Skill ${skill.id} digest is stale for ${skillPath}.`,
    )
  }
})

await runCheck("direct home Markdown", async () => {
  const { response, body } = await fetchText(
    options.baseUrl,
    "/.well-known/travelhood-home.md",
    options,
  )
  assertOk(response, "/.well-known/travelhood-home.md")
  assertContentType(response, "text/markdown", "/.well-known/travelhood-home.md")
  assert.match(body, /^#\s+Travel Hood/m, "Home Markdown must start with the Travel Hood heading.")
  assert.match(
    body,
    /^##\s+Informacion para agentes$/m,
    "Home Markdown is missing the agent information section.",
  )
  directHomeMarkdown = body
})

await runCheck("home Markdown negotiation", async () => {
  if (options.negotiation === "skip") {
    warnings.push("Skipped Markdown negotiation by request.")
    return
  }

  const { response, body } = await fetchText(options.baseUrl, "/", {
    ...options,
    headers: { Accept: "text/markdown" },
  })

  if (!response.ok && options.negotiation === "auto" && !supportsVercelRewrites(response, options.baseUrl)) {
    warnings.push(
      "Skipped strict Markdown negotiation because this does not look like a Vercel rewrite-capable response.",
    )
    return
  }

  assertOk(response, "/ with Accept: text/markdown")

  const gotMarkdown = mediaType(response) === "text/markdown"

  if (!gotMarkdown && options.negotiation === "auto" && !supportsVercelRewrites(response, options.baseUrl)) {
    warnings.push(
      "Skipped strict Markdown negotiation because this does not look like a Vercel rewrite-capable response.",
    )
    return
  }

  assertContentType(response, "text/markdown", "/ with Accept: text/markdown")
  assert.match(body, /^#\s+Travel Hood/m, "Negotiated Markdown must start with the Travel Hood heading.")

  if (directHomeMarkdown) {
    assert.equal(
      body,
      directHomeMarkdown,
      "Negotiated Markdown body differs from /.well-known/travelhood-home.md.",
    )
  }
})

for (const warning of warnings) {
  console.warn(`WARN ${warning}`)
}

if (failures.length > 0) {
  console.error(`\n${failures.length} visibility check(s) failed.`)
  process.exit(1)
}

console.log(`\n${checks.length} visibility checks passed.`)
