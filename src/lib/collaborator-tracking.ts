export interface CollaboratorClick {
  partner_id: string
  source: 'home' | 'footer' | 'header' | 'mobile_menu' | 'collaborators_page'
  link_type: 'discovery' | 'outbound'
}

export function trackCollaboratorClick(params: CollaboratorClick): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  try {
    const match = document.cookie.match(/(?:^|; )th_cookie_consent=([^;]*)/)
    if (!match || JSON.parse(decodeURIComponent(match[1])).analytics !== true) return false
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'collaborator_click', ...params })
    return true
  } catch {
    return false
  }
}

export function handleCollaboratorClick(event: MouseEvent): void {
  if (event.type === 'auxclick' && event.button !== 1) return
  const link = event.target instanceof Element
    ? event.target.closest<HTMLAnchorElement>('a[data-collaborator]')
    : null
  if (!link) return
  const { collaborator: partner_id, collaboratorSource: source, collaboratorKind: link_type } = link.dataset
  if (!partner_id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(partner_id)) return
  if (source !== 'home' && source !== 'footer' && source !== 'header' && source !== 'mobile_menu' && source !== 'collaborators_page') return
  if (link_type !== 'discovery' && link_type !== 'outbound') return
  trackCollaboratorClick({ partner_id, source, link_type })
}
