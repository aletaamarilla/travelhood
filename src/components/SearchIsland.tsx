import { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, MapPin, Search } from "lucide-react"
import SearchDateSelector, { formatDateSelectionLabel } from "@/components/SearchDateSelector"
import SearchDestinationSelector from "@/components/SearchDestinationSelector"
import {
  createDefaultSearchIntent,
  resolveSearchNavigation,
  type DateSelection,
  type SearchIntent,
} from "@/lib/search-intent"
import {
  trackDestinationAnySelected,
  trackDestinationSpecificSelected,
  trackHomeSearchSubmit,
  trackSearchStarted,
} from "@/lib/search-tracking"
import {
  ANY_WHERE_LABEL,
} from "@/lib/search-options"
import {
  getTodayStart,
  hasMatchesForSearch,
  type SearchAvailabilityTrip,
} from "@/lib/search-availability"
import type { SearchCatalogContinent, SearchCatalogDestination } from "@/lib/search-intent"

interface SearchIslandProps {
  destinations: SearchCatalogDestination[]
  continents: SearchCatalogContinent[]
  trips: SearchAvailabilityTrip[]
}

type WhereSelection =
  | { mode: "any"; label: typeof ANY_WHERE_LABEL }
  | { mode: "specific"; type: "continent"; id: string; label: string }
  | { mode: "specific"; type: "destination"; id: string; slug: string; label: string }

const anyWhere: WhereSelection = { mode: "any", label: ANY_WHERE_LABEL }

const SEARCH_SOURCE = "home_hero" as const

function buildSearchIntent(where: WhereSelection, date: DateSelection): SearchIntent {
  const intent = createDefaultSearchIntent()

  if (where.mode === "specific") {
    intent.destination = where.type === "destination"
      ? { mode: "specific", kind: "destination", destinationId: where.id }
      : { mode: "specific", kind: "continent", continentId: where.id }
  }

  intent.date = date
  return intent
}

// ── Hook: close on outside click ──
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [ref, handler, active])
}

