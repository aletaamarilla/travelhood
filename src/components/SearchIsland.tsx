import { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, CalendarClock, Globe, MapPin, Search, X } from "lucide-react"
import {
  createDefaultSearchIntent,
  resolveSearchNavigation,
  type SearchIntent,
} from "@/lib/search-intent"
import {
  trackDateAnySelected,
  trackDestinationAnySelected,
  trackDestinationSpecificSelected,
  trackHomeSearchSubmit,
  trackSearchStarted,
} from "@/lib/search-tracking"
import {
  ANY_WHEN_LABEL,
  ANY_WHERE_LABEL,
  filterDestinationSuggestions,
  SEARCH_MONTH_OPTIONS,
  SEARCH_PERIOD_OPTIONS,
} from "@/lib/search-options"
import {
  getTodayStart,
  hasMatchesForSearch,
  type SearchAvailabilityTrip,
} from "@/lib/search-availability"
import type { SearchCatalogContinent, SearchCatalogDestination } from "@/lib/search-intent"
import type { TripTag } from "@/lib/travel-data"

const continentEmoji: Record<string, string> = {
  europe: "🌍", asia: "🌏", africa: "🌍", "south-america": "🌎", "central-america": "🌎", oceania: "🌏",
}

interface SearchIslandProps {
  destinations: SearchCatalogDestination[]
  continents: SearchCatalogContinent[]
  trips: SearchAvailabilityTrip[]
}

type WhereSelection =
  | { mode: "any"; label: typeof ANY_WHERE_LABEL }
  | { mode: "specific"; type: "continent"; id: string; label: string }
  | { mode: "specific"; type: "destination"; id: string; slug: string; label: string }

type WhenSelection =
  | { mode: "any"; label: typeof ANY_WHEN_LABEL }
  | { mode: "specific"; type: "period"; id: TripTag; label: string }
  | { mode: "specific"; type: "month"; id: number; label: string }

const anyWhere: WhereSelection = { mode: "any", label: ANY_WHERE_LABEL }
const anyWhen: WhenSelection = { mode: "any", label: ANY_WHEN_LABEL }

const SEARCH_SOURCE = "home_hero" as const

