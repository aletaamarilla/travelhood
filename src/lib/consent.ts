export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export const CONSENT_COOKIE = 'th_cookie_consent'
const BLOCKED_PREFERENCE = 'th_consent_storage_blocked'
let failedPreference = false
let lastSavePersisted = true

// Pure and self-contained: also serialized into the early inline bootstrap.
export function parseConsentCookie(cookie: string): CookieConsent | null {
  try {
    const raw = cookie.match(/(?:^|; )th_cookie_consent=([^;]*)/)?.[1]
    const value = raw ? JSON.parse(decodeURIComponent(raw)) : null
    if (!value || typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean') return null
    return { necessary: true, analytics: value.analytics, marketing: value.marketing }
  } catch { return null }
}

function readCookie(): CookieConsent | null {
  try { return parseConsentCookie(document.cookie) } catch { return null }
}

export function getStoredConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null
  // Only cache refusal on failed persistence. Successful choices always reread
  // the cookie, including withdrawals made in another tab.
  let blocked = failedPreference
  try { blocked ||= localStorage.getItem(BLOCKED_PREFERENCE) === '1' } catch { /* Storage may be disabled. */ }
  return blocked ? { necessary: true, analytics: false, marketing: false } : readCookie()
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true
}

export function consentWasPersisted(): boolean { return lastSavePersisted }

export function saveConsent(consent: CookieConsent): boolean {
  const choice = { necessary: true, analytics: consent.analytics === true, marketing: consent.marketing === true }
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(choice))};path=/;max-age=31536000;SameSite=Lax${location.protocol === 'https:' ? ';Secure' : ''}`
  } catch { /* Verify actual persistence below, including silently ignored writes. */ }
  const stored = readCookie()
  lastSavePersisted = stored?.analytics === choice.analytics && stored?.marketing === choice.marketing
  failedPreference = !lastSavePersisted
  try {
    if (lastSavePersisted) localStorage.removeItem(BLOCKED_PREFERENCE)
    else localStorage.setItem(BLOCKED_PREFERENCE, '1')
    // A storage event wakes other tabs with already-loaded Google listeners.
    localStorage.setItem('th_consent_change', `${Date.now()}-${Math.random()}`)
  } catch { /* Cookie reads still protect other tabs' own events. */ }
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: getStoredConsent() }))
  return lastSavePersisted
}
