import { useState, useEffect, useRef, useCallback } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MapPin, Calendar, Users, Star, Share2, Download,
  ChevronRight, X, ArrowLeft, ArrowRight,
  Check, Plane, Hotel, Bus, Shield, Camera,
  Compass, Thermometer, Clock, Utensils,
  Wallet, Zap, Globe, UserCheck, Ticket,
  Mountain, Waves, Landmark, TreePalm, Snowflake,
  Image as ImageIcon,
} from "lucide-react"
import type { Destination, Trip, Testimonial, Coordinator, Country, Continent } from "@/lib/travel-data"
import type { DestinationFAQ } from "@/lib/destination-details"

// ── Types ──────────────────────────────────────────────

interface ExtendedTrip extends Omit<Trip, "itinerary"> {
  promoPrice?: number
  promoLabel?: string
  itinerary: { day: number; title: string; description: string; lat: number; lng: number }[]
}

interface TripDetailPageProps {
  destination: Destination
  photos: string[]
  faqs: DestinationFAQ[]
  trips: ExtendedTrip[]
  testimonials: Testimonial[]
  coordinators: Coordinator[]
  country: Country
  continent: Continent
}

// ── Helpers ────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

function formatPrice(n: number): string {
  return n.toLocaleString("es-ES") + "€"
}

function getCheapestTrip(trips: ExtendedTrip[]): ExtendedTrip | undefined {
  return trips.reduce<ExtendedTrip | undefined>((cheapest, t) => {
    const price = t.promoPrice || t.priceFrom
    const cheapPrice = cheapest ? (cheapest.promoPrice || cheapest.priceFrom) : Infinity
    return price < cheapPrice ? t : cheapest
  }, undefined)
}

function getFeaturedTrip(trips: ExtendedTrip[]): ExtendedTrip | undefined {
  const now = Date.now()
  const upcoming = trips
    .filter((t) => new Date(t.departureDate).getTime() > now)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
  return upcoming.find((t) => t.itinerary.some((d) => d.lat !== 0)) || upcoming[0] || trips[0]
}

const CATEGORY_ICONS: Record<string, typeof Compass> = {
  playa: Waves,
  aventura: Compass,
  cultural: Landmark,
  naturaleza: Mountain,
  nieve: Snowflake,
}

const INCLUDED_ICONS: Record<string, typeof Hotel> = {
  Alojamiento: Hotel,
  "Transporte interno": Bus,
  "Actividades incluidas": Ticket,
  "Coordinador Travelhood": UserCheck,
  "Japan Rail Pass": Globe,
  "Noche en jaima del desierto": TreePalm,
  "Crucero por el Nilo 3 noches": Waves,
  "Crucero por el Nilo": Waves,
  "Tren a Machu Picchu": Globe,
  "Actividades árticas": Snowflake,
  "Trineo de huskies": Zap,
}

const NOT_INCLUDED_ICONS: Record<string, typeof Plane> = {
  "Vuelo internacional": Plane,
  "Comidas no especificadas": Utensils,
  "Gastos personales": Wallet,
  "Ropa térmica (alquilable)": Snowflake,
  "Ropa térmica": Snowflake,
}

const GENERAL_FAQS = [
  {
    question: "¿Puedo ir solo/a al viaje?",
    answer: "Por supuesto. La mayoría de nuestros viajeros vienen solos. Esa es precisamente la gracia: llegas sin conocer a nadie y vuelves con un grupo de amigos. El coordinador se encarga de que todos se integren desde el primer momento.",
  },
  {
    question: "¿Qué está incluido en el precio?",
    answer: "Alojamiento, transporte interno, actividades programadas y coordinador Travelhood en destino. El vuelo internacional no está incluido, pero te asesoramos para encontrar las mejores opciones.",
  },
  {
    question: "¿Qué edad tiene la gente que va?",
    answer: "Nuestros viajes están diseñados para personas de 20 a 35 años. Es un rango cómodo donde todos conectan fácilmente y comparten el mismo momento vital.",
  },
  {
    question: "¿Cómo reservo y qué pasa si tengo que cancelar?",
    answer: "Reservas con un formulario simple y una señal inicial. Tenemos política de cancelación flexible: si cancelas con más de 30 días de antelación, te devolvemos el 100% de la señal.",
  },
  {
    question: "¿Son viajes seguros?",
    answer: "Totalmente. Todos los viajes incluyen un coordinador con experiencia en destino y protocolos de seguridad. Somos agencia registrada y trabajamos con proveedores locales verificados.",
  },
]

