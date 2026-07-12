# Preflight fillNewDestination

Generated at: 2026-07-10T21:08:25.590Z
Mode: preflight / Sanity perspective raw
Dataset: production
Credentials: configured; token not printed
Snapshot: `imports/fillNewDestination/preflight/preflight-snapshot.json`

## Status

COMPLETED: no collisions or ambiguous references were found.

## Continents

| Target ID | Found ID | Rev | Status |
| --- | --- | --- | --- |
| `continent-europa` | `continent-europa` | `u93Z2ge2ROiYmlpy4o6TJh` | reuse |
| `continent-centroamerica` | `continent-centroamerica` | `XlNwq3xbphLrhVKM5zc61j` | reuse |

## Countries

| Target | IDs checked | Slugs checked | Resolution | Existing match | Rev |
| --- | --- | --- | --- | --- | --- |
| Chequia | `country-chequia`<br>`drafts.country-chequia` | `chequia`<br>`republica-checa` | new | new country | - |
| Guatemala | `country-guatemala`<br>`drafts.country-guatemala` | `guatemala` | new | new country | - |

## Destination And Trip Collisions

Destination target IDs: `destination-praga`, `drafts.destination-praga`, `destination-guatemala`, `drafts.destination-guatemala`
Destination target slugs: `praga`, `guatemala`
Destination collisions: none

Trip target IDs: `trip-praga-2026-11-26`, `drafts.trip-praga-2026-11-26`, `trip-praga-2026-12-02`, `drafts.trip-praga-2026-12-02`, `trip-guatemala-2027-01-19`, `drafts.trip-guatemala-2027-01-19`
Trip target slugs: `praga-noviembre-2026`, `praga-diciembre-2026`, `guatemala-enero-2027`
Trip collisions: none

## Coordinators

| ID | Rev | Name | Slug | Destination refs |
| --- | --- | --- | --- | --- |
| `coordinator-carlos` | `XlNwq3xbphLrhVKM5ybFBr` | Carlos Ruiz | `carlos` | `destination-laponia`, `destination-maldivas`, `destination-islandia`, `destination-azores`, `destination-colombia`, `destination-tailandia-verano`, `destination-tailandia-invierno`, `destination-filipinas-invierno`, `destination-sri-lanka-otono` |
| `coordinator-marta` | `XlNwq3xbphLrhVKM5ybFBr` | Marta López | `marta` | `destination-brasil`, `destination-zanzibar`, `destination-egipto`, `destination-lofoten`, `destination-indonesia`, `destination-filipinas-verano`, `destination-puerto-rico`, `destination-sri-lanka-verano`, `destination-sri-lanka-invierno` |

## Coordinator Compatibility

| Trip | Destination | hasCoordinator | Proposed coordinator | Status | Message |
| --- | --- | --- | --- | --- | --- |
| `trip-praga-2026-11-26` | `destination-praga` | true | `coordinator-carlos` | compatible | Proposed coordinator exists and is compatible with hasCoordinator. |
| `trip-praga-2026-12-02` | `destination-praga` | true | `coordinator-carlos` | compatible | Proposed coordinator exists and is compatible with hasCoordinator. |
| `trip-guatemala-2027-01-19` | `destination-guatemala` | true | `coordinator-carlos` | compatible | Proposed coordinator exists and is compatible with hasCoordinator. |

## Read-Only Guarantee

- The utility only creates a Sanity client and runs GROQ fetches with `useCdn: false` and `perspective: raw`.
- Local artifacts written by this run are the report and snapshot paths listed above.
- No secrets are printed or saved.

