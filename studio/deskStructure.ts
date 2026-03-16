import type {StructureBuilder} from 'sanity/structure'

const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Travelhood')
    .items([
      // --- Contenido Principal ---
      S.listItem()
        .title('Contenido Principal')
        .child(
          S.list()
            .title('Contenido Principal')
            .items([
              S.documentTypeListItem('continent').title('Continentes'),
              S.documentTypeListItem('country').title('Países'),
              S.documentTypeListItem('destination').title('Destinos'),
              S.documentTypeListItem('trip').title('Viajes'),
            ]),
        ),

      // --- Catálogo ---
      S.listItem()
        .title('Catálogo')
        .child(
          S.list()
            .title('Catálogo')
            .items([
              S.documentTypeListItem('tripCategory').title('Categorías de viaje'),
              S.documentTypeListItem('season').title('Temporadas'),
              S.documentTypeListItem('comparison').title('Comparativas'),
            ]),
        ),

      // --- Comunidad ---
      S.listItem()
        .title('Comunidad')
        .child(
          S.list()
            .title('Comunidad')
            .items([
              S.documentTypeListItem('coordinator').title('Coordinadores'),
              S.documentTypeListItem('testimonial').title('Testimonios'),
            ]),
        ),

      // --- Blog ---
      S.documentTypeListItem('blogPost').title('Blog'),

      // --- Páginas ---
      S.documentTypeListItem('landingPage').title('Landing pages'),

      S.divider(),

      // --- Configuración del sitio (singleton) ---
      S.listItem()
        .title('Configuración del sitio')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])

export const singletonActions = (type: {name: string}, context: unknown) => {
  void context
  if (SINGLETON_TYPES.has(type.name)) {
    return ['publish', 'discardChanges', 'restore']
  }
  return undefined
}

export const singletonFilter = (type: {name: string}, context: unknown) => {
  void context
  return !SINGLETON_TYPES.has(type.name)
}