// ── Photo Gallery Modal ────────────────────────────────

function PhotoModal({
  photos,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  photos: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}) {
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) setCurrent(initialIndex)
  }, [isOpen, initialIndex])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(c + 1, photos.length - 1))
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0))
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen, onClose, photos.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-white/70">
          {current + 1} / {photos.length}
        </span>
        <button onClick={onClose} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4">
        {current > 0 && (
          <button
            onClick={() => setCurrent((c) => c - 1)}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <img
          src={photos[current]}
          alt={`Foto ${current + 1}`}
          className="max-h-[80vh] max-w-full rounded-lg object-contain"
          loading="lazy"
        />

        {current < photos.length - 1 && (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto px-6 py-4 scrollbar-hide">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              i === current ? "border-coral opacity-100" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Departures Modal ───────────────────────────────────

function DeparturesModal({
  trips,
  destinationName,
  isOpen,
  onClose,
}: {
  trips: ExtendedTrip[]
  destinationName: string
  isOpen: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.overflow = ""
      window.scrollTo(0, scrollY)
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-border px-4 py-3 sm:px-6 sm:py-5 rounded-t-2xl">
          <div>
            <h3 className="font-serif text-base sm:text-xl font-extrabold text-foreground">
              Salidas para {destinationName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {trips.length} {trips.length === 1 ? "salida disponible" : "salidas disponibles"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 sm:p-2 hover:bg-muted transition-colors">
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4 pb-24 sm:gap-4 sm:p-6 sm:pb-6 lg:pb-6">
          {trips.map((trip) => {
            const hasPromo = !!trip.promoPrice
            const isAlmostFull = trip.placesLeft <= 4
            return (
              <div
                key={trip.id}
                className="relative rounded-xl border border-border bg-card p-3 sm:p-5 transition-shadow hover:shadow-md"
              >
                {hasPromo && (
                  <span className="absolute -top-2 right-3 sm:-top-2.5 sm:right-4 rounded-full bg-coral px-2 py-0.5 text-[10px] sm:px-3 sm:text-[11px] font-bold text-white">
                    {trip.promoLabel}
                  </span>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm sm:text-base font-bold text-foreground truncate">{trip.title}</h4>
                    <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="sm:hidden" />
                        <Calendar size={14} className="hidden sm:block" />
                        {formatDate(trip.departureDate)}
                      </span>
                      <span className="text-border">→</span>
                      <span className="flex items-center gap-1">
                        {formatDate(trip.returnDate)}
                      </span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="sm:hidden" />
                        <Clock size={14} className="hidden sm:block" />
                        {trip.durationDays} días
                      </span>
                    </div>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      {isAlmostFull && (
                        <span className="flex items-center gap-1 font-semibold text-coral">
                          <Zap size={12} className="sm:hidden" />
                          <Zap size={14} className="hidden sm:block" />
                          <span className="text-[10px] sm:text-xs">¡Últimas plazas!</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:min-w-[140px]">
                    <div className="sm:text-right">
                      {hasPromo && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through mr-1 sm:mr-0 sm:block">
                          {formatPrice(trip.priceFrom)}
                        </span>
                      )}
                      <span className="text-lg sm:text-2xl font-extrabold text-foreground">
                        {formatPrice(hasPromo ? trip.promoPrice! : trip.priceFrom)}
                      </span>
                      <span className="hidden sm:block text-xs text-muted-foreground">+ vuelo ~{formatPrice(trip.flightEstimate)}</span>
                    </div>
                    <a
                      href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola! Me interesa el viaje ${trip.title}. ¿Puedo reservar?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white transition-all hover:brightness-110"
                    >
                      Reservar
                    </a>
                  </div>
                </div>

                {isAlmostFull && (
                  <div className="mt-2 hidden sm:flex items-center gap-1.5 text-xs font-semibold text-coral">
                    <Zap size={12} />
                    ¡Últimas plazas!
                  </div>
                )}
              </div>
            )
          })}

          {trips.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No hay salidas disponibles en este momento.</p>
              <p className="mt-1 text-sm text-muted-foreground">Activa la alerta para ser el primero en enterarte.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Route Map (Leaflet) ────────────────────────────────

function RouteMap({ points }: { points: { lat: number; lng: number; label: string }[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const validPoints = points.filter((p) => p.lat !== 0 && p.lng !== 0)

  const deduped: typeof validPoints = []
  for (const p of validPoints) {
    const isDupe = deduped.some(
      (d) => Math.abs(d.lat - p.lat) < 0.05 && Math.abs(d.lng - p.lng) < 0.05
    )
    if (!isDupe) deduped.push(p)
  }

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || deduped.length < 2) return

    let map: any = null

    import("leaflet").then((L) => {
      if (!mapRef.current) return

      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Wait a tick for CSS to load
      setTimeout(() => {
        if (!mapRef.current) return

        const bounds = L.latLngBounds(deduped.map((p) => [p.lat, p.lng] as [number, number]))

        map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          boxZoom: false,
          keyboard: false,
        }).fitBounds(bounds, { padding: [40, 40] })

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map)

        // Route polyline
        const routeCoords = deduped.map((p) => [p.lat, p.lng] as [number, number])
        L.polyline(routeCoords, {
          color: "#2A7D94",
          weight: 3,
          dashArray: "8 6",
          opacity: 0.7,
        }).addTo(map)

        // Numbered markers
        deduped.forEach((p, i) => {
          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width:28px;height:28px;
              background:#E8704A;
              border:2px solid white;
              border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              color:white;font-size:12px;font-weight:700;
              box-shadow:0 2px 6px rgba(0,0,0,0.25);
              font-family:sans-serif;
            ">${i + 1}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })

          L.marker([p.lat, p.lng], { icon })
            .addTo(map)
            .bindTooltip(p.label, {
              permanent: deduped.length <= 6,
              direction: "top",
              offset: [0, -16],
              className: "leaflet-tooltip-custom",
            })
        })

        // Inject custom tooltip style
        if (!document.getElementById("leaflet-custom-css")) {
          const style = document.createElement("style")
          style.id = "leaflet-custom-css"
          style.textContent = `
            .leaflet-tooltip-custom {
              background: #143D4A !important;
              color: white !important;
              border: none !important;
              border-radius: 6px !important;
              padding: 3px 8px !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              font-family: 'DM Sans', sans-serif !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            }
            .leaflet-tooltip-custom::before {
              border-top-color: #143D4A !important;
            }
          `
          document.head.appendChild(style)
        }

        setMounted(true)
      }, 100)
    })

    return () => {
      if (map) map.remove()
    }
  }, [])

  if (deduped.length < 2) return null

  return (
    <div className="relative z-0 rounded-xl border border-border/40 overflow-hidden">
      <div
        ref={mapRef}
        style={{ height: "280px", width: "100%" }}
        className="bg-muted/60"
      />
    </div>
  )
}

// ── Share Button ───────────────────────────────────────

function ShareButton({ destinationName, slug }: { destinationName: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== "undefined" ? window.location.href : `https://travelhood.es/destino/${slug}`
  const text = `Mira este viaje a ${destinationName} con Travelhood 🌍`

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [url])

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
        aria-label="Compartir por WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <button
        onClick={copyLink}
        className="flex h-9 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        {copied ? <Check size={14} /> : <Share2 size={14} />}
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────

export default function TripDetailPage({
  destination,
  photos,
  faqs,
  trips,
  testimonials,
  coordinators,
  country,
  continent,
}: TripDetailPageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [departuresOpen, setDeparturesOpen] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | undefined>(undefined)
  const [faqTab, setFaqTab] = useState<"destino" | "general">("destino")
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0)
  const mobileGalleryRef = useRef<HTMLDivElement>(null)

  const cheapest = getCheapestTrip(trips)
  const featured = getFeaturedTrip(trips)
  const featuredItinerary = featured?.itinerary || []
  const hasMap = featuredItinerary.some((d) => d.lat !== 0 && d.lng !== 0)

  const openGallery = (index: number) => {
    setGalleryIndex(index)
    setGalleryOpen(true)
  }

  const totalTravelers = trips.reduce((sum, t) => sum + (t.totalPlaces - t.placesLeft), 0)

  useEffect(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth)
      setMobilePhotoIndex(Math.min(index, photos.length - 1))
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [photos.length])

  // Placeholder fallback handler
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index))
  }

  const gradients = [
    "from-teal-vivid/30 to-coral/20",
    "from-coral/20 to-yellow-sun/20",
    "from-teal-deep/20 to-teal-vivid/20",
    "from-yellow-sun/20 to-coral/20",
    "from-coral/30 to-teal-vivid/20",
  ]

  const renderImage = (index: number, className: string) => {
    if (failedImages.has(index) || !photos[index]) {
      return (
        <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center ${className}`}>
          <Camera size={32} className="text-foreground/20" />
        </div>
      )
    }
    return (
      <img
        src={photos[index]}
        alt={`${destination.name} - foto ${index + 1}`}
        className={`object-cover ${className}`}
        loading={index < 3 ? "eager" : "lazy"}
        onError={() => handleImageError(index)}
      />
    )
  }

  return (
    <>
      {/* ── Hero Gallery ─────────────────────── */}
      <section className="pt-14">
        {/* Desktop bento grid */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-7xl px-6 pt-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 rounded-xl overflow-hidden" style={{ height: "260px" }}>
              <button
                onClick={() => openGallery(0)}
                className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
              >
                {renderImage(0, "h-full w-full transition-transform duration-500 group-hover:scale-105")}
              </button>
              <button onClick={() => openGallery(1)} className="relative group cursor-pointer overflow-hidden">
                {renderImage(1, "h-full w-full transition-transform duration-500 group-hover:scale-105")}
              </button>
              <button onClick={() => openGallery(2)} className="relative group cursor-pointer overflow-hidden">
                {renderImage(2, "h-full w-full transition-transform duration-500 group-hover:scale-105")}
              </button>
              <button onClick={() => openGallery(3)} className="relative group cursor-pointer overflow-hidden">
                {renderImage(3, "h-full w-full transition-transform duration-500 group-hover:scale-105")}
              </button>
              <button onClick={() => openGallery(4)} className="relative group cursor-pointer overflow-hidden">
                {renderImage(4, "h-full w-full transition-transform duration-500 group-hover:scale-105")}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                    <ImageIcon size={14} />
                    Ver {photos.length} fotos
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile full-width gallery */}
        <div className="md:hidden">
          <div className="relative">
            <div
              ref={mobileGalleryRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => openGallery(i)}
                  className="snap-start shrink-0 w-full"
                  style={{ height: "240px" }}
                >
                  {renderImage(i, "h-full w-full")}
                </button>
              ))}
            </div>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {mobilePhotoIndex + 1} / {photos.length}
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left content column */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <a href="/" className="hover:text-foreground transition-colors">Inicio</a>
              <ChevronRight size={12} />
              <a href="/viajes/#resultados" className="hover:text-foreground transition-colors">Viajes</a>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{destination.name}</span>
            </nav>

            {/* Title + duration */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-serif text-2xl font-extrabold text-foreground sm:text-3xl">
                    {destination.name}
                  </h1>
                  {featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-deep/8 px-2.5 py-0.5 text-[11px] font-bold text-teal-deep sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                      <Clock size={11} />
                      {featured.durationDays} días · {featured.durationDays - 1} noches
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-coral" />
                    {country.name}, {continent.name}
                  </span>
                  <span className="hidden sm:inline text-border">·</span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Thermometer size={13} />
                    {destination.climate}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <ShareButton destinationName={destination.name} slug={destination.slug} />
              </div>
            </div>

            {/* Category pills */}
            <div className="mt-3 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
              {destination.categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || Compass
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize"
                  >
                    <Icon size={12} />
                    {cat}
                  </span>
                )
              })}
            </div>

            {/* Description */}
            <section className="mt-5 sm:mt-8" id="descripcion">
              <p className="text-base text-foreground/80 leading-relaxed">
                {destination.description}
              </p>
            </section>

            {/* Highlights */}
            <section className="mt-6 sm:mt-8 -mx-6 px-5 sm:px-6 py-5 sm:py-6 bg-teal-deep rounded-none sm:mx-0 sm:rounded-xl">
              <h2 className="font-serif text-lg font-extrabold text-sand">
                Lo mejor de {destination.name}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                {destination.highlights.map((h, i) => {
                  const icons = [MapPin, Compass, Star, Globe]
                  const Icon = icons[i % icons.length]
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg bg-white/8 px-3.5 py-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral/20">
                        <Icon size={14} className="text-coral" />
                      </div>
                      <span className="text-sm font-medium text-sand/90">{h}</span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ── Itinerary ─────────────────────── */}
            <section className="mt-12" id="itinerario">
              <h2 className="font-serif text-xl font-extrabold text-foreground">
                Itinerario día a día
              </h2>
              {featured && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Basado en la salida de {formatDate(featured.departureDate)} · {featured.durationDays} días
                </p>
              )}

              {hasMap && (
                <div className="mt-6">
                  <RouteMap
                    points={featuredItinerary.map((d) => ({
                      lat: d.lat,
                      lng: d.lng,
                      label: d.title.split("—")[0].trim(),
                    }))}
                  />
                </div>
              )}

              <div className="mt-6">
                <Accordion
                  type="single"
                  collapsible
                  value={expandedDay}
                  onValueChange={setExpandedDay}
                  className="flex flex-col gap-2"
                >
                  {featuredItinerary.map((day) => (
                    <AccordionItem
                      key={day.day}
                      value={`day-${day.day}`}
                      className="rounded-xl bg-card px-5 border-none shadow-sm"
                    >
                      <AccordionTrigger className="text-left hover:no-underline gap-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-xs font-bold text-coral">
                            {day.day}
                          </span>
                          <span className="font-serif text-sm font-bold text-foreground">
                            {day.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-11">
                        {day.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* ── Included / Not Included ────────── */}
            {featured && (
              <section className="mt-12" id="incluido">
                <h2 className="font-serif text-xl font-extrabold text-foreground">
                  Qué incluye y qué no
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                        <Check size={14} className="text-emerald-600" />
                      </div>
                      Incluido
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {featured.included.map((item, i) => {
                        const Icon = INCLUDED_ICONS[item] || Check
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-lg bg-emerald-50/50 p-3">
                            <Icon size={16} className="shrink-0 text-emerald-600" />
                            <span className="text-sm text-foreground">{item}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <X size={14} className="text-red-500" />
                      </div>
                      No incluido
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {featured.notIncluded.map((item, i) => {
                        const Icon = NOT_INCLUDED_ICONS[item] || X
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-lg bg-red-50/50 p-3">
                            <Icon size={16} className="shrink-0 text-red-400" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Testimonials ──────────────────── */}
            {testimonials.length > 0 && (
              <section className="mt-12" id="testimonios">
                <h2 className="font-serif text-xl font-extrabold text-foreground">
                  Lo que dicen nuestros viajeros
                </h2>
                <div className="mt-4 -mx-5 px-5 sm:mx-0 sm:px-0">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible">
                    {testimonials.slice(0, 4).map((t) => (
                      <div key={t.id} className="shrink-0 w-[72vw] snap-start sm:w-auto rounded-xl bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-sun text-yellow-sun" />
                          ))}
                        </div>
                        <p className="text-sm text-foreground/80 italic leading-relaxed">"{t.quote}"</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-vivid to-coral" />
                          <div>
                            <p className="text-xs font-bold text-foreground">{t.name}, {t.age} años</p>
                            <p className="text-[11px] text-muted-foreground">{t.city}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── FAQ ───────────────────────────── */}
            <section className="mt-12" id="faq">
              <h2 className="font-serif text-xl font-extrabold text-foreground">
                Preguntas frecuentes
              </h2>

              {faqs.length > 0 && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setFaqTab("destino")}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      faqTab === "destino"
                        ? "bg-teal-deep text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MapPin size={12} />
                    Sobre {destination.name}
                  </button>
                  <button
                    onClick={() => setFaqTab("general")}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      faqTab === "general"
                        ? "bg-teal-deep text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Globe size={12} />
                    Sobre Travelhood
                  </button>
                </div>
              )}

              <div className="mt-4">
                <Accordion type="single" collapsible className="flex flex-col gap-2">
                  {(faqTab === "destino" && faqs.length > 0 ? faqs : GENERAL_FAQS).map((faq, i) => (
                    <AccordionItem
                      key={`${faqTab}-${i}`}
                      value={`${faqTab}-faq-${i}`}
                      className="rounded-xl bg-card px-5 border-none shadow-sm"
                    >
                      <AccordionTrigger className="text-left font-serif text-sm font-bold text-foreground hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* ── Trust + PDF ───────────────────── */}
            <section className="mt-12 rounded-xl bg-teal-deep p-6 text-sand">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold">¿Quieres toda la info en detalle?</h3>
                  <p className="mt-1 text-sm text-sand/70">
                    Descarga el PDF con itinerario completo, precios, qué llevar y toda la información del viaje a {destination.name}.
                  </p>
                </div>
                <button
                  onClick={() => alert("La descarga del PDF estará disponible próximamente.")}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 shrink-0"
                >
                  <Download size={16} />
                  Descargar PDF
                </button>
              </div>
            </section>

            {/* ── CTA Bottom ───────────────────── */}
            <section className="mt-12 mb-6 lg:mb-0 rounded-xl bg-gradient-to-br from-coral/10 to-yellow-sun/10 p-8 text-center">
              <h3 className="font-serif text-2xl font-extrabold text-foreground">
                ¿Te apuntas a {destination.name}?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                El grupo ya se está formando. Solo falta tu nombre en la lista.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setDeparturesOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3.5 text-base font-bold text-white transition-all hover:brightness-110"
                >
                  Ver salidas y precios
                </button>
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola! Me interesa el viaje a ${destination.name}. ¿Podéis darme más info?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-bold text-white transition-all hover:brightness-110"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Preguntar por WhatsApp
                </a>
              </div>
            </section>
          </div>

          {/* ── Sidebar (Desktop) ────────────── */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-20">
              <div className="rounded-2xl bg-card shadow-lg border border-border overflow-hidden">
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Desde</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-foreground">
                      {formatPrice(cheapest?.promoPrice || cheapest?.priceFrom || 0)}
                    </span>
                    {cheapest?.promoPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(cheapest.priceFrom)}
                      </span>
                    )}
                  </div>
                  {cheapest?.promoLabel && (
                    <span className="mt-1 inline-block rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold text-coral">
                      {cheapest.promoLabel}
                    </span>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {cheapest?.durationDays} días · + vuelo ~{formatPrice(cheapest?.flightEstimate || 0)}
                  </p>

                  {cheapest && cheapest.placesLeft <= 4 && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-coral/10 px-2.5 py-1.5 text-[11px] font-semibold text-coral">
                      <Zap size={12} />
                      ¡Últimas plazas!
                    </div>
                  )}

                  <button
                    onClick={() => setDeparturesOpen(true)}
                    className="mt-4 w-full rounded-full bg-coral px-5 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
                  >
                    Ver salidas y precios
                  </button>
                </div>

                <div className="border-t border-border px-5 py-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Shield size={12} className="text-teal-vivid shrink-0" />
                      Cancelación flexible
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <UserCheck size={12} className="text-teal-vivid shrink-0" />
                      Coordinador en destino
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Users size={12} className="text-teal-vivid shrink-0" />
                      Grupo 12-18 · 20-35 años
                    </div>
                  </div>
                </div>

                <div className="border-t border-border px-5 py-3">
                  <button
                    onClick={() => alert("La descarga del PDF estará disponible próximamente.")}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-foreground/70 transition-colors hover:bg-muted"
                  >
                    <Download size={12} />
                    Descargar PDF
                  </button>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-[#25D366]/5 px-4 py-3 text-center">
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola! Tengo dudas sobre el viaje a ${destination.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  ¿Dudas? Escríbenos
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile Bottom Bar ────────────────── */}
      <div
        className={`lg:hidden ${departuresOpen || galleryOpen ? "hidden" : ""}`}
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#fff", borderTop: "1px solid #e5e5e5", boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 16px" }}>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-foreground">
                {formatPrice(cheapest?.promoPrice || cheapest?.priceFrom || 0)}
              </span>
              {cheapest?.promoPrice && (
                <span className="text-[11px] text-muted-foreground line-through">
                  {formatPrice(cheapest.priceFrom)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] text-muted-foreground">
                {cheapest?.durationDays} días · {trips.length} {trips.length === 1 ? "salida" : "salidas"}
              </p>
              {cheapest?.promoLabel && (
                <span className="rounded-full bg-coral/10 px-1.5 py-0.5 text-[9px] font-bold text-coral">
                  {cheapest.promoLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola! Tengo dudas sobre el viaje a ${destination.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-all hover:brightness-110"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <button
              onClick={() => setDeparturesOpen(true)}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Ver salidas
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile bar */}
      <div className="h-24 lg:hidden" />

      {/* ── Modals ───────────────────────────── */}
      <PhotoModal
        photos={photos}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={galleryIndex}
      />
      <DeparturesModal
        trips={trips}
        destinationName={destination.name}
        isOpen={departuresOpen}
        onClose={() => setDeparturesOpen(false)}
      />
    </>
  )
}