export default function SearchIsland({ destinations, continents, trips }: SearchIslandProps) {
  const [query, setQuery] = useState("")
  const [selectedWhere, setSelectedWhere] = useState<WhereSelection>(anyWhere)
  const [selectedDate, setSelectedDate] = useState<DateSelection>({ mode: "any" })

  const [whereOpen, setWhereOpen] = useState(false)
  const [whenOpen, setWhenOpen] = useState(false)

  const whereRef = useRef<HTMLDivElement>(null)
  const whenRef = useRef<HTMLDivElement>(null)
  const todayStart = useMemo(() => getTodayStart(), [])

  useClickOutside(whereRef, () => setWhereOpen(false), whereOpen)
  useClickOutside(whenRef, () => setWhenOpen(false), whenOpen)

  const intent = useMemo<SearchIntent>(
    () => buildSearchIntent(selectedWhere, selectedDate),
    [selectedDate, selectedWhere],
  )

  const availableDestinations = useMemo(
    () =>
      destinations.filter((destination) =>
        hasMatchesForSearch(trips, destinations, todayStart, {
          destination: { mode: "specific", kind: "destination", destinationId: destination.id },
          date: intent.date,
        }),
      ),
    [destinations, intent.date, todayStart, trips],
  )

  const activeContinents = useMemo(
    () =>
      continents.filter((continent) =>
        hasMatchesForSearch(trips, destinations, todayStart, {
          destination: { mode: "specific", kind: "continent", continentId: continent.id },
          date: intent.date,
        }),
      ),
    [continents, destinations, intent.date, todayStart, trips],
  )

  const destinationRefs = useMemo(
    () => destinations.map(({ id, slug }) => ({ id, slug })),
    [destinations],
  )

  const whereDisplayLabel = selectedWhere.mode === "any" ? "¿Dónde?" : selectedWhere.label
  const whenDisplayLabel = formatDateSelectionLabel(selectedDate, "¿Cuándo?")

  const navigateWithIntent = (nextIntent: SearchIntent) => {
    setWhereOpen(false)
    setWhenOpen(false)
    trackHomeSearchSubmit(nextIntent, destinationRefs)
    const target = resolveSearchNavigation(nextIntent, destinationRefs)
    window.location.href = target.href
  }

  const handleSearch = () => navigateWithIntent(intent)

  const handleDateApply = (date: DateSelection) => {
    setSelectedDate(date)
    navigateWithIntent(buildSearchIntent(selectedWhere, date))
  }

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setWhereOpen(false)
      setWhenOpen(false)
    }
  }

  return (
        <form
          onSubmit={(event) => { event.preventDefault(); handleSearch() }}
          onKeyDown={handleDropdownKeyDown}
          className="rounded-2xl bg-card p-1.5 shadow-2xl sm:rounded-full"
          aria-label="Buscar viajes"
        >
            <div className="flex flex-col sm:flex-row sm:items-center">

            {/* ── DÓNDE ── */}
            <div ref={whereRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  if (!whereOpen) trackSearchStarted(SEARCH_SOURCE)
                  setWhereOpen(!whereOpen)
                  setWhenOpen(false)
                }}
                aria-expanded={whereOpen}
                aria-controls="destination-options"
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-vivid sm:rounded-full sm:px-5"
              >
                <MapPin className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span className={`min-w-0 flex-1 truncate text-sm ${selectedWhere.mode === "any" ? "text-muted-foreground" : "text-foreground"}`}>
                  {whereDisplayLabel}
                </span>
              </button>

              {whereOpen && (
                <SearchDestinationSelector
                  id="destination-options"
                  query={query}
                  destinations={availableDestinations}
                  continents={activeContinents}
                  selected={selectedWhere.mode === "specific" ? { kind: selectedWhere.type, id: selectedWhere.id } : null}
                  popularLimit={5}
                  onQueryChange={setQuery}
                  onSelectAny={() => {
                    setSelectedWhere(anyWhere)
                    setQuery("")
                    setWhereOpen(false)
                    trackDestinationAnySelected(SEARCH_SOURCE, buildSearchIntent(anyWhere, selectedDate), destinationRefs)
                  }}
                  onSelectDestination={(destination) => {
                    const where: WhereSelection = { mode: "specific", type: "destination", id: destination.id, slug: destination.slug, label: destination.name }
                    setSelectedWhere(where)
                    setQuery("")
                    setWhereOpen(false)
                    trackDestinationSpecificSelected(SEARCH_SOURCE, buildSearchIntent(where, selectedDate), destinationRefs)
                  }}
                  onSelectContinent={(continent) => {
                    const where: WhereSelection = { mode: "specific", type: "continent", id: continent.id, label: continent.name }
                    setSelectedWhere(where)
                    setQuery("")
                    setWhereOpen(false)
                    trackDestinationSpecificSelected(SEARCH_SOURCE, buildSearchIntent(where, selectedDate), destinationRefs)
                  }}
                />
              )}
            </div>

            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

            {/* ── CUÁNDO ── */}
            <div ref={whenRef} className="relative sm:w-52">
              <button
                type="button"
                onClick={() => {
                  if (!whenOpen) trackSearchStarted(SEARCH_SOURCE)
                  setWhenOpen(!whenOpen)
                  setWhereOpen(false)
                }}
                aria-expanded={whenOpen}
                aria-controls="home-date-options"
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-vivid sm:rounded-full sm:px-5"
              >
                <Calendar className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span className={`min-w-0 flex-1 truncate text-sm ${selectedDate.mode === "any" ? "text-muted-foreground" : "text-foreground"}`}>
                  {whenDisplayLabel}
                </span>
              </button>

              <SearchDateSelector
                id="home-date-options"
                open={whenOpen}
                value={selectedDate}
                trips={trips}
                destinations={destinations}
                destination={intent.destination}
                todayStart={todayStart}
                onClose={() => setWhenOpen(false)}
                onApply={handleDateApply}
              />
            </div>

            {/* CTA */}
            <div className="p-1">
              <button
                type="submit"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-coral/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:rounded-full sm:px-7"
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
            </div>
          </div>
        </form>
  )
}
