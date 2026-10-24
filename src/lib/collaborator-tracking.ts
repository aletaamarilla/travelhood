import { trackEvent } from "@/lib/analytics"

export interface CollaboratorClick {
  partner_id: string
  source: 'home' | 'footer' | 'header' | 'mobile_menu' | 'collaborators_page'
  link_type: 'discovery' | 'outbound'
}

export function trackCollaboratorClick(params: CollaboratorClick): boolean {
  return trackEvent('collaborator_click', params)
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
