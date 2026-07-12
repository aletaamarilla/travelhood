import type { TripTag } from "@/lib/travel-data"

type SuggestableDestination = {
  name: string
  slug: string
  categories: readonly string[]
}

/** Pure filter for destination combobox suggestions (no React deps). */
export function filterDestinationSuggestions<T extends SuggestableDestination>(
  destinations: readonly T[],
  query: string,
): T[] {
  if (query.length < 1) return []
  const q = query.toLowerCase().trim()
  return destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(q) ||
      destination.slug.toLowerCase().includes(q) ||
      destination.categories.some((category) => category.toLowerCase().includes(q)),
  )
}

export const ANY_WHERE_LABEL = "Cualquier sitio" as const
export const ANY_WHEN_LABEL = "Cualquier fecha" as const

export const SEARCH_PERIOD_OPTIONS: readonly { id: TripTag; label: string }[] = [
  { id: "semana-santa", label: "Semana Santa" },
  { id: "puente-mayo", label: "Puente de mayo" },
  { id: "verano", label: "Verano" },
  { id: "septiembre", label: "Septiembre" },
  { id: "puente-octubre", label: "Puente de octubre" },
  { id: "puente-noviembre", label: "Puente de noviembre" },
  { id: "navidad", label: "Navidad" },
  { id: "fin-de-anio", label: "Fin de Año" },
]

export const SEARCH_MONTH_OPTIONS = [
  { index: 0, label: "enero", shortLabel: "Ene" },
  { index: 1, label: "febrero", shortLabel: "Feb" },
  { index: 2, label: "marzo", shortLabel: "Mar" },
  { index: 3, label: "abril", shortLabel: "Abr" },
  { index: 4, label: "mayo", shortLabel: "May" },
  { index: 5, label: "junio", shortLabel: "Jun" },
  { index: 6, label: "julio", shortLabel: "Jul" },
  { index: 7, label: "agosto", shortLabel: "Ago" },
  { index: 8, label: "septiembre", shortLabel: "Sep" },
  { index: 9, label: "octubre", shortLabel: "Oct" },
  { index: 10, label: "noviembre", shortLabel: "Nov" },
  { index: 11, label: "diciembre", shortLabel: "Dic" },
] as const
