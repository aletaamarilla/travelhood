import assert from 'node:assert/strict'
import {readFileSync, readdirSync, statSync} from 'node:fs'
import {resolve, relative} from 'node:path'

const root = resolve(process.argv[2] || 'dist')
const files = (directory) => readdirSync(directory).flatMap((name) => {
  const path = resolve(directory, name)
  return statSync(path).isDirectory() ? files(path) : [path]
})
const decode = (value) => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
let pages = 0
let jsonLdBlocks = 0
let publicTrips = 0
const errors = []
const check = (condition, message) => { if (!condition) errors.push(message) }

for (const file of files(root).filter((path) => /\.(html|json|md|txt)$/.test(path))) {
  const body = readFileSync(file, 'utf8')
  const label = relative(root, file)
  check(!/flightEstimate|vuelo(?:s)? estimad[oa]s?|\+\s*vuelo\s*[~\d]/i.test(body), `${label}: flight estimate`)
  if (!file.endsWith('.html')) continue
  pages++
  const events = []
  const statuses = new Map()
  for (const match of body.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1])
      jsonLdBlocks++
      if (schema['@type'] === 'Event') events.push(schema)
    } catch { errors.push(`${label}: invalid JSON-LD`) }
  }
  const inspect = (value) => {
    if (!value || typeof value !== 'object') return
    if (value.status?.[0] === 0 && typeof value.status?.[1] === 'string') {
      publicTrips++
      statuses.set(value.title?.[1], value.status[1])
      check(value.status[1] === 'almost-full' || !Object.hasOwn(value, 'placesLeft'), `${label}: private remaining count in ${value.status[1]} trip props`)
    }
    Object.values(value).forEach(inspect)
  }
  for (const match of body.matchAll(/<astro-island\b[^>]*\bprops="([^"]*)"/g)) {
    try { inspect(JSON.parse(decode(match[1]))) }
    catch { errors.push(`${label}: invalid island props`) }
  }
  for (const event of events) {
    if (statuses.get(event.name) !== 'almost-full') {
      check(!Object.hasOwn(event, 'remainingAttendeeCapacity'), `${label}: remaining count in Event`)
    }
    check(!event.offers?.validFrom || event.offers.validFrom !== event.startDate, `${label}: offer only valid from departure`)
  }
}

const dates = ['2027-06-21', '2027-06-28', '2027-08-30', '2027-09-06']
for (const route of ['destino/dolomitas', 'presupuesto/dolomitas', 'cuando-viajar-a/dolomitas', 'pais/italia']) {
  const body = readFileSync(resolve(root, route, 'index.html'), 'utf8')
  check((body.match(/<h1\b/g) || []).length === 1, `${route}: expected one H1`)
  check(/<title>[^<]+<\/title>/.test(body), `${route}: missing title`)
  check(/<meta\b[^>]*name="description"[^>]*content="[^"]+"/.test(body), `${route}: missing description`)
  check(body.includes(`href="https://travelhood.es/${route}/"`), `${route}: missing canonical URL`)
  check(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(body), `${route}: noindex`)
  if (route === 'destino/dolomitas') {
    const events = [...body.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1])).filter((s) => s['@type'] === 'Event')
    check(events.length === 4, 'Dolomitas: expected four Events')
    check(JSON.stringify(events.map((event) => event.startDate).sort()) === JSON.stringify(dates), 'Dolomitas: incorrect dates')
    for (const event of events) {
      check(event.offers.price === 1000 && event.offers.priceCurrency === 'EUR', 'Dolomitas: incorrect price')
      check(event.duration === 'P7D', 'Dolomitas: incorrect duration')
    }
    check(body.includes('.pdf'), 'Dolomitas: missing PDF')
  }
}
const catalog = JSON.parse(readFileSync(resolve(root, 'webmcp-data.json'), 'utf8'))
const dolomitas = catalog.travel.destinations.find((destination) => destination.slug === 'dolomitas')
check(dolomitas?.publicFacts.priceFromExcludingInternationalFlights === 1000, 'WebMCP Dolomitas: incorrect price')
check(dolomitas?.publicFacts.durationDays === 7, 'WebMCP Dolomitas: incorrect duration')
const sitemap = readFileSync(resolve(root, 'sitemap-0.xml'), 'utf8')
check(sitemap.includes('https://travelhood.es/destino/dolomitas/'), 'Dolomitas missing from sitemap')
const report = {checkedAt: new Date().toISOString(), root, pages, jsonLdBlocks, publicTrips, errors}
console.log(JSON.stringify(report, null, 2))
assert.equal(errors.length, 0, 'Public catalog verification failed')
