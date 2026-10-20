import assert from "node:assert/strict"
import { publicPlacesLeft, toPublicTrip } from "./public-trip"
import { generateEventSchema } from "./schemas"

for (const count of [0, 3, 15]) {
  for (const status of ["open", "full"] as const) {
    const original = { status, placesLeft: count, totalPlaces: 15, priceFrom: 1000, bookingUrl: "https://reservas.travelhood.es/grupos/viajes/18240" }
    const result = toPublicTrip(original)
    assert.equal("placesLeft" in result, false, `${status} must not expose a count`)
    assert.equal(JSON.stringify(result).includes("placesLeft"), false)
    assert.equal(original.placesLeft, count, "Do not mutate operational data")
    assert.equal(result.bookingUrl, original.bookingUrl)
    assert.equal(result.priceFrom, 1000)
    assert.equal(result.totalPlaces, 15)
  }
}
assert.equal(publicPlacesLeft({ status: "almost-full", placesLeft: 3 }), 3)
assert.equal(toPublicTrip({ status: "almost-full", placesLeft: 3 }).placesLeft, 3)
assert.equal(publicPlacesLeft({ status: "almost-full", placesLeft: 0 }), undefined)
assert.equal(publicPlacesLeft({ status: "almost-full" }), undefined)

const event = generateEventSchema({
  name: "Dolomitas", startDate: "2027-06-21", endDate: "2027-06-27",
  location: "Italia", price: 1000, availability: "https://schema.org/InStock",
  placesLeft: publicPlacesLeft({ status: "open", placesLeft: 15 }),
})
assert.equal("remainingAttendeeCapacity" in event, false)
assert.equal(event.offers.price, 1000)
assert.equal(event.offers.availability, "https://schema.org/InStock")
console.log("Public trip availability: passed")
