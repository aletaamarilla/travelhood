import { Check, Globe, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DestinationOption {
  id: string
  name: string
  slug: string
  heroImage: string
  shortDescription: string
  categories?: readonly string[]
}

interface ContinentOption {
  id: string
  name: string
}

interface SearchDestinationSelectorProps {
  id: string
  query: string
  destinations: readonly DestinationOption[]
  continents: readonly ContinentOption[]
  selected: { kind: "destination" | "continent"; id: string } | null
  popularLimit?: number
  onQueryChange: (query: string) => void
  onSelectAny: () => void
  onSelectDestination: (destination: DestinationOption) => void
  onSelectContinent: (continent: ContinentOption) => void
}

const CONTINENT_EMOJI: Record<string, string> = {
  europe: "🌍",
  asia: "🌏",
  africa: "🌍",
  "south-america": "🌎",
  "central-america": "🌎",
  oceania: "🌏",
}

function matchesDestination(destination: DestinationOption, query: string): boolean {
  return destination.name.toLowerCase().includes(query)
    || destination.slug.toLowerCase().includes(query)
    || destination.categories?.some((category) => category.toLowerCase().includes(query)) === true
}

export default function SearchDestinationSelector({
  id,
  query,
  destinations,
  continents,
  selected,
  popularLimit = 5,
  onQueryChange,
  onSelectAny,
  onSelectDestination,
  onSelectContinent,
}: SearchDestinationSelectorProps) {
  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0
  const matchingDestinations = isSearching
    ? destinations.filter((destination) => matchesDestination(destination, normalizedQuery))
    : []
  const matchingContinents = isSearching
    ? continents.filter((continent) => continent.name.toLowerCase().includes(normalizedQuery))
    : []
  const popularDestinations = destinations.slice(0, popularLimit)
  const hasSearchResults = matchingDestinations.length > 0 || matchingContinents.length > 0

  const destinationRow = (destination: DestinationOption) => {
    const isSelected = selected?.kind === "destination" && selected.id === destination.id
    return (
      <button
        key={destination.id}
        type="button"
        onClick={() => onSelectDestination(destination)}
        className={cn(
          "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid",
          isSelected ? "bg-teal-deep/5 text-teal-deep" : "hover:bg-muted/50",
        )}
      >
        <img
          src={destination.heroImage}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="h-9 w-9 shrink-0 rounded-lg object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{destination.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{destination.shortDescription}</span>
        </span>
        {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
      </button>
    )
  }

  return (
    <div
      id={id}
      className="absolute left-0 top-full z-50 mt-2 max-h-[min(72vh,30rem)] w-full min-w-72 overflow-y-auto rounded-2xl border border-border/60 bg-card p-2 shadow-xl sm:w-96"
    >
      <div className="sticky top-0 z-10 mb-2 flex min-h-11 items-center gap-2 rounded-xl bg-muted px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor={id + "-search"} className="sr-only">Buscar destino o continente</label>
        <input
          id={id + "-search"}
          type="search"
          placeholder="Busca destino o continente"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          autoFocus
          className="min-h-11 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Borrar búsqueda"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg text-muted-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-teal-vivid"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isSearching ? (
        hasSearchResults ? (
          <div>
            {matchingContinents.length > 0 && (
              <section className="mb-2">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Continentes</p>
                <div className="grid grid-cols-2 gap-1">
                  {matchingContinents.map((continent) => (
                    <button
                      key={continent.id}
                      type="button"
                      onClick={() => onSelectContinent(continent)}
                      className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold text-foreground hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-teal-vivid"
                    >
                      <span aria-hidden="true">{CONTINENT_EMOJI[continent.id] ?? "🌍"}</span>
                      {continent.name}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {matchingDestinations.length > 0 && (
              <section>
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Destinos</p>
                {matchingDestinations.map(destinationRow)}
              </section>
            )}
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No hay salidas que coincidan.</p>
        )
      ) : (
        <div>
          <button
            type="button"
            onClick={onSelectAny}
            className={cn(
              "mb-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid",
              selected === null ? "bg-teal-deep/5 text-teal-deep" : "hover:bg-muted/50",
            )}
          >
            <Globe className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
            <span className="flex-1">Cualquier destino</span>
            {selected === null && <Check className="h-4 w-4" aria-hidden="true" />}
          </button>

          {popularDestinations.length > 0 && (
            <section>
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Destinos con próximas salidas</p>
              {popularDestinations.map(destinationRow)}
            </section>
          )}

          {continents.length > 0 && (
            <section className="mt-2 border-t border-border/50 pt-2">
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Explorar por continente</p>
              <div className="grid grid-cols-2 gap-1">
                {continents.map((continent) => {
                  const isSelected = selected?.kind === "continent" && selected.id === continent.id
                  return (
                    <button
                      key={continent.id}
                      type="button"
                      onClick={() => onSelectContinent(continent)}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid",
                        isSelected ? "bg-teal-deep/5 text-teal-deep" : "hover:bg-muted/50",
                      )}
                    >
                      <span aria-hidden="true">{CONTINENT_EMOJI[continent.id] ?? "🌍"}</span>
                      <span className="min-w-0 flex-1 truncate">{continent.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
