import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { EVENT_FIELDS } from '@/lib/analytics'
import { PARAMETER_FIELDS, prepareGtm, type ContainerExport } from './prepare-analytics-gtm'

type Param = { type: string; key?: string; value?: string; list?: Param[]; map?: Param[] }
const source = JSON.parse(readFileSync(new URL('../docs/analytics/gtm/source-export.json', import.meta.url), 'utf8')) as ContainerExport
const before = JSON.stringify(source)
const candidate = prepareGtm(source)
assert.equal(JSON.stringify(source), before, 'Original export must remain untouched')
assert.deepEqual(prepareGtm(source), candidate, 'Generation must be deterministic')
const cv = candidate.containerVersion
const originalCv = source.containerVersion
assert.deepEqual(cv.container, originalCv.container)
assert.deepEqual(cv.builtInVariable, originalCv.builtInVariable)
assert.equal(cv.tag.length, 2)
assert.equal(cv.variable?.length, PARAMETER_FIELDS.length + 3)
assert.equal(cv.trigger?.length, 1)
assert.equal(cv.folder?.length, 1)
assert.ok(PARAMETER_FIELDS.length <= 25, 'GA4 parameter count budget')
assert.ok(originalCv.tag.some((tag) => tag.tagId === '3'), 'Meta remains in the original export')
assert.ok(!cv.tag.some((tag) => tag.tagId === '3' || tag.name === 'Pixel meta'), 'Partial import must contain no Meta change')
assert.ok(!JSON.stringify(candidate).includes('fbq(') && !JSON.stringify(candidate).includes('connect.facebook.net'))
const google = cv.tag.find((tag) => tag.tagId === '5')!
assert.equal(google.name, originalCv.tag.find((tag) => tag.tagId === '5')?.name)
assert.equal(google.tagFiringOption, 'ONCE_PER_LOAD')
assert.deepEqual(google.firingTriggerId, [cv.trigger![0].triggerId])
assert.deepEqual(google.priority, { type: 'INTEGER', value: '100' })
const eventTag = cv.tag.find((tag) => tag.type === 'gaawe')!
assert.equal(eventTag.setupTag, undefined, 'Dynamic envelope tags must not defer evaluation behind async setup')
for (const tag of [google, eventTag]) assert.deepEqual(tag.consentSettings, { consentStatus: 'NEEDED', consentType: { type: 'LIST', list: [{ type: 'TEMPLATE', value: 'analytics_storage' }] } })
const trigger = cv.trigger![0]
assert.deepEqual(eventTag.firingTriggerId, [trigger.triggerId])
const pattern = ((trigger.customEventFilter as { parameter: Param[] }[])[0].parameter.find((p) => p.key === 'arg1')!).value!
const regex = new RegExp(pattern)
assert.ok(Object.keys(EVENT_FIELDS).every((name) => regex.test(name)))
for (const event of ['purchase', 'generate_lead', 'gtm.js', 'gtm.init', 'x_destination_view', 'destination_view_extra']) assert.equal(regex.test(event), false)

