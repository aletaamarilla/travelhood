import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, MapPin, Calendar, X, Users, Shield, Compass } from "lucide-react"
import {
  trips,
  destinations,
  continents,
  countries,
  searchDestinations,
  filterTripsAdvanced,
  type Trip,
  type DestinationCategory,
  type TripTag,
} from "@/lib/travel-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const periods: { id: TripTag; label: string }[] = [
  { id: "semana-santa", label: "Semana Santa" },
  { id: "puente-mayo", label: "Puente de mayo" },
  { id: "verano", label: "Verano" },
  { id: "septiembre", label: "Septiembre" },
  { id: "puente-octubre", label: "Puente de octubre" },
  { id: "puente-noviembre", label: "Puente de noviembre" },
  { id: "navidad", label: "Navidad" },
  { id: "fin-de-anio", label: "Fin de Año" },
]

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const monthNamesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const categoryFilters: { id: DestinationCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "Todos", emoji: "✨" },
  { id: "playa", label: "Playa & Sol", emoji: "🏖️" },
  { id: "aventura", label: "Safari & Aventura", emoji: "🌿" },
  { id: "nieve", label: "Auroras & Nieve", emoji: "🌌" },
  { id: "cultural", label: "Cultura & Historia", emoji: "🏛️" },
  { id: "naturaleza", label: "Naturaleza", emoji: "🌴" },
]

const continentEmoji: Record<string, string> = {
  europe: "🌍", asia: "🌏", africa: "🌍", "south-america": "🌎", "central-america": "🌎", oceania: "🌏",
}

const popularDestinations = destinations.slice(0, 6)

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

function parseUrlParams(): {
  donde?: string
  dondeTipo?: "continent" | "destination"
  dondeLabel?: string
  cuando?: string
  cuandoTipo?: "period" | "month"
  cuandoLabel?: string
  tipo?: string
} {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)

  const result: ReturnType<typeof parseUrlParams> = {}

  const donde = params.get("donde")
  if (donde) {
    const continent = continents.find((c) => c.id === donde || c.slug === donde)
    if (continent) {
      result.donde = continent.id
      result.dondeTipo = "continent"
      result.dondeLabel = continent.name
    } else {
      const dest = destinations.find((d) => d.id === donde || d.slug === donde)
      if (dest) {
        result.donde = dest.id
        result.dondeTipo = "destination"
        result.dondeLabel = dest.name
      }
    }
  }

  const cuando = params.get("cuando")
  if (cuando) {
    const period = periods.find((p) => p.id === cuando)
    if (period) {
      result.cuando = period.id
      result.cuandoTipo = "period"
      result.cuandoLabel = period.label
    } else {
      const monthIdx = parseInt(cuando)
      if (!isNaN(monthIdx) && monthIdx >= 0 && monthIdx <= 11) {
        result.cuando = String(monthIdx)
        result.cuandoTipo = "month"
        result.cuandoLabel = monthNamesFull[monthIdx]
      }
    }
  }

  const tipo = params.get("tipo")
  if (tipo) {
    const cat = categoryFilters.find((c) => c.id === tipo)
    if (cat) result.tipo = cat.id
  }

  return result
}

