import type { CookieConsent } from '@/lib/consent'

export interface GoogleConsentBridge {
  phase1Ready: boolean
  setReader(reader: () => CookieConsent | null): void
}

declare global {
  interface Window { __thGoogleConsent?: GoogleConsentBridge; dataLayer?: unknown[] }
}

// Self-contained on purpose: Layout serializes this function and the shared
// parser inline, BEFORE inserting the existing shared GTM container.
export function bootstrapGoogleConsent(
  config: { gtmId: string; measurementId: string; phase1Ready: boolean },
  parseCookie: (cookie: string) => CookieConsent | null,
): void {
  if (window.__thGoogleConsent) return
  let forcedDenial = false
  const fallbackReader = (): CookieConsent | null => {
    try {
      if (forcedDenial) return null
      try { if (localStorage.getItem('th_consent_storage_blocked') === '1') return null } catch { /* Cookie remains readable when storage is disabled. */ }
      return parseCookie(document.cookie)
    } catch { return null }
  }
  let reader = fallbackReader
  let initial = true
  let previous: CookieConsent | null = null
  function command(..._args: unknown[]): void {
    try {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(arguments)
    } catch { /* Optional telemetry cannot break the page. */ }
  }
  function apply(): void {
    let choice: CookieConsent | null = null
    try { choice = reader() } catch { /* Fail closed. */ }
    const analytics = choice?.analytics === true
    const marketing = choice?.marketing === true
    if (/^G-[A-Z0-9]+$/.test(config.measurementId)) {
      // Set the SDK opt-out BEFORE any consent update or shared-container load.
      ;(window as unknown as Record<string, unknown>)[`ga-disable-${config.measurementId}`] = !analytics
    }
    if (initial || analytics !== (previous?.analytics === true) || marketing !== (previous?.marketing === true)) {
      command('consent', initial ? 'default' : 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
        ...(initial ? { functionality_storage: 'granted', security_storage: 'granted' } : {}),
      })
    }
    if (initial) {
      command('set', 'ads_data_redaction', true)
      command('set', 'url_passthrough', false)
    }
    initial = false
    previous = choice
    if (!analytics) {
      // Only Google cookies. Do not clear Meta cookies or reload the document.
      try {
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.trim().split('=')[0]
          if (!/^(_ga($|_)|_gid$|_gat)/.test(name)) continue
          for (const domain of ['', location.hostname, '.travelhood.es']) {
            try { document.cookie = `${name}=;Max-Age=0;path=/${domain ? `;domain=${domain}` : ''};SameSite=Lax` } catch { /* SDK is already opted out. */ }
          }
        }
      } catch { /* Cookie access itself can be blocked. */ }
    }
  }
  window.__thGoogleConsent = {
    phase1Ready: config.phase1Ready,
    setReader(nextReader) { reader = nextReader; apply() },
  }
  window.addEventListener('cookieConsentUpdated', (event) => {
    // This early owner also works if the deferred events module never starts.
    // A refused change with stale granted cookies must fail closed in memory.
    try {
      const detail = (event as CustomEvent<CookieConsent>).detail
      if (detail && typeof detail.analytics === 'boolean' && typeof detail.marketing === 'boolean') {
        const stored = parseCookie(document.cookie)
        forcedDenial = (!!stored?.analytics && !detail.analytics) || (!!stored?.marketing && !detail.marketing)
      }
    } catch { forcedDenial = true }
    apply()
  })
  window.addEventListener('storage', (event) => {
    if (event.key === 'th_consent_change' || event.key === 'th_consent_storage_blocked' || event.key === null) apply()
  })
  window.addEventListener('focus', apply)
  apply()
  // Preserve the existing shared GTM loading independently of Analytics consent
  // and the phase gate. Meta's tags, triggers and document lifecycle are untouched.
  if (/^GTM-[A-Z0-9]+$/.test(config.gtmId)) {
    try {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`
      const first = document.getElementsByTagName('script')[0]
      if (first?.parentNode) first.parentNode.insertBefore(script, first)
      else document.head.appendChild(script)
    } catch { /* A blocked container cannot block navigation or hydration. */ }
  }
}