function buildSearchIntent(where: WhereSelection, when: WhenSelection): SearchIntent {
  const intent = createDefaultSearchIntent()

  if (where.mode === "specific") {
    intent.destination = where.type === "destination"
      ? { mode: "specific", kind: "destination", destinationId: where.id }
      : { mode: "specific", kind: "continent", continentId: where.id }
  }

  if (when.mode === "specific") {
    intent.date = when.type === "period"
      ? { mode: "specific", kind: "period", periodId: when.id }
      : { mode: "specific", kind: "month", monthIndex: when.id }
  }

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
  const [selectedWhen, setSelectedWhen] = useState<WhenSelection>(anyWhen)

  const [whereOpen, setWhereOpen] = useState(false)
  const [whenOpen, setWhenOpen] = useState(false)
  const [whenTab, setWhenTab] = useState<"flexible" | "meses">("meses")

  const whereRef = useRef<HTMLDivElement>(null)
  const whenRef = useRef<HTMLDivElement>(null)
  const todayStart = useMemo(() => getTodayStart(), [])

  useClickOutside(whereRef, () => setWhereOpen(false), whereOpen)
  useClickOutside(whenRef, () => setWhenOpen(false), whenOpen)

  const intent = useMemo<SearchIntent>(
    () => buildSearchIntent(selectedWhere, selectedWhen),
    [selectedWhere, selectedWhen],
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

  const popularDestinations = useMemo(() => availableDestinations.slice(0, 4), [availableDestinations])

  const suggestions = useMemo(
    () => filterDestinationSuggestions(availableDestinations, query),
    [query, availableDestinations],
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

  const availablePeriodOptions = useMemo(
    () =>
      SEARCH_PERIOD_OPTIONS.filter((period) =>
        hasMatchesForSearch(trips, destinations, todayStart, {
          destination: intent.destination,
          date: { mode: "specific", kind: "period", periodId: period.id },
        }),
      ),
    [destinations, intent.destination, todayStart, trips],
  )

  const availableMonthOptions = useMemo(
    () =>
      SEARCH_MONTH_OPTIONS.filter((month) =>
        hasMatchesForSearch(trips, destinations, todayStart, {
          destination: intent.destination,
          date: { mode: "specific", kind: "month", monthIndex: month.index },
        }),
      ),
    [destinations, intent.destination, todayStart, trips],
  )

  const destinationRefs = useMemo(
    () => destinations.map(({ id, slug }) => ({ id, slug })),
    [destinations],
  )

  const whereDisplayLabel = selectedWhere.mode === "any" ? "¿Dónde?" : selectedWhere.label
  const whenDisplayLabel = selectedWhen.mode === "any" ? "¿Cuándo?" : selectedWhen.label

  const handleSearch = () => {
    setWhereOpen(false)
    setWhenOpen(false)
    trackHomeSearchSubmit(intent, destinationRefs)
    const target = resolveSearchNavigation(intent, destinationRefs)
    window.location.href = target.href
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
                <div id="destination-options" className="absolute left-0 top-full z-50 mt-2 max-h-[min(70vh,30rem)] w-full min-w-72 overflow-y-auto rounded-xl border border-border/50 bg-card p-1.5 shadow-lg sm:w-80">
                  <div className="mb-1 flex min-h-11 items-center gap-2 rounded-lg bg-muted/40 px-3">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <label htmlFor="destination-search" className="sr-only">Buscar destino</label>
                    <input
                      id="destination-search"
                      type="text"
                      placeholder="Buscar destino..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                      className="min-h-11 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none sm:text-sm"
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-teal-vivid">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWhere(anyWhere)
                      setQuery("")
                      setWhereOpen(false)
                      trackDestinationAnySelected(SEARCH_SOURCE, buildSearchIntent(anyWhere, selectedWhen), destinationRefs)
                    }}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                      selectedWhere.mode === "any" ? "bg-teal-deep/5 text-teal-deep" : "text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Globe className="h-5 w-5 shrink-0 text-coral" />
                    <span>
                      <span className="block text-sm font-semibold">Cualquier sitio</span>
                      <span className="block text-xs text-muted-foreground">No sé dónde ir, quiero ver opciones</span>
                    </span>
                  </button>

                  {query && suggestions.length > 0 ? (
                    <div className="py-1">
                      {suggestions.map((dest) => (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => {
                            const where: WhereSelection = { mode: "specific", type: "destination", id: dest.id, slug: dest.slug, label: dest.name }
                            setSelectedWhere(where)
                            setQuery("")
                            setWhereOpen(false)
                            trackDestinationSpecificSelected(SEARCH_SOURCE, buildSearchIntent(where, selectedWhen), destinationRefs)
                          }}
                          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-teal-vivid"
                        >
                          <img
                            src={dest.heroImage}
                            alt={dest.name}
                            width={32}
                            height={32}
                            loading="lazy"
                            decoding="async"
                            className="h-8 w-8 shrink-0 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{dest.name}</p>
                            <p className="truncate text-xs text-muted-foreground/70">{dest.shortDescription}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query && suggestions.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground/60">Sin resultados</p>
                  ) : (
                    <>
                      <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Continentes</p>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {activeContinents.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              const where: WhereSelection = { mode: "specific", type: "continent", id: c.id, label: c.name }
                              setSelectedWhere(where)
                              setQuery("")
                              setWhereOpen(false)
                              trackDestinationSpecificSelected(SEARCH_SOURCE, buildSearchIntent(where, selectedWhen), destinationRefs)
                            }}
                            className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                              selectedWhere.mode === "specific" && selectedWhere.id === c.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
                            }`}
                          >
                            <span>{continentEmoji[c.id]}</span>
                            {c.name}
                          </button>
                        ))}
                      </div>

                      <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Destinos populares</p>
                      {popularDestinations.length > 0 ? (
                        popularDestinations.map((dest) => (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => {
                              const where: WhereSelection = { mode: "specific", type: "destination", id: dest.id, slug: dest.slug, label: dest.name }
                              setSelectedWhere(where)
                              setQuery("")
                              setWhereOpen(false)
                              trackDestinationSpecificSelected(SEARCH_SOURCE, buildSearchIntent(where, selectedWhen), destinationRefs)
                            }}
                            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-teal-vivid"
                          >
                            <img
                              src={dest.heroImage}
                              alt={dest.name}
                              width={32}
                              height={32}
                              loading="lazy"
                              decoding="async"
                              className="h-8 w-8 shrink-0 rounded-md object-cover"
                            />
                            <p className="text-sm text-foreground">{dest.name}</p>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-4 text-center text-sm text-muted-foreground/60">No hay destinos con salidas para esos filtros</p>
                      )}
                    </>
                  )}
                </div>
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
                aria-controls="date-options"
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-vivid sm:rounded-full sm:px-5"
              >
                <Calendar className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span className={`min-w-0 flex-1 truncate text-sm ${selectedWhen.mode === "any" ? "text-muted-foreground" : "text-foreground"}`}>
                  {whenDisplayLabel}
                </span>
              </button>

              {whenOpen && (
                <div id="date-options" className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,30rem)] w-full min-w-72 overflow-y-auto rounded-xl border border-border/50 bg-card shadow-lg sm:w-80">
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWhen(anyWhen)
                        setWhenOpen(false)
                        trackDateAnySelected(SEARCH_SOURCE, buildSearchIntent(selectedWhere, anyWhen), destinationRefs)
                      }}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                        selectedWhen.mode === "any" ? "bg-teal-deep/5 text-teal-deep" : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <CalendarClock className="h-5 w-5 shrink-0 text-coral" />
                      <span>
                        <span className="block text-sm font-semibold">Cualquier fecha</span>
                        <span className="block text-xs text-muted-foreground">Tengo flexibilidad</span>
                      </span>
                    </button>
                  </div>
                  <div className="flex border-b border-border/40">
                    <button
                      type="button"
                      onClick={() => setWhenTab("meses")}
                      className={`min-h-11 flex-1 px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                        whenTab === "meses" ? "border-b-2 border-teal-deep text-teal-deep" : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Por mes
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhenTab("flexible")}
                      className={`min-h-11 flex-1 px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                        whenTab === "flexible" ? "border-b-2 border-teal-deep text-teal-deep" : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Flexible
                    </button>
                  </div>

                  <div className="p-1.5">
                    {whenTab === "flexible" ? (
                      <div className="flex flex-col gap-0.5">
                        {availablePeriodOptions.length > 0 ? (
                          availablePeriodOptions.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => { setSelectedWhen({ mode: "specific", type: "period", id: p.id, label: p.label }); setWhenOpen(false) }}
                              className={`min-h-11 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                                selectedWhen.mode === "specific" && selectedWhen.type === "period" && selectedWhen.id === p.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
                              }`}
                            >
                              {p.label}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-4 text-center text-sm text-muted-foreground/60">No hay temporadas con salidas para esos filtros</p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {availableMonthOptions.length > 0 ? (
                          availableMonthOptions.map((month) => (
                            <button
                              key={month.index}
                              type="button"
                              onClick={() => { setSelectedWhen({ mode: "specific", type: "month", id: month.index, label: month.label }); setWhenOpen(false) }}
                              className={`min-h-11 rounded-lg py-2.5 text-center text-sm capitalize transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid ${
                                selectedWhen.mode === "specific" && selectedWhen.type === "month" && selectedWhen.id === month.index
                                  ? "bg-teal-deep font-medium text-white"
                                  : "text-foreground/80 hover:bg-muted/40"
                              }`}
                            >
                              {month.shortLabel}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-3 px-3 py-4 text-center text-sm text-muted-foreground/60">No hay meses con salidas para esos filtros</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