function TripCard({ trip }: { trip: Trip }) {
  const dest = destinations.find((d) => d.id === trip.destinationId)
  if (!dest) return null
  const country = countries.find((c) => c.id === dest.countryId)
  const isUrgent = trip.status === "almost-full" || trip.placesLeft <= 4

  return (
    <a
      href={`/destino/${dest.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {isUrgent && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Últimas plazas
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {trip.durationDays} días
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          {country && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <img
                src={`https://flagcdn.com/16x12/${country.flag.toLowerCase()}.png`}
                alt={country.name}
                className="h-3 w-4 rounded-sm object-cover"
              />
              {country.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold text-foreground leading-tight group-hover:text-teal-vivid transition-colors">
          {dest.name}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
          {dest.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {dest.categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex rounded-full bg-teal-deep/5 px-2 py-0.5 text-[10px] font-semibold text-teal-deep"
            >
              {cat === "playa" ? "🏖️ Playa" : cat === "aventura" ? "🌿 Aventura" : cat === "cultural" ? "🏛️ Cultural" : cat === "nieve" ? "🌌 Nieve" : "🌴 Naturaleza"}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-border/30">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {format(new Date(trip.departureDate), "d 'de' MMMM", { locale: es })}
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-extrabold text-foreground">
                {trip.promoPrice ?? trip.priceFrom}
                <span className="text-sm font-semibold text-muted-foreground"> €</span>
              </p>
              {trip.promoPrice && (
                <span className="text-sm text-muted-foreground line-through">{trip.priceFrom}€</span>
              )}
            </div>
            {trip.promoLabel && (
              <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold text-coral">
                {trip.promoLabel}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">+ vuelo ~{trip.flightEstimate}€</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-deep/8 px-2.5 py-1 text-[11px] font-semibold text-teal-deep transition-colors group-hover:bg-coral group-hover:text-white">
              Ver viaje
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function SearchPage() {
  const urlParams = useMemo(() => parseUrlParams(), [])

  const [whereValue, setWhereValue] = useState<{ type: "continent" | "destination"; id: string; label: string } | null>(
    urlParams.donde ? { type: urlParams.dondeTipo!, id: urlParams.donde, label: urlParams.dondeLabel! } : null
  )
  const [whenValue, setWhenValue] = useState<{ type: "period" | "month"; id: string; label: string } | null>(
    urlParams.cuando ? { type: urlParams.cuandoTipo!, id: urlParams.cuando, label: urlParams.cuandoLabel! } : null
  )
  const [categoryValue, setCategoryValue] = useState<string>(urlParams.tipo || "all")

  const [searchQuery, setSearchQuery] = useState(urlParams.dondeTipo === "destination" ? urlParams.dondeLabel || "" : "")
  const [whereOpen, setWhereOpen] = useState(false)
  const [whenOpen, setWhenOpen] = useState(false)
  const [whenTab, setWhenTab] = useState<"flexible" | "meses">(urlParams.cuandoTipo === "month" ? "meses" : "flexible")

  const whereRef = useRef<HTMLDivElement>(null)
  const whenRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useClickOutside(whereRef, () => setWhereOpen(false), whereOpen)
  useClickOutside(whenRef, () => setWhenOpen(false), whenOpen)

  const suggestions = searchQuery.length >= 1 ? searchDestinations(searchQuery) : []

  const filteredTrips = useMemo(() => {
    return filterTripsAdvanced({
      destinationId: whereValue?.type === "destination" ? whereValue.id : undefined,
      continentId: whereValue?.type === "continent" ? whereValue.id : undefined,
      tag: whenValue?.type === "period" ? (whenValue.id as TripTag) : undefined,
      monthIndex: whenValue?.type === "month" ? parseInt(whenValue.id) : undefined,
      category: categoryValue !== "all" ? (categoryValue as DestinationCategory) : undefined,
    })
  }, [whereValue, whenValue, categoryValue])

  const TRIPS_PER_PAGE = 9
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(filteredTrips.length / TRIPS_PER_PAGE)
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * TRIPS_PER_PAGE,
    currentPage * TRIPS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [whereValue, whenValue, categoryValue])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page)
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const totalAvailableTrips = trips.filter((t) => t.status !== "full").length
  const activeFilterCount = [whereValue, whenValue, categoryValue !== "all" ? categoryValue : null].filter(Boolean).length

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === "#resultados" && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [])

  const clearAll = useCallback(() => {
    setWhereValue(null)
    setWhenValue(null)
    setCategoryValue("all")
    setSearchQuery("")
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/viajes")
    }
  }, [])

  const updateUrl = useCallback(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams()
    if (whereValue) params.set("donde", whereValue.id)
    if (whenValue) params.set("cuando", whenValue.id)
    if (categoryValue !== "all") params.set("tipo", categoryValue)
    const qs = params.toString()
    window.history.replaceState({}, "", qs ? `/viajes?${qs}` : "/viajes")
  }, [whereValue, whenValue, categoryValue])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO MINI ─── */}
      <section className="relative overflow-hidden bg-teal-deep pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(42,125,148,0.4)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(232,112,74,0.15)_0%,_transparent_50%)]" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-teal-vivid/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-coral/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-semibold tracking-wide text-yellow-sun backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5" />
            {totalAvailableTrips} viajes disponibles
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold text-sand sm:text-4xl lg:text-5xl leading-tight text-balance">
            Encuentra tu próximo viaje en grupo
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-sand/70 leading-relaxed">
            Filtra por destino, fecha o tipo de experiencia. Todos los viajes incluyen coordinador y alojamiento.
          </p>
        </div>
      </section>

      {/* ─── SEARCH BAR (FLOATING) ─── */}
      <div className="relative z-30 mx-auto -mt-10 max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border/30 bg-card p-2 shadow-xl sm:rounded-full">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">

            {/* DONDE */}
            <div ref={whereRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => { setWhereOpen(!whereOpen); setWhenOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:rounded-full sm:px-5"
              >
                <MapPin className="h-[18px] w-[18px] shrink-0 text-coral" />
                {whereValue ? (
                  <span className="flex-1 truncate text-sm font-medium text-foreground">{whereValue.label}</span>
                ) : (
                  <span className="flex-1 text-sm text-muted-foreground/60">¿Dónde quieres ir?</span>
                )}
                {whereValue && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); setWhereValue(null); setSearchQuery("") }}
                    className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>

              {whereOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border/50 bg-card p-1.5 shadow-lg sm:w-80">
                  <div className="mb-1 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Buscar destino o país..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setWhereValue(null) }}
                      autoFocus
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery("")} className="text-muted-foreground/40 hover:text-muted-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {searchQuery && suggestions.length > 0 ? (
                      <div className="py-1">
                        {suggestions.map((dest) => (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => {
                              setWhereValue({ type: "destination", id: dest.id, label: dest.name })
                              setSearchQuery(dest.name)
                              setWhereOpen(false)
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
                          >
                            <img src={dest.heroImage} alt={dest.name} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{dest.name}</p>
                              <p className="truncate text-xs text-muted-foreground/70">{dest.shortDescription}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery && suggestions.length === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-muted-foreground/60">
                        No encontramos ese destino
                      </p>
                    ) : (
                      <>
                        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Continentes</p>
                        <div className="grid grid-cols-2 gap-1 px-1">
                          {continents.filter((c) => destinations.some((d) => d.continentId === c.id)).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setWhereValue({ type: "continent", id: c.id, label: c.name })
                                setSearchQuery("")
                                setWhereOpen(false)
                              }}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                whereValue?.id === c.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
                              }`}
                            >
                              <span>{continentEmoji[c.id]}</span>
                              {c.name}
                            </button>
                          ))}
                        </div>

                        <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Populares</p>
                        {popularDestinations.map((dest) => (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => {
                              setWhereValue({ type: "destination", id: dest.id, label: dest.name })
                              setSearchQuery(dest.name)
                              setWhereOpen(false)
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
                          >
                            <img src={dest.heroImage} alt={dest.name} className="h-8 w-8 shrink-0 rounded-md object-cover" />
                            <p className="text-sm text-foreground">{dest.name}</p>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

            {/* CUANDO */}
            <div ref={whenRef} className="relative sm:w-52">
              <button
                type="button"
                onClick={() => { setWhenOpen(!whenOpen); setWhereOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:rounded-full sm:px-5"
              >
                <Calendar className="h-[18px] w-[18px] shrink-0 text-coral" />
                {whenValue ? (
                  <span className="flex-1 truncate text-sm font-medium text-foreground">{whenValue.label}</span>
                ) : (
                  <span className="flex-1 text-sm text-muted-foreground/60">¿Cuándo?</span>
                )}
                {whenValue && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); setWhenValue(null) }}
                    className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>

              {whenOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border/50 bg-card shadow-lg sm:w-80">
                  <div className="flex border-b border-border/40">
                    <button
                      type="button"
                      onClick={() => setWhenTab("flexible")}
                      className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        whenTab === "flexible" ? "border-b-2 border-teal-deep text-teal-deep" : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Temporada
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhenTab("meses")}
                      className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        whenTab === "meses" ? "border-b-2 border-teal-deep text-teal-deep" : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Por mes
                    </button>
                  </div>

                  <div className="p-1.5">
                    {whenTab === "flexible" ? (
                      <div className="flex flex-col gap-0.5">
                        {periods.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setWhenValue({ type: "period", id: p.id, label: p.label }); setWhenOpen(false) }}
                            className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              whenValue?.id === p.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {monthNames.map((m, i) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => { setWhenValue({ type: "month", id: String(i), label: monthNamesFull[i] }); setWhenOpen(false) }}
                            className={`rounded-lg py-2.5 text-center text-sm transition-colors ${
                              whenValue?.id === String(i) && whenValue.type === "month"
                                ? "bg-teal-deep font-medium text-white"
                                : "text-foreground/80 hover:bg-muted/40"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH CTA */}
            <div className="p-1">
              <button
                onClick={() => { setWhereOpen(false); setWhenOpen(false); scrollToResults() }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-white transition-all hover:bg-coral/90 hover:shadow-lg sm:rounded-full sm:px-7"
              >
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div ref={resultsRef} id="resultados" className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-20 scroll-mt-5">

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
          {categoryFilters.map((c) => {
            const isActive = categoryValue === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCategoryValue(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-teal-deep text-white shadow-md shadow-teal-deep/25 scale-105"
                    : "bg-card text-foreground/70 hover:bg-teal-deep/10 hover:text-foreground border border-border/40"
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Active filters + result count */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {activeFilterCount > 0 && (
              <>
                <span className="text-sm text-muted-foreground">Filtros:</span>
                {whereValue && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-deep/8 px-3 py-1 text-xs font-medium text-teal-deep">
                    <MapPin className="h-3 w-3" />
                    {whereValue.label}
                    <button onClick={() => { setWhereValue(null); setSearchQuery("") }} className="hover:text-coral">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {whenValue && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-deep/8 px-3 py-1 text-xs font-medium text-teal-deep">
                    <Calendar className="h-3 w-3" />
                    {whenValue.label}
                    <button onClick={() => setWhenValue(null)} className="hover:text-coral">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {categoryValue !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-deep/8 px-3 py-1 text-xs font-medium text-teal-deep">
                    {categoryFilters.find((c) => c.id === categoryValue)?.emoji}
                    {categoryFilters.find((c) => c.id === categoryValue)?.label}
                    <button onClick={() => setCategoryValue("all")} className="hover:text-coral">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-coral hover:text-coral/80 transition-colors"
                >
                  Limpiar todo
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filteredTrips.length}</span>{" "}
            {filteredTrips.length === 1 ? "viaje encontrado" : "viajes encontrados"}
            {totalPages > 1 && (
              <span className="text-muted-foreground/60">
                {" "}· Página {currentPage} de {totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Results grid */}
        {filteredTrips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-sm font-medium text-foreground/70 transition-all hover:bg-teal-deep/5 hover:text-teal-deep disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Página anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                        page === currentPage
                          ? "bg-teal-deep text-white shadow-md shadow-teal-deep/25"
                          : "border border-border/50 text-foreground/70 hover:bg-teal-deep/5 hover:text-teal-deep"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-sm font-medium text-foreground/70 transition-all hover:bg-teal-deep/5 hover:text-teal-deep disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Página siguiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Mostrando {(currentPage - 1) * TRIPS_PER_PAGE + 1}–{Math.min(currentPage * TRIPS_PER_PAGE, filteredTrips.length)} de {filteredTrips.length} viajes
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Compass className="h-10 w-10 text-teal-deep/50" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                No hay viajes con esos filtros
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                Prueba a cambiar tus filtros o explora todas las opciones disponibles. Estamos preparando nuevos destinos constantemente.
              </p>
            </div>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Ver todos los viajes
            </button>
          </div>
        )}

        {/* ─── TRUST STRIP ─── */}
        <div className="mt-16 rounded-2xl bg-card border border-border/30 p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-deep/8">
                <Users className="h-6 w-6 text-teal-deep" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Grupos reducidos</p>
                <p className="text-xs text-muted-foreground">12-18 personas de 20-35 años</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral/8">
                <Shield className="h-6 w-6 text-coral" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Todo incluido</p>
                <p className="text-xs text-muted-foreground">Coordinador y alojamiento incluidos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-sun/15">
                <Compass className="h-6 w-6 text-yellow-sun" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Itinerarios únicos</p>
                <p className="text-xs text-muted-foreground">Diseñados por viajeros expertos</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SEO CONTENT ─── */}
        <div className="mt-16 mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-extrabold text-foreground sm:text-3xl">
            Viajes en grupo para gente de tu edad
          </h2>
          <div className="mt-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              En Travelhood organizamos viajes en grupo para personas de 20 a 35 años que quieren descubrir el mundo sin preocuparse por la logística. Cada viaje incluye alojamiento, transporte interno, actividades y un coordinador que te acompaña en todo momento.
            </p>
            <p>
              Desde playas paradisíacas en Maldivas hasta auroras boreales en Laponia, pasando por safaris en Zanzíbar o templos en Japón. Nuestros itinerarios están diseñados para vivir experiencias auténticas, conocer gente increíble y volver con recuerdos que duran para siempre.
            </p>
          </div>
        </div>

        {/* ─── BOTTOM CTA ─── */}
        <div className="mt-16 rounded-2xl bg-teal-deep p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(232,112,74,0.15)_0%,_transparent_60%)]" />
          <div className="relative">
            <h3 className="font-serif text-2xl font-extrabold text-sand sm:text-3xl">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-sand/70 leading-relaxed">
              Cuéntanos tu viaje ideal y te ayudamos a encontrarlo. También puedes unirte a nuestra lista de espera para nuevos destinos.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Hablar por WhatsApp
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border-2 border-sand/40 px-7 py-3 text-sm font-bold text-sand transition-all hover:bg-sand/10"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
