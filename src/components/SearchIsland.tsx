import { useState, useRef, useEffect, useMemo } from "react"
import { Search, MapPin, Calendar, X } from "lucide-react"
import type { Destination, Continent } from "@/lib/travel-data"

// ── Periods ──
const periods = [
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

const continentEmoji: Record<string, string> = {
  europe: "🌍", asia: "🌏", africa: "🌍", "south-america": "🌎", "central-america": "🌎", oceania: "🌏",
}

interface SearchIslandProps {
  destinations: Destination[]
  continents: Continent[]
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

export default function SearchIsland({ destinations, continents }: SearchIslandProps) {
  const [query, setQuery] = useState("")
  const [selectedWhere, setSelectedWhere] = useState<{ type: "continent" | "destination"; id: string; label: string } | null>(null)
  const [selectedWhen, setSelectedWhen] = useState<{ type: "period" | "month"; id: string; label: string } | null>(null)

  const [whereOpen, setWhereOpen] = useState(false)
  const [whenOpen, setWhenOpen] = useState(false)
  const [whenTab, setWhenTab] = useState<"flexible" | "meses">("flexible")

  const whereRef = useRef<HTMLDivElement>(null)
  const whenRef = useRef<HTMLDivElement>(null)

  useClickOutside(whereRef, () => setWhereOpen(false), whereOpen)
  useClickOutside(whenRef, () => setWhenOpen(false), whenOpen)

  const popularDestinations = useMemo(() => destinations.slice(0, 4), [destinations])

  const suggestions = useMemo(() => {
    if (query.length < 1) return []
    const q = query.toLowerCase().trim()
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.categories.some((c) => c.toLowerCase().includes(q))
    )
  }, [query, destinations])

  const displayWhere = selectedWhere?.label || query || ""
  const displayWhen = selectedWhen?.label || ""

  const handleSearch = () => {
    setWhereOpen(false)
    setWhenOpen(false)
    const params = new URLSearchParams()
    if (selectedWhere) params.set("donde", selectedWhere.id)
    if (selectedWhen) params.set("cuando", selectedWhen.id)
    const qs = params.toString()
    window.location.href = (qs ? `/viajes?${qs}` : "/viajes") + "#resultados"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const clearWhere = () => { setQuery(""); setSelectedWhere(null) }
  const clearWhen = () => { setSelectedWhen(null) }

  return (
    <>
      {/* ===== HERO + SEARCH ===== */}
      <section className="relative">
        <img src="/images/hero-main.jpg" alt="Paisaje de aventura" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/55" />

        <div className="relative z-10 flex min-h-[55vh] flex-col items-center px-6 pt-24 sm:min-h-[58vh] sm:pt-28 lg:min-h-[65vh]">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 text-center">
            <h1 className="font-serif text-[2.25rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Tú pones las ganas,
              <br />
              nosotros el grupo.
            </h1>
            <p className="max-w-md text-base text-white/85 leading-relaxed sm:text-lg">
              Viaja en grupos reducidos con personas de tu edad. Itinerario, alojamiento y coordinador incluidos.
            </p>
          </div>

          <div className="z-20 mx-auto w-full max-w-2xl translate-y-1/2">
          <p className="mb-3 text-center text-[13px] tracking-wide text-white/65">
            +500 viajeros&ensp;·&ensp;{destinations.length} destinos&ensp;·&ensp;Coordinador en destino
          </p>
          <div className="rounded-2xl bg-card p-1.5 shadow-2xl sm:rounded-full">
            <div className="flex flex-col sm:flex-row sm:items-center">

            {/* ── DÓNDE ── */}
            <div ref={whereRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => { setWhereOpen(!whereOpen); setWhenOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:rounded-full sm:px-5"
              >
                <MapPin className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                {displayWhere ? (
                  <span className="flex-1 truncate text-sm text-foreground">{displayWhere}</span>
                ) : (
                  <span className="flex-1 text-sm text-muted-foreground/60">¿Dónde?</span>
                )}
                {displayWhere && (
                  <span role="button" onClick={(e) => { e.stopPropagation(); clearWhere() }} className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground">
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>

              {whereOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border/50 bg-card p-1.5 shadow-lg sm:w-80">
                  <div className="mb-1 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Buscar destino..."
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSelectedWhere(null) }}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery("")} className="text-muted-foreground/40 hover:text-muted-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {query && suggestions.length > 0 ? (
                    <div className="py-1">
                      {suggestions.map((dest) => (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => { setSelectedWhere({ type: "destination", id: dest.id, label: dest.name }); setQuery(dest.name); setWhereOpen(false) }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
                        >
                          <img src={dest.heroImage} alt={dest.name} className="h-8 w-8 shrink-0 rounded-md object-cover" />
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
                        {continents.filter((c) => destinations.some((d) => d.continentId === c.id)).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => { setSelectedWhere({ type: "continent", id: c.id, label: c.name }); setQuery(""); setWhereOpen(false) }}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              selectedWhere?.id === c.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
                            }`}
                          >
                            <span>{continentEmoji[c.id]}</span>
                            {c.name}
                          </button>
                        ))}
                      </div>

                      <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Destinos populares</p>
                      {popularDestinations.map((dest) => (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => { setSelectedWhere({ type: "destination", id: dest.id, label: dest.name }); setQuery(dest.name); setWhereOpen(false) }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
                        >
                          <img src={dest.heroImage} alt={dest.name} className="h-8 w-8 shrink-0 rounded-md object-cover" />
                          <p className="text-sm text-foreground">{dest.name}</p>
                        </button>
                      ))}
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
                onClick={() => { setWhenOpen(!whenOpen); setWhereOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:rounded-full sm:px-5"
              >
                <Calendar className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                {displayWhen ? (
                  <span className="flex-1 truncate text-sm text-foreground">{displayWhen}</span>
                ) : (
                  <span className="flex-1 text-sm text-muted-foreground/60">¿Cuándo?</span>
                )}
                {displayWhen && (
                  <span role="button" onClick={(e) => { e.stopPropagation(); clearWhen() }} className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground">
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
                      Flexible
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
                            onClick={() => { setSelectedWhen({ type: "period", id: p.id, label: p.label }); setWhenOpen(false) }}
                            className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              selectedWhen?.id === p.id ? "bg-teal-deep/5 font-medium text-teal-deep" : "text-foreground/80 hover:bg-muted/40"
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
                            onClick={() => { setSelectedWhen({ type: "month", id: String(i), label: m }); setWhenOpen(false) }}
                            className={`rounded-lg py-2.5 text-center text-sm transition-colors ${
                              selectedWhen?.id === String(i) && selectedWhen.type === "month"
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

            {/* CTA */}
            <div className="p-1">
              <button
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-coral/90 sm:rounded-full sm:px-7"
              >
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>

          </div>
        </div>
      </section>
    </>
  )
}
