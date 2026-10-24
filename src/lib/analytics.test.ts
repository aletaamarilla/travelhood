import assert from 'node:assert/strict'
import { EVENT_FIELDS, trackEvent } from './analytics'
import { getStoredConsent, saveConsent } from './consent'
import { pushSearchEvent } from './search-tracking'

const dataLayer: unknown[] = []
const browser = { dataLayer, dispatchEvent: () => true, __thGoogleConsent: { phase1Ready: true } }
const doc = { cookie: '', referrer: 'https://example.org/private?email=person@example.org', querySelector: () => ({ href: 'https://travelhood.es/viajes-privados/?email=person@example.org#token' }) }
Object.defineProperty(globalThis, 'window', { configurable: true, value: browser })
Object.defineProperty(globalThis, 'document', { configurable: true, value: doc })
Object.defineProperty(globalThis, 'location', { configurable: true, value: { hostname: 'localhost', protocol: 'http:' } })
const set = (analytics: boolean, marketing: boolean) => { doc.cookie = 'th_cookie_consent=' + encodeURIComponent(JSON.stringify({ necessary: true, analytics, marketing })) }
for (const cookie of ['', 'th_cookie_consent=null', 'th_cookie_consent=invalid', 'th_cookie_consent=%E0%A4', 'th_cookie_consent=' + encodeURIComponent('{"analytics":"true","marketing":true}'), 'th_cookie_consent=' + encodeURIComponent('{"analytics":true}')]) {
  doc.cookie = cookie
  assert.equal(getStoredConsent(), null)
  assert.equal(trackEvent('destination_view', { destination_slug: 'japon' }), false)
}
for (const [analytics, marketing] of [[false, false], [false, true], [true, false], [true, true]]) {
  set(analytics, marketing)
  assert.equal(trackEvent('destination_view', { destination_slug: 'japon' }), analytics)
}
assert.equal(dataLayer.length, 2)
set(true, false)
assert.equal(pushSearchEvent('home_search_submitted', { source: 'home_hero', resolved_href: '/viajes/?email=person@example.org', destination_slug: 'japon' }), true)
assert.equal(trackEvent('private_trip_whatsapp_click', { page: 'viajes_privados', context: 'private_trip', cta: 'hero', has_utm: true, utm_campaign: 'person@example.org', message: 'private message', phone: '666123456', email: 'person@example.org' }), true)
assert.equal(trackEvent('destination_pdf_download', { destination_slug: 'japon', pdf_url: 'https://cdn.sanity.io/files/project/production/itinerary.pdf?token=secret' }), true)
assert.equal(trackEvent('destination_pdf_download', { destination_slug: 'japon', pdf_url: 'https://evil.example/path.pdf' }), true)
assert.equal(trackEvent('not_allowed' as keyof typeof EVENT_FIELDS), false)
for (const item of dataLayer as { th_event: { parameters: Record<string, unknown> } }[]) {
  const payload = JSON.stringify(item)
  assert.ok(!payload.includes('person@example.org') && !payload.includes('secret') && !payload.includes('private message') && !payload.includes('666123456'), payload)
  assert.equal(item.th_event.parameters.traffic_type, 'developer')
  assert.equal(item.th_event.parameters.debug_mode, true)
  assert.equal(item.th_event.parameters.page_referrer, 'https://example.org')
  assert.equal(item.th_event.parameters.page_location, 'https://travelhood.es/viajes-privados/')
}
const pdf = dataLayer.at(-2) as { pdf_url: string }
assert.equal(pdf.pdf_url, 'https://cdn.sanity.io/files/project/production/itinerary.pdf')
assert.ok(!('pdf_url' in (dataLayer.at(-1) as object)))
const original = browser.dataLayer
browser.dataLayer = { push: () => { throw Error('Blocked tracker') } } as unknown as unknown[]
assert.equal(trackEvent('destination_view', { destination_slug: 'japon' }), false)
browser.dataLayer = original
// Gate off preserves the legacy event and explicitly clears any prior envelope.
set(true, false)
browser.__thGoogleConsent.phase1Ready = false
assert.equal(trackEvent('th_page_view'), false)
assert.equal(trackEvent('destination_view', { destination_slug: 'japon' }), true)
assert.equal((dataLayer.at(-1) as { th_event: null }).th_event, null)
browser.__thGoogleConsent.phase1Ready = true
set(false, false)
const count = dataLayer.length
assert.equal(trackEvent('destination_whatsapp_click', { destination_slug: 'japon' }), false)
assert.equal(dataLayer.length, count)
// A denied choice takes effect in memory even if cookie writes are blocked.
Object.defineProperty(doc, 'cookie', { configurable: true, get: () => '', set: () => { throw Error('Storage disabled') } })
if (typeof CustomEvent === 'undefined') Object.defineProperty(globalThis, 'CustomEvent', { configurable: true, value: class { constructor(public type: string, public options: unknown) {} } })
assert.doesNotThrow(() => saveConsent({ necessary: true, analytics: false, marketing: false }))
assert.equal(trackEvent('destination_view', { destination_slug: 'japon' }), false)
for (const key of ['window', 'document', 'location']) Reflect.deleteProperty(globalThis, key)
console.log('Analytics: consent matrix, withdrawal, contract, PII minimization, isolation and fail-open navigation passed.')
