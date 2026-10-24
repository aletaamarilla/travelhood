import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { EVENT_FIELDS } from '@/lib/analytics'

interface Parameter {
  type: string
  key?: string
  value?: string
  list?: Parameter[]
  map?: Parameter[]
}
interface Entity {
  accountId?: string
  containerId?: string
  name: string
  [key: string]: unknown
}
export interface ContainerExport {
  exportFormatVersion: number
  containerVersion: {
    accountId: string
    containerId: string
    containerVersionId: string
    container: { publicId: string }
    tag: Entity[]
    variable?: Entity[]
    trigger?: Entity[]
    folder?: Entity[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export const COMMON_FIELDS = ['measurement_version', 'page_location', 'page_referrer', 'traffic_type', 'debug_mode']
export const PARAMETER_FIELDS = [...new Set([...Object.values(EVENT_FIELDS).flat(), ...COMMON_FIELDS])].sort()
const GA_ID = 'G-XQMPJG8B08'
const PREFIX = 'TH Phase 1 - '
const ENVELOPE = PREFIX + 'envelope'
const EVENT_NAME = PREFIX + 'event name'
const ALLOWED = PREFIX + 'allowed'
const paramName = (field: string) => PREFIX + field
const variableRef = (name: string) => `{{${name}}}`
const template = (key: string, value: string): Parameter => ({ type: 'TEMPLATE', key, value })
const table = (key: string, rows: Record<string, string>): Parameter => ({
  type: 'LIST', key,
  list: Object.entries(rows).map(([parameter, parameterValue]) => ({ type: 'MAP', map: [template('parameter', parameter), template('parameterValue', parameterValue)] })),
})
const consentSettings = () => ({ consentStatus: 'NEEDED', consentType: { type: 'LIST', list: [{ type: 'TEMPLATE', value: 'analytics_storage' }] } })
const nextId = (entities: Entity[], key: string) => String(Math.max(1000, ...entities.map((item) => Number(item[key]) || 0)) + 1)

export function prepareGtm(source: ContainerExport): ContainerExport {
  assert.equal(source.exportFormatVersion, 2, 'Expected GTM export format 2')
  assert.equal(source.containerVersion.container.publicId, 'GTM-TB7F773D', 'Wrong tenant/container; refusing to modify')
  const result = structuredClone(source)
  const cv = result.containerVersion
  const google = cv.tag.find((tag) => tag.tagId === '5' && tag.type === 'googtag')
  const meta = cv.tag.find((tag) => tag.tagId === '3' && tag.type === 'html')
  assert.ok(google && meta, 'Expected existing Google and Meta tags; review changed source before proceeding')
  assert.equal((google.parameter as Parameter[]).find((p) => p.key === 'tagId')?.value, GA_ID, 'Official measurement ID differs')
  // Extra tags/variables/triggers might introduce duplicate or unconsented collection.
  // Preserve them in the original; require review instead of silently dropping them.
  assert.equal(cv.tag.length, 2, 'Additional tags require explicit compatibility/privacy review')
  assert.ok(!(cv.variable?.length || cv.trigger?.length || cv.folder?.length), 'Source contains additional entities; reconcile before generating')
  assert.ok(cv.tag.every((tag) => !tag.name.startsWith(PREFIX)), 'Already prepared export')
  const identity = { accountId: cv.accountId, containerId: cv.containerId }
  const folderId = nextId(cv.folder || [], 'folderId')
  cv.folder = [{ ...identity, folderId, name: PREFIX + 'measurement' }]
  cv.variable = []
  const variable = (name: string, type: string, parameter: Parameter[]) => {
    cv.variable!.push({ ...identity, variableId: nextId(cv.variable!, 'variableId'), name, type, parameter, parentFolderId: folderId })
  }
  variable(ENVELOPE, 'v', [template('name', 'th_event'), { type: 'INTEGER', key: 'dataLayerVersion', value: '1' }, { type: 'BOOLEAN', key: 'setDefaultValue', value: 'false' }])
  variable(EVENT_NAME, 'jsm', [template('javascript', `function(){var e=${variableRef(ENVELOPE)};return e&&e.name;}`)])
  for (const field of PARAMETER_FIELDS) {
    // GTM TEMPLATE values coerce true to the string 'true'. GA4's native debug
    // signal is normalized to numeric 1 (or absent) for consistent serialization.
    // The earlier string 'true' also reached DebugView, with delayed observation.
    const value = field === 'debug_mode' ? `(e.parameters.debug_mode===true?1:undefined)` : `e.parameters[${JSON.stringify(field)}]`
    variable(paramName(field), 'jsm', [template('javascript', `function(){var e=${variableRef(ENVELOPE)};return e&&e.parameters?${value}:undefined;}`)])
  }
  // Read consent at tag evaluation as well as using GTM's built-in consent checks.
  // Guard is fail-closed for malformed cookies, failed persistence and stale envelopes.
  variable(ALLOWED, 'jsm', [template('javascript', `function(){try{var e=${variableRef(ENVELOPE)},n={{Event}},expected=n==='th_page_view'?'page_view':n;if(!e||e.name!==expected||!e.parameters||e.parameters.measurement_version!=='1')return false;if(window['ga-disable-${GA_ID}']===true)return false;try{if(localStorage.getItem('th_consent_storage_blocked')==='1')return false;}catch(ignore){}var m=document.cookie.match(/(?:^|; )th_cookie_consent=([^;]*)/);if(!m)return false;var c=JSON.parse(decodeURIComponent(m[1]));return !!c&&c.analytics===true&&typeof c.marketing==='boolean';}catch(ignore){return false;}}`)])
  const triggerId = nextId(cv.trigger || [], 'triggerId')
  const expression = '^(' + Object.keys(EVENT_FIELDS).join('|') + ')$'
  cv.trigger = [{
    ...identity, triggerId, name: PREFIX + 'owned events', type: 'CUSTOM_EVENT', parentFolderId: folderId,
    customEventFilter: [{ type: 'MATCH_REGEX', parameter: [template('arg0', '{{_event}}'), template('arg1', expression)] }],
    filter: [{ type: 'EQUALS', parameter: [template('arg0', variableRef(ALLOWED)), template('arg1', 'true')] }],
  }]
  // Partial import: Meta is managed separately. Omit it so COMBINE cannot
  // overwrite its current settings, even if they changed after this export.
  // Never import this candidate using the full-container REPLACE option.
  cv.tag = [google]
  google.parameter = [template('tagId', GA_ID), table('configSettingsTable', {
    send_page_view: 'false', allow_google_signals: 'false', allow_ad_personalization_signals: 'false',
    page_location: variableRef(paramName('page_location')), page_referrer: variableRef(paramName('page_referrer')),
    debug_mode: variableRef(paramName('debug_mode')),
  })]
  // Do not use Google Tag as an asynchronous setupTag of a dynamic event.
  // Native Preview resolved two startup events against the last envelope.
  // Start config first in the same event; the Google command queue preserves order.
  google.firingTriggerId = [triggerId]
  google.priority = { type: 'INTEGER', value: '100' }
  google.tagFiringOption = 'ONCE_PER_LOAD'
  google.consentSettings = consentSettings()
  delete google.fingerprint
  const tagId = String(Math.max(...cv.tag.map((tag) => Number(tag.tagId))) + 1)
  cv.tag.push({
    ...identity, tagId, name: PREFIX + 'GA4 events', type: 'gaawe', parentFolderId: folderId,
    parameter: [
      template('measurementIdOverride', GA_ID), template('eventName', variableRef(EVENT_NAME)),
      { type: 'BOOLEAN', key: 'migratedToV2', value: 'true' },
      { type: 'BOOLEAN', key: 'sendEcommerceData', value: 'false' },
      table('eventSettingsTable', Object.fromEntries(PARAMETER_FIELDS.map((field) => [field, variableRef(paramName(field))]))),
    ],
    firingTriggerId: [triggerId], tagFiringOption: 'ONCE_PER_EVENT',
    consentSettings: consentSettings(),
  })
  delete cv.fingerprint
  return result
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = new URL('../docs/analytics/gtm/source-export.json', import.meta.url)
  const output = new URL('../docs/analytics/gtm/travelhood-phase-1.import.json', import.meta.url)
  const candidate = prepareGtm(JSON.parse(readFileSync(input, 'utf8')))
  if (process.argv.includes('--check')) {
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), candidate)
    console.log('GTM candidate reproducible from original export and event contract. GTM UI import/compile and GA4 receipt remain unverified.')
  } else writeFileSync(output, JSON.stringify(candidate, null, 2) + '\n')
}
