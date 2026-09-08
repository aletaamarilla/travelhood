import assert from 'node:assert/strict'
import { defaultCollaboratorsContent, isCollaboratorAssetUrl } from '../../shared/collaborators'
import { resolveCollaboratorsContent } from './collaborators'
import { trackCollaboratorClick } from './collaborator-tracking'

const noImage = () => ''
const defaults = structuredClone(defaultCollaboratorsContent)
const iati = defaults.collaborators[0]
const camper = defaults.collaborators[1]

// CMS removals and visibility settings must never resurrect fallback promotions.
assert.equal(resolveCollaboratorsContent(null, noImage).collaborators.length, 2)
assert.deepEqual(resolveCollaboratorsContent({ collaborators: [] }, noImage).collaborators, [])
assert.deepEqual(resolveCollaboratorsContent({
  collaborators: [{ ...iati, isVisible: false }, camper],
}, noImage).collaborators.map((partner) => partner.slug), ['nomadcamper'])
assert.equal(resolveCollaboratorsContent({
  collaborators: [{ ...iati, benefit: '' }],
}, noImage).collaborators[0].benefit, '')

// Preserve the affiliate query exactly, plus the CMS ordering and image overrides.
const ordered = resolveCollaboratorsContent({ collaborators: [camper, iati] }, noImage)
assert.deepEqual(ordered.collaborators.map((partner) => partner.slug), ['nomadcamper', 'iati'])
assert.equal(ordered.collaborators[1].url, 'https://www.iatiseguros.com/?r=97872091556250')
assert.equal(resolveCollaboratorsContent({
  collaborators: [{ ...camper, logo: 'upload' }],
}, (image) => image ? 'https://cdn.sanity.io/logo.svg' : '').collaborators[0].logoUrl, 'https://cdn.sanity.io/logo.svg')

// Invalid external destinations, duplicate anchors, and unsafe images are suppressed.
for (const url of ['javascript:alert(1)', 'http://example.com', '//example.com', 'https://user:pass@example.com']) {
  assert.deepEqual(resolveCollaboratorsContent({ collaborators: [{ ...iati, url }] }, noImage).collaborators, [])
}
assert.equal(resolveCollaboratorsContent({ collaborators: [iati, iati] }, noImage).collaborators.length, 1)
assert.equal(resolveCollaboratorsContent({
  collaborators: [{ ...camper, imageAlt: '' }],
}, noImage).collaborators[0].imageUrl, '')
assert.equal(isCollaboratorAssetUrl('//example.com/logo.svg'), false)
assert.equal(isCollaboratorAssetUrl('/\\example.com/logo.svg'), false)

// No analytics event before consent, after refusal, or with a malformed cookie.
const browser = { dataLayer: [] as unknown[] }
const doc = { cookie: '' }
Object.defineProperty(globalThis, 'window', { configurable: true, value: browser })
Object.defineProperty(globalThis, 'document', { configurable: true, value: doc })
const payload = { partner_id: 'iati', source: 'collaborators_page', link_type: 'outbound' } as const
for (const cookie of ['', 'th_cookie_consent=invalid', 'th_cookie_consent=null', 'th_cookie_consent=%7B%22analytics%22%3Afalse%7D']) {
  doc.cookie = cookie
  assert.equal(trackCollaboratorClick(payload), false)
}
assert.deepEqual(browser.dataLayer, [])
doc.cookie = 'th_cookie_consent=%7B%22analytics%22%3Atrue%7D'
assert.equal(trackCollaboratorClick(payload), true)
assert.deepEqual(browser.dataLayer, [{ event: 'collaborator_click', ...payload }])
doc.cookie = 'th_cookie_consent=%7B%22analytics%22%3Afalse%7D'
assert.equal(trackCollaboratorClick(payload), false)
assert.equal(browser.dataLayer.length, 1)
Reflect.deleteProperty(globalThis, 'window')
Reflect.deleteProperty(globalThis, 'document')
console.log('Collaborators: content, affiliate links and consent checks passed.')
