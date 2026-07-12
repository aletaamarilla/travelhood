import assert from "node:assert/strict"

import { createDefaultSearchIntent, resolveSearchNavigation } from "./search-intent.ts"
import { intentToTrackingFields } from "./search-tracking.ts"

const destinations = [
  { id: "destination-brasil", slug: "brasil" },
  { id: "destination-japon", slug: "japon" },
]

// Payload uses structured ids, never free-text query
{
  const intent = createDefaultSearchIntent()
  const fields = intentToTrackingFields(intent, destinations)
  assert.equal(fields.destination_mode, "any")
  assert.equal(fields.date_mode, "any")
  assert.equal(fields.destination_slug, undefined)
  assert.equal(fields.date_value, undefined)
}

{
  const intent = {
    destination: { mode: "specific" as const, kind: "destination" as const, destinationId: "destination-brasil" },
    date: { mode: "specific" as const, kind: "period" as const, periodId: "verano" as const },
  }
  const fields = intentToTrackingFields(intent, destinations)
  assert.equal(fields.destination_mode, "specific")
  assert.equal(fields.destination_slug, "brasil")
  assert.equal(fields.date_mode, "specific")
  assert.equal(fields.date_value, "verano")
}

// Fallback navigation is detectable for 404 prevention
{
  const intent = {
    destination: { mode: "specific" as const, kind: "destination" as const, destinationId: "missing-id" },
    date: { mode: "any" as const },
  }
  const resolved = resolveSearchNavigation(intent, destinations)
  assert.equal(resolved.target, "results")
}