// Evaluate the ACTUAL generated Custom JS and variables in an isolated VM.
// Native Google tags are not executed: this checks mapping/guards, not GA4 receipt.
function variables(envelope: unknown, event: string, cookie: string, disabled = false, storageBlocked = false) {
  const cache = new Map<string, unknown>([['Event', event]])
  const get = (name: string): unknown => {
    if (cache.has(name)) return cache.get(name)
    const variable = cv.variable!.find((item) => item.name === name)
    assert.ok(variable, `Missing variable ${name}`)
    const parameters = variable.parameter as Param[]
    let value: unknown
    if (variable.type === 'v') {
      assert.equal(parameters.find((p) => p.key === 'dataLayerVersion')?.value, '1')
      assert.equal(parameters.find((p) => p.key === 'name')?.value, 'th_event')
      value = envelope
    } else {
      const refs: unknown[] = []
      const javascript = parameters.find((p) => p.key === 'javascript')!.value!.replace(/\{\{([^}]+)\}\}/g, (_, ref) => {
        const index = refs.push(get(ref)) - 1
        return `__refs[${index}]`
      })
      value = vm.runInNewContext(`(${javascript})()`, {
        __refs: refs, window: { 'ga-disable-G-XQMPJG8B08': disabled }, document: { cookie },
        localStorage: { getItem: () => storageBlocked ? '1' : null },
      })
    }
    cache.set(name, value)
    return value
  }
  return get
}
const cookie = (analytics: boolean, marketing: boolean) => 'th_cookie_consent=' + encodeURIComponent(JSON.stringify({ necessary: true, analytics, marketing }))
const params = { measurement_version: '1', page_location: 'https://travelhood.es/destino/japon/', page_referrer: '', traffic_type: 'developer', debug_mode: true, destination_slug: 'japon' }
const envelope = { name: 'destination_view', parameters: params }
for (const raw of ['', 'th_cookie_consent=null', 'th_cookie_consent=invalid', cookie(false, false), cookie(false, true), 'th_cookie_consent=' + encodeURIComponent('{"analytics":true}')]) {
  assert.equal(variables(envelope, 'destination_view', raw)('TH Phase 1 - allowed'), false)
}
for (const raw of [cookie(true, false), cookie(true, true)]) assert.equal(variables(envelope, 'destination_view', raw)('TH Phase 1 - allowed'), true)
assert.equal(variables(envelope, 'destination_view', cookie(true, true), true)('TH Phase 1 - allowed'), false)
assert.equal(variables(envelope, 'destination_view', cookie(true, true), false, true)('TH Phase 1 - allowed'), false)
assert.equal(variables(null, 'destination_view', cookie(true, true))('TH Phase 1 - allowed'), false)
assert.equal(variables(envelope, 'destination_whatsapp_click', cookie(true, true))('TH Phase 1 - allowed'), false)
assert.equal(variables({ ...envelope, parameters: { ...params, measurement_version: 'old' } }, 'destination_view', cookie(true, true))('TH Phase 1 - allowed'), false)
function mapping(tag: Record<string, unknown>, key: string, get: (name: string) => unknown) {
  const table = (tag.parameter as Param[]).find((p) => p.key === key)!
  return Object.fromEntries(table.list!.map((row) => {
    const name = row.map!.find((p) => p.key === 'parameter')!.value!
    const raw = row.map!.find((p) => p.key === 'parameterValue')!.value!
    const match = raw.match(/^\{\{([^}]+)\}\}$/)
    return [name, match ? get(match[1]) : raw]
  }))
}
for (const name of Object.keys(EVENT_FIELDS)) {
  const expected = name === 'th_page_view' ? 'page_view' : name
  const e = { name: expected, parameters: params }
  const get = variables(e, name, cookie(true, false))
  assert.equal(get('TH Phase 1 - event name'), expected)
  assert.equal(get('TH Phase 1 - allowed'), true)
  const mapped = mapping(eventTag, 'eventSettingsTable', get)
  assert.equal(mapped.page_location, params.page_location)
  assert.equal(mapped.traffic_type, 'developer')
  assert.equal(mapped.debug_mode, 1)
  assert.ok(!('email' in mapped) && !('message' in mapped) && !('utm_campaign' in mapped))
}
const first = variables({ name: 'destination_view', parameters: { ...params, trip_id: 'trip-japon-2027-03-19' } }, 'destination_view', cookie(true, false))
assert.equal(mapping(eventTag, 'eventSettingsTable', first).trip_id, 'trip-japon-2027-03-19')
const second = variables(envelope, 'destination_view', cookie(true, false))
assert.equal(mapping(eventTag, 'eventSettingsTable', second).trip_id, undefined)
const config = mapping(google, 'configSettingsTable', second)
assert.equal(config.send_page_view, 'false')
assert.equal(config.allow_google_signals, 'false')
assert.equal(config.allow_ad_personalization_signals, 'false')
assert.equal(config.page_location, params.page_location)
assert.equal(config.page_referrer, '')
assert.equal(config.debug_mode, 1)
const external = variables({ name: 'destination_view', parameters: { measurement_version: '1', page_location: params.page_location, page_referrer: '', traffic_type: 'external' } }, 'destination_view', cookie(true, false))
assert.equal(mapping(google, 'configSettingsTable', external).debug_mode, undefined, 'Production external traffic has no debug field')
for (const [entity, id] of [['tag', 'tagId'], ['variable', 'variableId'], ['trigger', 'triggerId'], ['folder', 'folderId']] as const) {
  const entries = cv[entity] as { [key: string]: unknown }[]
  assert.equal(new Set(entries.map((entry) => entry[id])).size, entries.length, `${entity} IDs must be unique`)
}
const names = new Set([...(cv.variable || []).map((item) => item.name), ...(cv.builtInVariable as { name: string }[]).map((item) => item.name), '_event'])
for (const match of JSON.stringify(cv).matchAll(/\{\{([^}]+)\}\}/g)) assert.ok(names.has(match[1]), `Unresolved reference ${match[1]}`)
const wrongContainer = structuredClone(source); wrongContainer.containerVersion.container.publicId = 'GTM-OTHER'
assert.throws(() => prepareGtm(wrongContainer), /Wrong tenant/)
const extra = structuredClone(source); extra.containerVersion.tag.push({ name: 'Someone else work' })
assert.throws(() => prepareGtm(extra), /Additional tags/)
assert.throws(() => prepareGtm(candidate))
console.log(JSON.stringify({ result: 'passed', environment: 'Local structural/semantic checks and VM of generated JS; NOT GTM UI import/compiler, native Google SDK, DebugView or reports', originalUnchanged: true, tags: cv.tag.length, modifiedTags: 1, metaOutOfScope: true, importModeRequired: 'COMBINE', newTags: 1, variables: cv.variable!.length, eventParameters: PARAMETER_FIELDS.length, triggers: cv.trigger!.length, eventNames: Object.keys(EVENT_FIELDS).length, checks: ['tenant and IDs preserved', 'Meta entirely absent from partial import; original unchanged; COMBINE required', 'Google configuration starts first on owned events once/document; no async setup on dynamic event; automatic pageview false', 'one native GA4 Event tag, analytics consent required on both', 'exact event allowlist and pageview mapping', 'consent matrix, SDK opt-out and storage block guard', 'no parameter inheritance, no free-text fields mapped', 'all references and entity IDs valid', 'foreign containers and additional work rejected'] }, null, 2))
