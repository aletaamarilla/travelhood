export interface CollaboratorContent {
  _key: string
  slug: string
  name: string
  relationship: 'affiliate' | 'sister'
  category: string
  summary: string
  headline: string
  description: string
  benefit?: string
  benefitDetails?: string
  url: string
  ctaLabel: string
  logoUrl?: string
  imageUrl?: string
  imageAlt?: string
  isVisible: boolean
}

export interface CollaboratorsContent {
  title: string
  intro: string
  homeTitle: string
  homeIntro: string
  seoTitle: string
  seoDescription: string
  collaborators: CollaboratorContent[]
}

// Shared by the website fallback and the initial content in Sanity Studio.
export const defaultCollaboratorsContent: CollaboratorsContent = {
  title: 'Colaboradores de Travelhood',
  intro: 'Consulta seguros de viaje con IATI y alquiler de campers en Almería con Nomadcamper. Accede a sus webs para ver precios, condiciones y disponibilidad.',
  homeTitle: 'Nuestros colaboradores',
  homeIntro: 'Seguros de viaje con IATI y alquiler de campers en Almería con Nomadcamper.',
  seoTitle: 'Colaboradores: IATI y Nomadcamper | Travelhood',
  seoDescription: 'Colaboradores de Travelhood: seguros de viaje con IATI y alquiler de campers en Almería con Nomadcamper. Consulta precios y condiciones.',
  collaborators: [
    {
      _key: 'iati',
      slug: 'iati',
      name: 'IATI Seguros',
      relationship: 'affiliate',
      category: 'Seguros de viaje',
      summary: 'Seguros de viaje para tu destino y tus fechas. Compara coberturas y precios.',
      headline: 'Compara y contrata tu seguro de viaje',
      description: 'El seguro no está incluido en los viajes de Travelhood y se contrata aparte. En IATI puedes consultar las coberturas y el precio según tu destino, fechas y tipo de viaje.',
      benefit: '5 % de descuento',
      benefitDetails: 'El descuento se aplica al calcular el seguro desde nuestro enlace. Revisa las coberturas, exclusiones y el precio final antes de contratar.',
      url: 'https://www.iatiseguros.com/?r=97872091556250',
      ctaLabel: 'Calcular mi seguro en IATI',
      logoUrl: '/images/collaborators/iati.svg',
      isVisible: true,
    },
    {
      _key: 'nomadcamper',
      slug: 'nomadcamper',
      name: 'Nomadcamper',
      relationship: 'sister',
      category: 'Campers en Almería',
      summary: 'Alquiler de campers en Almería. Consulta vehículos, disponibilidad y precios.',
      headline: 'Alquiler de campers en Almería',
      description: 'Nomadcamper es parte de la familia Travelhood. Ofrece alquiler de campers con recogida en Almería. En su web puedes consultar los vehículos, la disponibilidad y los precios para las fechas que te interesan.',
      url: 'https://nomadcamper.es/',
      ctaLabel: 'Consultar campers y disponibilidad',
      logoUrl: '/images/collaborators/nomadcamper.webp',
      imageUrl: '/images/collaborators/nomadcamper-costa.webp',
      imageAlt: 'Camper de Nomadcamper junto a un faro de la costa de Almería',
      isVisible: true,
    },
  ],
}

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

export function isCollaboratorAssetUrl(value: string): boolean {
  return /^\/(?!\/)[^\s\\]+$/.test(value) || isHttpsUrl(value)
}
