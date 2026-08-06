import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  filterTripsForSearch,
  getAvailableMonthsForSearch,
  parseTripDate,
  type SearchAvailabilityDestination,
  type SearchAvailabilityTrip,
} from "@/lib/search-availability"
import type { DateSelection, DestinationSelection } from "@/lib/search-intent"
import type { DestinationCategory, TripTag } from "@/lib/travel-data"

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"] as const

const PRESET_LABELS = {
  proximas: "Próximas salidas",
  puentes: "Puentes",
  "navidad-fin-de-anio": "Navidad y Fin de Año",
} as const

const PERIOD_LABELS: Partial<Record<TripTag, string>> = {
  "semana-santa": "Semana Santa",
  "puente-mayo": "Puente de mayo",
  verano: "Verano",
  septiembre: "Septiembre",
  "puente-octubre": "Puente de octubre",
  "puente-noviembre": "Puente de noviembre",
  navidad: "Navidad",
  "fin-de-anio": "Fin de Año",
}

interface SearchDateSelectorProps {
  id: string
  open: boolean
  value: DateSelection
  trips: readonly SearchAvailabilityTrip[]
  destinations: readonly SearchAvailabilityDestination[]
  destination: DestinationSelection
  category?: DestinationCategory | "all"
  todayStart: Date
  onClose: () => void
  onApply: (selection: DateSelection) => void
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function toDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return year + "-" + month + "-" + day
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function formatRangeDate(value: string): string {
  const date = parseTripDate(value)
  if (!date) return value
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(date).replace(".", "")
}

function sameDateSelection(a: DateSelection, b: DateSelection): boolean {
  if (a.mode !== b.mode) return false
  if (a.mode === "any" || b.mode === "any") return a.mode === b.mode
  if (a.kind !== b.kind) return false
  if (a.kind === "period" && b.kind === "period") return a.periodId === b.periodId
  if (a.kind === "preset" && b.kind === "preset") return a.presetId === b.presetId
  if (a.kind === "month" && b.kind === "month") return a.monthIndex === b.monthIndex && a.year === b.year
  if (a.kind === "range" && b.kind === "range") return a.startDate === b.startDate && a.endDate === b.endDate
  return false
}

export function formatDateSelectionLabel(selection: DateSelection, emptyLabel = "Cualquier fecha"): string {
  if (selection.mode === "any") return emptyLabel
  if (selection.kind === "month") {
    const month = capitalize(MONTH_NAMES[selection.monthIndex] ?? "")
    return selection.year ? month + " " + selection.year : month
  }
  if (selection.kind === "range") {
    return formatRangeDate(selection.startDate) + " – " + formatRangeDate(selection.endDate)
  }
  if (selection.kind === "preset") {
    return PRESET_LABELS[selection.presetId] ?? emptyLabel
  }
  return PERIOD_LABELS[selection.periodId] ?? capitalize(selection.periodId.replaceAll("-", " "))
}

interface MonthCalendarProps {
  month: Date
  todayStart: Date
  latestDate: Date
  departureDates: ReadonlySet<string>
  rangeStart: string | null
  rangeEnd: string | null
  onSelect: (date: Date) => void
}

function MonthCalendar({ month, todayStart, latestDate, departureDates, rangeStart, rangeEnd, onSelect }: MonthCalendarProps) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const cells = Array.from({ length: leadingDays + daysInMonth }, (_, index) => index - leadingDays + 1)

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-1" aria-hidden="true">
        {WEEKDAYS.map((day) => <span key={day} className="py-1 text-center text-[10px] font-bold text-muted-foreground/60">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day < 1) return <span key={"blank-" + index} />
          const date = new Date(year, monthIndex, day)
          const dateId = toDateOnly(date)
          const disabled = date < todayStart || date > latestDate
          const isStart = rangeStart === dateId
          const isEnd = rangeEnd === dateId
          const inRange = !!rangeStart && !!rangeEnd && dateId > rangeStart && dateId < rangeEnd
          const hasDeparture = departureDates.has(dateId)

          return (
            <button
              key={dateId}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(date)}
              aria-label={day + " de " + MONTH_NAMES[monthIndex] + " de " + year + (hasDeparture ? ", hay salidas" : "")}
              className={cn(
                "relative grid aspect-square min-h-9 place-items-center rounded-xl text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-vivid disabled:cursor-not-allowed disabled:text-muted-foreground/25",
                inRange && "rounded-none bg-teal-vivid/15 text-teal-deep",
                (isStart || isEnd) && "rounded-xl bg-teal-deep font-bold text-white",
                !disabled && !inRange && !isStart && !isEnd && "hover:bg-muted",
              )}
            >
              {day}
              {hasDeparture && !isStart && !isEnd && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-coral" />}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function SearchDateSelector({
  id,
  open,
  value,
  trips,
  destinations,
  destination,
  category = "all",
  todayStart,
  onClose,
  onApply,
}: SearchDateSelectorProps) {
  const [tab, setTab] = useState<"months" | "dates">("months")
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePosition, setMobilePosition] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const [draft, setDraft] = useState<DateSelection>(value)
  const [activeYear, setActiveYear] = useState<number | null>(
    value.mode === "specific" && value.kind === "month" && value.year ? value.year : null,
  )
  const [rangeStart, setRangeStart] = useState<string | null>(value.mode === "specific" && value.kind === "range" ? value.startDate : null)
  const [rangeEnd, setRangeEnd] = useState<string | null>(value.mode === "specific" && value.kind === "range" ? value.endDate : null)

