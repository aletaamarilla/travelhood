import type { Trip } from "@/lib/travel-data"

export type PublicTrip = Omit<Trip, "placesLeft"> & { placesLeft?: number }

/** Only an explicitly marked almost-full departure publishes its remaining count. */
export function publicPlacesLeft(trip: Pick<PublicTrip, "status" | "placesLeft">): number | undefined {
  return trip.status === "almost-full" && typeof trip.placesLeft === "number" && trip.placesLeft > 0
    ? trip.placesLeft
    : undefined
}

export function toPublicTrip<T extends Pick<Trip, "status" | "placesLeft">>(
  trip: T,
): Omit<T, "placesLeft"> & { placesLeft?: number } {
  const { placesLeft: _privateCount, ...publicTrip } = trip
  const placesLeft = publicPlacesLeft(trip)
  return { ...publicTrip, ...(placesLeft === undefined ? {} : { placesLeft }) }
}
