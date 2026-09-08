import assert from 'node:assert/strict'
import {
  TRAVEL_INSURANCE_NOT_INCLUDED,
  enforceSeparateTravelInsurance,
  isTravelInsuranceItem,
  withSeparateTravelInsurance,
} from '../../shared/travel-insurance'
import {buildInsurancePatch, type InsuranceDocument} from '../../scripts/fix-travel-insurance'
import {getTrips, getTripsByDestination, getTripsByTag, getDestinations} from './data-provider'

const input = {
  included: ['Alojamiento', 'Seguro de viaje', 'Seguro MÉDICO de viaje.', 'Traslados'],
  notIncluded: ['Vuelos', 'Seguro de viaje', 'Seguro médico de viaje.', 'Comidas'],
  travelInsuranceIncluded: true,
}
const result = enforceSeparateTravelInsurance(input)
assert.deepEqual(result.included, ['Alojamiento', 'Traslados'])
assert.deepEqual(result.notIncluded, ['Vuelos', TRAVEL_INSURANCE_NOT_INCLUDED, 'Comidas'])
assert.equal(input.included.length, 4)
assert.deepEqual(enforceSeparateTravelInsurance(result), result)
assert.deepEqual(withSeparateTravelInsurance([]), [TRAVEL_INSURANCE_NOT_INCLUDED])
assert.equal(isTravelInsuranceItem('Seguro de responsabilidad civil de la agencia'), false)
assert.equal(isTravelInsuranceItem('Seguro del vehículo de alquiler'), false)

// A destination with its own exclusions still needs insurance outside the price.
const ownList = {included: ['Coordinador'], notIncluded: ['Vuelos'], inheritDefaultNotIncluded: false}
assert.ok(enforceSeparateTravelInsurance(ownList).notIncluded.includes(TRAVEL_INSURANCE_NOT_INCLUDED))

const doc: InsuranceDocument = {_id: 'destination-laponia', _rev: 'revision', _type: 'destination', ...input}
const patch = buildInsurancePatch(doc)!
assert.deepEqual(patch.set.included, ['Alojamiento', 'Traslados'])
assert.deepEqual(patch.unset, ['travelInsuranceIncluded'])
const corrected = {...doc, ...patch.set}
delete corrected.travelInsuranceIncluded
assert.equal(buildInsurancePatch(corrected), null)
assert.equal(buildInsurancePatch({_id: 'ordinary', _rev: 'r', _type: 'destination', included: ['Alojamiento']}), null)
assert.deepEqual(buildInsurancePatch({_id: 'own-list', _rev: 'r', _type: 'destination', notIncluded: ['Vuelos'], inheritDefaultNotIncluded: false})?.set.notIncluded, ['Vuelos', TRAVEL_INSURANCE_NOT_INCLUDED])

// All fallback getters must honour the rule as well as the CMS path.
for (const trip of [...await getTrips(), ...await getTripsByDestination('laponia'), ...await getTripsByTag('verano')]) {
  assert.equal(trip.included.some(isTravelInsuranceItem), false, trip.id)
  assert.equal(trip.notIncluded.filter(isTravelInsuranceItem).length, 1, trip.id)
  assert.ok(trip.notIncluded.includes(TRAVEL_INSURANCE_NOT_INCLUDED), trip.id)
}
for (const destination of await getDestinations()) {
  assert.equal(destination.included?.some(isTravelInsuranceItem), false, destination.id)
  assert.ok(destination.notIncluded?.includes(TRAVEL_INSURANCE_NOT_INCLUDED), destination.id)
}
console.log('Seguro aparte: listas, fuentes locales, excepciones e idempotencia de la migración comprobadas.')
