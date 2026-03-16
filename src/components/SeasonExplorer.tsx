import { useState } from "react"
import {
  trips,
  destinations,
  getTripsByCategory,
  getTripsByTag,
  type Trip,
} from "@/lib/travel-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const MAX_VISIBLE = 8

interface CategoryFilter {
  id: string
  label: string
  emoji: string
  getTrips: () => Trip[]
}

const allTrips = () =>
  trips
    .filter((t) => t.status !== "full")
    .sort(
      (a, b) =>
        new Date(a.departureDate).getTime() -
        new Date(b.departureDate).getTime()
    )

const combineTags = (...tags: Trip["tags"][number][]) =>
  tags
    .flatMap((tag) => getTripsByTag(tag))
    .sort(
      (a, b) =>
        new Date(a.departureDate).getTime() -
        new Date(b.departureDate).getTime()
    )

const categories: CategoryFilter[] = [
  { id: "all", label: "Todos", emoji: "✨", getTrips: allTrips },
  { id: "playa", label: "Playa & Sol", emoji: "🏖️", getTrips: () => getTripsByCategory("playa") },
  { id: "aventura", label: "Safari & Aventura", emoji: "🌿", getTrips: () => getTripsByCategory("aventura") },
  { id: "auroras", label: "Auroras & Nieve", emoji: "🌌", getTrips: () => getTripsByCategory("nieve") },
  { id: "puentes", label: "Puentes", emoji: "🎒", getTrips: () => combineTags("puente-mayo", "puente-octubre", "puente-noviembre") },
  { id: "verano", label: "Verano", emoji: "☀️", getTrips: () => getTripsByTag("verano") },
  { id: "cultural", label: "Cultura & Historia", emoji: "🏛️", getTrips: () => getTripsByCategory("cultural") },
  { id: "navidad", label: "Navidad & Fin de Año", emoji: "🎄", getTrips: () => combineTags("navidad", "fin-de-anio") },
]

export default function SeasonExplorer() {
  const [activeId, setActiveId] = useState("all")
  const current = categories.find((c) => c.id === activeId)!
  const allFiltered = current.getTrips()
  const visible = allFiltered.slice(0, MAX_VISIBLE)
  const hasMore = allFiltered.length > MAX_VISIBLE

  return (
    <section id="todos-los-viajes" className="bg-background py-14">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary">
            Explora por inspiración
          </span>
          <h2 className="mt-3 font-serif text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl text-balance">
            Encuentra tu próxima aventura
          </h2>
        </div>

        {/* Category chips — wrapped, centered, casual */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
          {categories.map((c) => {
            const isActive = activeId === c.id
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-teal-deep text-white shadow-md shadow-teal-deep/25 scale-105"
                    : "bg-muted text-foreground/70 hover:bg-teal-deep/10 hover:text-foreground"
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Trips grid — limited to MAX_VISIBLE */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">{current.emoji}</span>
            <p className="text-lg font-semibold text-foreground">
              Próximamente
            </p>
            <p className="text-sm text-muted-foreground">
              Estamos preparando viajes para esta categoría. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {visible.map((trip) => {
              const dest = destinations.find(
                (d) => d.id === trip.destinationId
              )
              if (!dest) return null
              const isUrgent =
                trip.status === "almost-full" || trip.placesLeft <= 4

              return (
                <a
                  key={trip.id}
                  href={`/destino/${dest.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {isUrgent && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                          Últimas plazas
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="font-serif text-base font-bold text-white sm:text-lg leading-tight">
                        {dest.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/70 sm:text-xs">
                        <span>
                          {format(new Date(trip.departureDate), "d MMM", {
                            locale: es,
                          })}
                        </span>
                        <span className="text-white/40">·</span>
                        <span>{trip.durationDays} días</span>
                      </p>
                      <div className="mt-1.5 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-base font-extrabold text-white sm:text-lg">
                            {trip.promoPrice ?? trip.priceFrom}
                            <span className="text-xs font-semibold text-white/60">
                              {" "}€
                            </span>
                          </p>
                          {trip.promoPrice && (
                            <span className="text-xs text-white/40 line-through">{trip.priceFrom}€</span>
                          )}
                        </div>
                        <span className="hidden text-[10px] text-white/50 sm:inline">
                          + vuelo ~{trip.flightEstimate}€
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center gap-5 text-center">
          {hasMore && (
            <p className="text-sm text-muted-foreground">
              Mostrando {visible.length} de {allFiltered.length} viajes en esta categoría
            </p>
          )}
          <a
            href="/viajes/#resultados"
            className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-coral/20 transition-all hover:brightness-110 hover:shadow-lg"
          >
            Ver todos los viajes
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
          <p className="max-w-xs text-xs text-muted-foreground">
            ¿No encuentras lo que buscas? Explora el catálogo completo con filtros avanzados.
          </p>
        </div>
      </div>

    </section>
  )
}
