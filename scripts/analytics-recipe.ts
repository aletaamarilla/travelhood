import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { EVENT_FIELDS } from '@/lib/analytics'

const events = Object.entries(EVENT_FIELDS).map(([event, parameters]) => ({ event, ga4Event: event === 'th_page_view' ? 'page_view' : event, parameters }))
const recipe = {
  status: 'CONFIGURATION_RECIPE_ONLY_NOT_PUBLISHED_OR_IMPORTABLE_GTM_EXPORT',
  observedWebContainer: 'GTM-TB7F773D',
  officialMeasurementId: 'G-XQMPJG8B08',
  observedWebMeasurementId: 'G-XQMPJG8B08',
  requires: ['Published GTM export and workspace review', 'Real consent, DebugView and processed report verification'],
  envelope: { dataLayerVariable: 'th_event', version: 1, eventName: 'name', eventParameters: 'parameters' },
  consent: 'analytics_storage',
  googleTag: { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, enhancedMeasurement: false },
  triggerRegex: '^(' + events.map((e) => e.event).join('|') + ')$',
  commonParameters: ['measurement_version', 'page_location', 'page_referrer', 'traffic_type', 'debug_mode'],
  events,
}
const path = new URL('../docs/analytics/gtm-recipe.json', import.meta.url)
if (process.argv.includes('--check')) {
  assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), recipe)
  console.log('GTM recipe matches the executable event contract. No external activation is implied.')
} else writeFileSync(path, JSON.stringify(recipe, null, 2) + '\n')
