import {
  defaultCollaboratorsContent,
  isCollaboratorAssetUrl,
  isHttpsUrl,
  type CollaboratorContent,
  type CollaboratorsContent,
} from '../../shared/collaborators'
import type { SanityCollaboratorsPage } from '@/types/sanity'

export type { CollaboratorContent, CollaboratorsContent }

export function resolveCollaboratorsContent(
  data: SanityCollaboratorsPage | null,
  resolveAsset: (image: NonNullable<SanityCollaboratorsPage['collaborators']>[number]['logo']) => string,
): CollaboratorsContent {
  if (!data) return structuredClone(defaultCollaboratorsContent)

  const seenSlugs = new Set<string>()
  const collaborators = (data.collaborators ?? []).flatMap((partner) => {
    const slug = partner.slug?.trim() ?? ''
    if (partner.isVisible === false || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      || seenSlugs.has(slug) || !isHttpsUrl(partner.url ?? '')
      || !partner.name?.trim() || !partner.ctaLabel?.trim()
      || !['affiliate', 'sister'].includes(partner.relationship ?? '')) return []
    seenSlugs.add(slug)
    const logoUrl = resolveAsset(partner.logo) || partner.logoUrl || ''
    const imageUrl = resolveAsset(partner.image) || partner.imageUrl || ''
    return [{
      ...partner,
      slug,
      logoUrl: isCollaboratorAssetUrl(logoUrl) ? logoUrl : '',
      imageUrl: partner.imageAlt?.trim() && isCollaboratorAssetUrl(imageUrl) ? imageUrl : '',
    }]
  })

  return {
    title: data.title?.trim() || defaultCollaboratorsContent.title,
    intro: data.intro?.trim() || defaultCollaboratorsContent.intro,
    homeTitle: data.homeTitle?.trim() || defaultCollaboratorsContent.homeTitle,
    homeIntro: data.homeIntro?.trim() || defaultCollaboratorsContent.homeIntro,
    seoTitle: data.seoTitle?.trim() || defaultCollaboratorsContent.seoTitle,
    seoDescription: data.seoDescription?.trim() || defaultCollaboratorsContent.seoDescription,
    collaborators,
  }
}
