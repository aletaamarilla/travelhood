import { useState } from "react"
import { Bell, ArrowRight, Award, Heart } from "lucide-react"

export default function LeadMagnet() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="bg-secondary py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-sun">
          <Bell className="h-7 w-7 text-teal-deep" />
        </div>
        <h2 className="font-serif text-2xl font-extrabold text-secondary-foreground sm:text-3xl text-balance">
          Sé el primero en enterarte de nuevas salidas
        </h2>
        <p className="max-w-lg text-sm text-secondary-foreground/80 leading-relaxed">
          Déjanos tu email y te avisamos cuando abramos nuevos destinos o queden pocas plazas. Sin spam, lo prometemos.
        </p>

        {submitted ? (
          <div className="rounded-xl bg-card px-8 py-4 text-center">
            <p className="font-serif text-lg font-bold text-foreground">Hecho. Te mantendremos al día.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email..."
              className="flex-1 rounded-xl bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-accent-foreground transition-all hover:brightness-110"
            >
              Avísame
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-8 border-t border-secondary-foreground/15 pt-6">
          <div className="flex items-center gap-2.5 text-secondary-foreground">
            <Award className="h-5 w-5 text-yellow-sun" />
            <div className="text-left">
              <p className="text-xs font-bold">Empresa registrada</p>
              <p className="text-[11px] text-secondary-foreground/60">Licencia de agencia oficial</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-secondary-foreground">
            <Heart className="h-5 w-5 text-yellow-sun" />
            <div className="text-left">
              <p className="text-xs font-bold">+500 viajeros</p>
              <p className="text-[11px] text-secondary-foreground/60">Comunidad real y activa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