  const availableMonths = useMemo(
    () => getAvailableMonthsForSearch(trips, destinations, todayStart, { destination, category }),
    [category, destination, destinations, todayStart, trips],
  )

  const earliestMonth = availableMonths[0]
    ? new Date(availableMonths[0].year, availableMonths[0].monthIndex, 1)
    : monthStart(todayStart)
  const latestMonth = availableMonths.at(-1)
    ? new Date(availableMonths.at(-1)!.year, availableMonths.at(-1)!.monthIndex, 1)
    : monthStart(todayStart)
  const latestDate = new Date(latestMonth.getFullYear(), latestMonth.getMonth() + 1, 0)
  const [calendarMonth, setCalendarMonth] = useState<Date>(earliestMonth)

  const matchingBaseTrips = useMemo(
    () => filterTripsForSearch(trips, destinations, todayStart, { destination, category, date: { mode: "any" } }),
    [category, destination, destinations, todayStart, trips],
  )

  const availableYears = useMemo(
    () => [...new Set(availableMonths.map((month) => month.year))],
    [availableMonths],
  )

  const visibleMonths = useMemo(
    () => availableMonths.filter((month) => month.year === activeYear),
    [activeYear, availableMonths],
  )

  const departureDates = useMemo(
    () => new Set(matchingBaseTrips.map((trip) => trip.departureDate.slice(0, 10))),
    [matchingBaseTrips],
  )

  const matchingCount = useMemo(
    () => filterTripsForSearch(trips, destinations, todayStart, { destination, category, date: draft }).length,
    [category, destination, destinations, draft, todayStart, trips],
  )

