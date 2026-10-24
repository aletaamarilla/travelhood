import assert from 'node:assert/strict'
import { build } from 'esbuild'

// Isolated browser-like harness. It exercises initialization before module import;
// it does not execute Google code and is not evidence of GA4 reception.
async function runtime({ choice = null, gate = true, brokenTracker = false, storageMode = 'normal', storageBlocked = false, preblocked = false, invalidCookie = false, skipEventsModule = false, env = 'test' } = {}) {
  const jar = new Map(choice ? [['th_cookie_consent', encodeURIComponent(JSON.stringify({ necessary: true, ...choice }))]] : [])
  if (invalidCookie) jar.set('th_cookie_consent', 'invalid')
  const listeners = new Map()
  const storage = new Map()
  if (preblocked) storage.set('th_consent_storage_blocked', '1')
  let mode = storageMode
  const state = { scripts: [], atContainerLoad: [], reloads: 0, mode: (value) => { mode = value } }
  const doc = {
    referrer: '', querySelector: () => ({ href: 'https://travelhood.es/destino/japon/' }),
    createElement: () => ({}), head: { appendChild: insertScript },
    getElementsByTagName: () => [{ parentNode: { insertBefore: insertScript } }],
    get cookie() { return [...jar].map(([k, v]) => `${k}=${v}`).join('; ') },
    set cookie(raw) {
      if (mode === 'throw') throw Error('Cookies blocked')
      if (mode === 'ignore') return
      const [pair] = raw.split(';'); const i = pair.indexOf('='); const key = pair.slice(0, i); const value = pair.slice(i + 1)
      if (raw.includes('Max-Age=0')) jar.delete(key)
      else jar.set(key, value)
    },
  }
  const win = {
    dataLayer: brokenTracker ? { push: () => { throw Error('Tracker blocked') } } : [],
    addEventListener: (name, callback) => listeners.set(name, [...(listeners.get(name) || []), callback]),
    dispatchEvent: (event) => { for (const callback of listeners.get(event.type) || []) callback(event); return true },
  }
  function insertScript(script) {
    state.scripts.push(script)
    state.atContainerLoad.push({ disabled: win['ga-disable-G-XQMPJG8B08'], defaults: Array.isArray(win.dataLayer) ? win.dataLayer.filter((x) => x[0] === 'consent' && x[1] === 'default').length : 0 })
  }
  Object.defineProperties(globalThis, {
    window: { configurable: true, value: win }, document: { configurable: true, value: doc },
    location: { configurable: true, value: { hostname: 'travelhood.es', protocol: 'https:', reload: () => { state.reloads++ } } },
    localStorage: { configurable: true, value: { getItem: (key) => { if (storageBlocked) throw Error('Storage blocked'); return storage.get(key) ?? null }, setItem: (key, value) => { if (storageBlocked) throw Error('Storage blocked'); storage.set(key, value) }, removeItem: (key) => { if (storageBlocked) throw Error('Storage blocked'); return storage.delete(key) } } },
  })
  const early = await build({ stdin: { contents: 'export { bootstrapGoogleConsent } from "./src/lib/analytics-bootstrap"; export { parseConsentCookie } from "./src/lib/consent";', resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', write: false })
  const bootstrap = await import(`data:text/javascript;base64,${Buffer.from(early.outputFiles[0].text).toString('base64')}#${Math.random()}`)
  bootstrap.bootstrapGoogleConsent({ gtmId: 'GTM-TB7F773D', measurementId: 'G-XQMPJG8B08', phase1Ready: gate }, bootstrap.parseConsentCookie)
  if (skipEventsModule) return { ...state, win, doc, jar, storage }
  const output = await build({ stdin: { contents: 'export { trackEvent, initAnalytics } from "./src/lib/analytics"; export { getStoredConsent, saveConsent } from "./src/lib/consent";', resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', write: false, define: { 'import.meta.env': JSON.stringify({ PUBLIC_GTM_ID: 'GTM-TB7F773D', PUBLIC_GA_ID: 'G-XQMPJG8B08', PUBLIC_GTM_PHASE1_READY: String(gate), PUBLIC_ANALYTICS_ENV: env }) } })
  const module = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}#${Math.random()}`)
  return { ...state, win, doc, jar, storage, module, count: () => Array.isArray(win.dataLayer) ? win.dataLayer.filter((e) => e.th_event).length : 0, get reloads() { return state.reloads } }
}

const report = []
for (const [name, choice, expected] of [
  ['absent', null, 0], ['rejected', { analytics: false, marketing: false }, 0],
  ['marketing_only', { analytics: false, marketing: true }, 0], ['analytics_only', { analytics: true, marketing: false }, 1], ['all', { analytics: true, marketing: true }, 1],
]) {
  const r = await runtime({ choice })
  assert.equal(r.scripts.length, 1)
  assert.equal(r.count(), expected)
  assert.deepEqual(r.atContainerLoad, [{ disabled: !choice?.analytics, defaults: 1 }])
  r.module.initAnalytics()
  assert.equal(r.scripts.length, 1)
  assert.equal(r.count(), expected)
  report.push(name)
}
const disabled = await runtime({ choice: { analytics: true, marketing: true }, gate: false })
assert.equal(disabled.scripts.length, 1)
assert.equal(disabled.count(), 0)
assert.equal(disabled.module.trackEvent('destination_view', { destination_slug: 'japon' }), true)
assert.equal(disabled.win.dataLayer.at(-1).th_event, null)
const blocked = await runtime({ brokenTracker: true })
assert.doesNotThrow(() => blocked.module.saveConsent({ necessary: true, analytics: true, marketing: false }))
assert.equal(blocked.module.trackEvent('destination_view', { destination_slug: 'japon' }), false)
report.push('gate_disabled', 'tracker_exception_during_import')
for (const mode of ['throw', 'ignore']) {
  const r = await runtime({ choice: { analytics: true, marketing: true } })
  r.mode(mode)
  assert.equal(r.module.saveConsent({ necessary: true, analytics: false, marketing: false }), false)
  assert.equal(r.reloads, 0)
  assert.equal(r.module.getStoredConsent().analytics, false)
  assert.equal(r.win['ga-disable-G-XQMPJG8B08'], true)
  assert.equal(r.module.trackEvent('destination_view', { destination_slug: 'japon' }), false)
  assert.equal(r.storage.get('th_consent_storage_blocked'), '1')
  report.push(`withdraw_storage_${mode}`)
}
const bothBlocked = await runtime({ choice: { analytics: true, marketing: true }, storageBlocked: true })
bothBlocked.mode('throw')
assert.equal(bothBlocked.module.saveConsent({ necessary: true, analytics: false, marketing: false }), false)
assert.equal(bothBlocked.reloads, 0)
assert.equal(bothBlocked.win['ga-disable-G-XQMPJG8B08'], true)
assert.equal(bothBlocked.module.trackEvent('destination_view', { destination_slug: 'japon' }), false)
report.push('withdraw_both_storages_blocked_current_document')
const preserveMarketing = await runtime({ choice: { analytics: true, marketing: true } })
preserveMarketing.jar.set('_ga', 'qa-analytics')
preserveMarketing.jar.set('_fbp', 'qa-meta-owned')
preserveMarketing.jar.set('_fbc', 'qa-meta-owned')
assert.equal(preserveMarketing.module.saveConsent({ necessary: true, analytics: false, marketing: true }), true)
assert.equal(preserveMarketing.jar.has('_ga'), false)
assert.equal(preserveMarketing.jar.get('_fbp'), 'qa-meta-owned')
assert.equal(preserveMarketing.jar.get('_fbc'), 'qa-meta-owned')
report.push('analytics_withdrawal_preserves_meta_cookies')
const tabs = await runtime({ choice: { analytics: false, marketing: false } })
tabs.module.saveConsent({ necessary: true, analytics: true, marketing: true })
assert.equal(tabs.scripts.length, 1)
tabs.jar.set('th_cookie_consent', encodeURIComponent(JSON.stringify({ necessary: true, analytics: false, marketing: false })))
assert.equal(tabs.module.getStoredConsent().analytics, false)
tabs.win.dispatchEvent({ type: 'storage', key: 'th_consent_change' })
assert.equal(tabs.reloads, 0)
assert.equal(tabs.win['ga-disable-G-XQMPJG8B08'], true)
assert.equal(tabs.module.trackEvent('destination_view', { destination_slug: 'japon' }), false)
report.push('cross_tab_withdrawal')
const active = await runtime({ choice: { analytics: true, marketing: false }, env: 'production' })
assert.equal(active.win.dataLayer.find((e) => e.th_event).th_event.parameters.traffic_type, 'external')
active.jar.set('th_analytics_internal', '1')
active.module.trackEvent('destination_view', { destination_slug: 'japon' })
assert.equal(active.win.dataLayer.at(-1).th_event.parameters.traffic_type, 'internal')
assert.equal(active.win.dataLayer.at(-1).th_event.parameters.debug_mode, true)
report.push('production_internal_isolation')
// Withdrawing and regranting never reloads or inserts the shared container twice.
const lifecycle = await runtime({ choice: { analytics: true, marketing: true } })
lifecycle.jar.set('_ga', 'qa-analytics')
lifecycle.jar.set('_fbp', 'qa-meta-owned')
assert.equal(lifecycle.module.saveConsent({ necessary: true, analytics: true, marketing: false }), true)
assert.equal(lifecycle.jar.has('_ga'), true, 'Marketing-only withdrawal must not reset Analytics')
assert.equal(lifecycle.module.saveConsent({ necessary: true, analytics: false, marketing: false }), true)
assert.equal(lifecycle.jar.has('_ga'), false)
assert.equal(lifecycle.win['ga-disable-G-XQMPJG8B08'], true)
assert.equal(lifecycle.module.saveConsent({ necessary: true, analytics: true, marketing: true }), true)
assert.equal(lifecycle.scripts.length, 1)
assert.equal(lifecycle.reloads, 0)
assert.equal(lifecycle.count(), 1, 'No second pageview when regranting in the same document')
assert.equal(lifecycle.jar.get('_fbp'), 'qa-meta-owned')
assert.equal(lifecycle.win.dataLayer.filter((x) => x[0] === 'consent' && x[1] === 'default').length, 1)
report.push('shared_container_once_no_reload_or_duplicate_default', 'marketing_withdrawal_keeps_analytics')
for (const options of [{ preblocked: true }, { invalidCookie: true }]) {
  const early = await runtime({ choice: { analytics: true, marketing: true }, ...options })
  assert.equal(early.atContainerLoad[0].disabled, true)
  assert.equal(early.count(), 0)
}
report.push('blocked_or_invalid_preference_before_container')
const noModule = await runtime({ choice: { analytics: true, marketing: true }, skipEventsModule: true })
noModule.jar.set('_ga', 'qa-analytics')
noModule.jar.set('_fbp', 'qa-meta-owned')
noModule.doc.cookie = 'th_cookie_consent=' + encodeURIComponent(JSON.stringify({ necessary: true, analytics: false, marketing: true }))
noModule.win.dispatchEvent({ type: 'cookieConsentUpdated', detail: { necessary: true, analytics: false, marketing: true } })
assert.equal(noModule.win['ga-disable-G-XQMPJG8B08'], true)
assert.equal(noModule.jar.has('_ga'), false)
assert.equal(noModule.jar.get('_fbp'), 'qa-meta-owned')
assert.equal(noModule.scripts.length, 1)
report.push('withdrawal_without_events_module')
const noModuleBlocked = await runtime({ choice: { analytics: true, marketing: true }, skipEventsModule: true, storageBlocked: true })
noModuleBlocked.win.dispatchEvent({ type: 'cookieConsentUpdated', detail: { necessary: true, analytics: false, marketing: false } })
noModuleBlocked.win.dispatchEvent({ type: 'focus' })
assert.equal(noModuleBlocked.win['ga-disable-G-XQMPJG8B08'], true)
report.push('early_owner_failed_withdrawal_stays_denied')
const clearStorage = await runtime({ choice: { analytics: true, marketing: true } })
clearStorage.jar.delete('th_cookie_consent')
clearStorage.win.dispatchEvent({ type: 'storage', key: null })
assert.equal(clearStorage.win['ga-disable-G-XQMPJG8B08'], true)
report.push('cross_tab_storage_clear')
for (const key of ['window', 'document', 'location', 'localStorage']) Reflect.deleteProperty(globalThis, key)
console.log(JSON.stringify({ environment: 'Isolated browser-like harness, bundled actual source; no external service executed', result: 'passed', scenarios: report }, null, 2))
