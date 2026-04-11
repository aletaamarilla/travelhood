export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://travelhood.es"

export const FALLBACK_SITE_NAME = "Travel Hood"
export const FALLBACK_CONTACT_EMAIL = "contacta@travelhood.es"
export const FALLBACK_WHATSAPP_PHONE = "34686684204"
export const FALLBACK_WA_COMMUNITY_URL = ""
export const FALLBACK_INSTAGRAM_URL = "https://instagram.com/travelhood_esp"
export const FALLBACK_TIKTOK_URL = "https://tiktok.com/@travelhood.es"

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
