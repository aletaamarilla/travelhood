#!/usr/bin/env node

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const requiredAssets = [
  {
    relativePath: "public/favicon.ico",
    check: checkIco,
  },
  {
    relativePath: "public/favicon-48x48.png",
    check: (buffer) => checkPng(buffer, { square: true, width: 48, height: 48 }),
  },
  {
    relativePath: "public/icon.svg",
    check: checkSvg,
  },
  {
    relativePath: "public/apple-icon.png",
    check: (buffer) => checkPng(buffer, { square: true, width: 180, height: 180 }),
  },
]

const expectedLayoutLinks = [
  {
    description: "ICO favicon link",
    attrs: {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "32x32",
    },
  },
  {
    description: "48x48 PNG favicon link",
    attrs: {
      rel: "icon",
      type: "image/png",
      sizes: "48x48",
      href: "/favicon-48x48.png",
    },
  },
  {
    description: "SVG favicon link",
    attrs: {
      rel: "icon",
      type: "image/svg+xml",
      href: "/icon.svg",
      sizes: "any",
    },
  },
  {
    description: "Apple touch icon link",
    attrs: {
      rel: "apple-touch-icon",
      href: "/apple-icon.png",
    },
  },
]

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const failures = []

function fail(message) {
  failures.push(message)
}

async function readRequiredFile(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath)

  try {
    const buffer = await readFile(absolutePath)

    if (buffer.length === 0) {
      fail(`${relativePath} exists but is empty`)
    }

    return buffer
  } catch (error) {
    if (error?.code === "ENOENT") {
      fail(`${relativePath} is missing`)
      return null
    }

    throw error
  }
}

function checkIco(buffer) {
  if (buffer.length < 6) {
    fail("ICO file is too small to be valid")
    return
  }

  const reserved = buffer.readUInt16LE(0)
  const type = buffer.readUInt16LE(2)
  const imageCount = buffer.readUInt16LE(4)

  if (reserved !== 0 || type !== 1 || imageCount < 1) {
    fail("ICO header is invalid")
  }
}

function checkPng(buffer, expected) {
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature)) {
    fail("PNG asset has an invalid PNG signature")
    return
  }

  const chunkType = buffer.toString("ascii", 12, 16)

  if (chunkType !== "IHDR") {
    fail("PNG asset does not start with an IHDR chunk")
    return
  }

  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)

  if (expected.square && width !== height) {
    fail(`PNG asset must be square, got ${width}x${height}`)
  }

  if (expected.width && width !== expected.width) {
    fail(`PNG asset width must be ${expected.width}px, got ${width}px`)
  }

  if (expected.height && height !== expected.height) {
    fail(`PNG asset height must be ${expected.height}px, got ${height}px`)
  }
}

function checkSvg(buffer) {
  const svg = buffer.toString("utf8")

  if (!/<svg\b/i.test(svg)) {
    fail("SVG root is missing")
    return
  }

  if (hasSquareViewBox(svg) || hasSquareCanvas(svg)) {
    return
  }

  fail("SVG must define a square viewBox or square width/height canvas")
}

function hasSquareViewBox(svg) {
  const viewBoxMatch = svg.match(/\bviewBox=["']([^"']+)["']/i)

  if (!viewBoxMatch) {
    return false
  }

  const values = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number)

  return values.length === 4 && values.every(Number.isFinite) && values[2] > 0 && values[2] === values[3]
}

function hasSquareCanvas(svg) {
  const width = readSvgLength(svg, "width")
  const height = readSvgLength(svg, "height")

  return width !== null && height !== null && width > 0 && width === height
}

function readSvgLength(svg, attr) {
  const match = svg.match(new RegExp(`\\b${attr}=["']([0-9.]+)(?:px)?["']`, "i"))

  if (!match) {
    return null
  }

  const value = Number(match[1])

  return Number.isFinite(value) ? value : null
}

function parseLinkTags(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? []

  return linkTags.map((tag) => {
    const attrs = {}
    const attrMatches = tag.matchAll(/\b([:@\w-]+)=["']([^"']+)["']/g)

    for (const match of attrMatches) {
      attrs[match[1]] = match[2]
    }

    return attrs
  })
}

function checkLayoutLinks(layoutSource) {
  const links = parseLinkTags(layoutSource)

  for (const expectedLink of expectedLayoutLinks) {
    const found = links.some((link) => hasExpectedAttrs(link, expectedLink.attrs))

    if (!found) {
      fail(`src/layouts/Layout.astro is missing the expected ${expectedLink.description}`)
    }
  }
}

function hasExpectedAttrs(link, expectedAttrs) {
  return Object.entries(expectedAttrs).every(([key, value]) => link[key] === value)
}

for (const asset of requiredAssets) {
  const buffer = await readRequiredFile(asset.relativePath)

  if (buffer) {
    const failureCount = failures.length
    asset.check(buffer)

    if (failures.length > failureCount) {
      const assetFailures = failures.splice(failureCount)
      failures.push(...assetFailures.map((failure) => `${asset.relativePath}: ${failure}`))
    }
  }
}

const layoutSource = await readRequiredFile("src/layouts/Layout.astro")

if (layoutSource) {
  checkLayoutLinks(layoutSource.toString("utf8"))
}

if (failures.length > 0) {
  console.error("Favicon check failed:")

  for (const failure of failures) {
    console.error(`- ${failure}`)
  }

  process.exit(1)
}

console.log("Favicon check passed: assets and Layout.astro references are valid.")
