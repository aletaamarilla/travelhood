import { Bell, Award, Heart, Users } from "lucide-react"

export default function LeadMagnet({ whatsappCommunityUrl }: { whatsappCommunityUrl?: string }) {
  const WA_COMMUNITY = whatsappCommunityUrl || "https://chat.whatsapp.com/CA8Mqw35bdG4dkHfxGeVUZ"
  return (
    <section className="bg-teal-deep py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-sun">
          <Bell className="h-7 w-7 text-teal-deep" />
        </div>
        <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl text-balance">
          Sé el primero en enterarte de nuevas salidas
        </h2>
        <p className="max-w-lg text-sm text-white/80 leading-relaxed">
          Únete a nuestra comunidad de WhatsApp y recibe al instante las nuevas salidas, plazas libres y ofertas exclusivas. Sin spam, solo lo que te importa.
        </p>

        <a
          href={WA_COMMUNITY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-bold text-white transition-all hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Unirme a la comunidad
        </a>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-8 border-t border-white/15 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <Award className="h-5 w-5 text-yellow-sun" />
            <div className="text-left">
              <p className="text-xs font-bold">Empresa registrada</p>
              <p className="text-[11px] text-white/60">CIF B19950385</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-white">
            <Heart className="h-5 w-5 text-yellow-sun" />
            <div className="text-left">
              <p className="text-xs font-bold">+500 viajeros</p>
              <p className="text-[11px] text-white/60">Comunidad real y activa</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-white">
            <Users className="h-5 w-5 text-yellow-sun" />
            <div className="text-left">
              <p className="text-xs font-bold">Acceso inmediato</p>
              <p className="text-[11px] text-white/60">Sin formularios ni esperas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