  useEffect(() => {
    if (!open) return
    setDraft(value)
    setTab(value.mode === "specific" && value.kind === "range" ? "dates" : "months")
    setActiveYear(
      value.mode === "specific" && value.kind === "month" && value.year && availableYears.includes(value.year)
        ? value.year
        : (availableYears[0] ?? null),
    )
    setRangeStart(value.mode === "specific" && value.kind === "range" ? value.startDate : null)
    setRangeEnd(value.mode === "specific" && value.kind === "range" ? value.endDate : null)
    if (value.mode === "specific" && value.kind === "month" && value.year) {
      setCalendarMonth(new Date(value.year, value.monthIndex, 1))
    } else if (value.mode === "specific" && value.kind === "range") {
      const parsed = parseTripDate(value.startDate)
      if (parsed) setCalendarMonth(monthStart(parsed))
    } else {
      setCalendarMonth(earliestMonth)
    }
  }, [availableYears, open, value])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose, open])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateViewport = () => setIsMobile(mediaQuery.matches)
    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)
    return () => mediaQuery.removeEventListener("change", updateViewport)
  }, [])

  useEffect(() => {
    if (!open || !isMobile) {
      setMobilePosition(null)
      return
    }

    const updatePosition = () => {
      const trigger = document.querySelector<HTMLElement>(`[aria-controls="${id}"]`)
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      setMobilePosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.max(220, viewportHeight - rect.bottom - 14),
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    window.visualViewport?.addEventListener("resize", updatePosition)
    window.visualViewport?.addEventListener("scroll", updatePosition)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      window.visualViewport?.removeEventListener("resize", updatePosition)
      window.visualViewport?.removeEventListener("scroll", updatePosition)
    }
  }, [id, isMobile, open])

  if (!open) return null

  const canMoveBack = calendarMonth > earliestMonth
  const canMoveForward = calendarMonth < latestMonth
  const rangeIncomplete = tab === "dates" && (!rangeStart || !rangeEnd)
  const applyDisabled = rangeIncomplete || matchingCount === 0
  const tripWord = matchingCount === 1 ? "viaje" : "viajes"
  const ctaLabel = draft.mode === "specific" && draft.kind === "month"
    ? "Ver " + matchingCount + " " + tripWord + " · " + MONTH_NAMES[draft.monthIndex] + " " + draft.year
    : "Ver " + matchingCount + " " + tripWord

  const handleRangeDay = (date: Date) => {
    const dateId = toDateOnly(date)
    if (!rangeStart || rangeEnd) {
      setRangeStart(dateId)
      setRangeEnd(null)
      return
    }
    if (dateId < rangeStart) {
      setRangeStart(dateId)
      return
    }
    setRangeEnd(dateId)
    setDraft({ mode: "specific", kind: "range", startDate: rangeStart, endDate: dateId })
  }

  const panel = (
        <section
          id={id}
          role="dialog"
          aria-label="Elegir fechas"
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl",
            isMobile ? "max-h-full" : "max-h-[min(70vh,32rem)]",
          )}
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-border/50 px-3 py-2 sm:px-4">
            <div className="grid flex-1 grid-cols-2 rounded-xl bg-muted p-1" role="tablist" aria-label="Cómo elegir fechas">
              <button type="button" role="tab" aria-selected={tab === "months"} onClick={() => setTab("months")} className={cn("min-h-10 rounded-lg text-sm font-bold", tab === "months" ? "bg-card text-teal-deep shadow-sm" : "text-muted-foreground")}>Meses</button>
              <button type="button" role="tab" aria-selected={tab === "dates"} onClick={() => setTab("dates")} className={cn("min-h-10 rounded-lg text-sm font-bold", tab === "dates" ? "bg-card text-teal-deep shadow-sm" : "text-muted-foreground")}>Fechas</button>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="grid min-h-11 min-w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
            {tab === "months" ? (
              <div role="tabpanel">
                {availableYears.length > 0 ? (
                  <>
                    <div className="mb-4 flex overflow-x-auto border-b border-border/60" role="tablist" aria-label="Año de salida">
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          type="button"
                          role="tab"
                          aria-selected={activeYear === year}
                          onClick={() => {
                            setActiveYear(year)
                            if (!(draft.mode === "specific" && draft.kind === "month" && draft.year === year)) {
                              setDraft({ mode: "any" })
                            }
                          }}
                          className={cn(
                            "min-h-11 min-w-24 flex-1 border-b-2 px-5 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid",
                            activeYear === year
                              ? "border-teal-deep text-teal-deep"
                              : "border-transparent text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {visibleMonths.map((month) => {
                          const monthSelection: DateSelection = { mode: "specific", kind: "month", monthIndex: month.monthIndex, year: month.year }
                          const selected = sameDateSelection(draft, monthSelection)
                          return (
                            <button
                              key={month.year + "-" + month.monthIndex}
                              type="button"
                              onClick={() => setDraft(monthSelection)}
                              className={cn(
                                "min-h-12 rounded-xl border px-2 py-2 text-center text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-vivid",
                                selected ? "border-teal-deep bg-teal-deep text-white" : "border-border/60 bg-card text-foreground hover:border-teal-vivid/60 hover:bg-teal-vivid/[0.04]",
                              )}
                            >
                              {capitalize(MONTH_NAMES[month.monthIndex])}
                            </button>
                          )
                      })}
                    </div>
                  </>
                ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">No hay salidas con estos filtros.</p>
                )}
              </div>
            ) : (
              <div role="tabpanel">
                <div className="mb-3 flex items-center justify-between">
                  <button type="button" disabled={!canMoveBack} onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))} aria-label="Mes anterior" className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-muted disabled:opacity-25"><ChevronLeft className="h-4 w-4" /></button>
                  <h3 className="font-serif text-base font-bold text-foreground">{capitalize(MONTH_NAMES[calendarMonth.getMonth()])} {calendarMonth.getFullYear()}</h3>
                  <button type="button" disabled={!canMoveForward} onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} aria-label="Mes siguiente" className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-muted disabled:opacity-25"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <MonthCalendar month={calendarMonth} todayStart={todayStart} latestDate={latestDate} departureDates={departureDates} rangeStart={rangeStart} rangeEnd={rangeEnd} onSelect={handleRangeDay} />
                <p className="mt-2 text-center text-[11px] text-muted-foreground">{rangeStart && !rangeEnd ? "Ahora elige la fecha final" : "Los puntos coral indican días con salidas"}</p>
              </div>
            )}
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
            <button type="button" onClick={() => { setDraft({ mode: "any" }); setRangeStart(null); setRangeEnd(null) }} className="min-h-11 shrink-0 text-xs font-semibold text-muted-foreground hover:text-foreground">Cualquier fecha</button>
            <button
              type="button"
              disabled={applyDisabled}
              onClick={() => onApply(draft)}
              className="flex min-h-11 min-w-0 items-center gap-2 rounded-full bg-coral px-4 text-xs font-bold text-white transition-colors hover:bg-coral/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-not-allowed disabled:bg-muted-foreground/30 sm:text-sm"
            >
              <span className="truncate">{rangeIncomplete ? "Completa el intervalo" : applyDisabled ? "Sin viajes" : ctaLabel}</span>
              {!applyDisabled && <ArrowRight className="h-4 w-4 shrink-0" />}
            </button>
          </footer>
        </section>
  )

  if (isMobile && mobilePosition) {
    return createPortal(
      <div
        className="fixed z-[100]"
        style={mobilePosition}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {panel}
      </div>,
      document.body,
    )
  }

  return <div className="absolute inset-x-0 top-full z-[70] mt-2 w-full sm:inset-x-auto sm:right-0 sm:w-[31rem]">{panel}</div>
}
