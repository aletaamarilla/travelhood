import {defineArrayMember, defineField, defineType} from 'sanity'
import {defaultCollaboratorsContent, isCollaboratorAssetUrl} from '../../../shared/collaborators'

export default defineType({
  name: 'collaboratorsPage',
  title: 'Colaboradores',
  type: 'document',
  initialValue: () => ({
    ...structuredClone(defaultCollaboratorsContent),
    collaborators: defaultCollaboratorsContent.collaborators.map((partner) => ({
      ...partner,
      _type: 'collaborator',
    })),
  }),
  groups: [
    {name: 'page', title: 'Página', default: true},
    {name: 'partners', title: 'Colaboradores'},
    {name: 'home', title: 'Home'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Titular de la página', type: 'string', group: 'page', validation: (Rule) => Rule.required().max(100)}),
    defineField({name: 'intro', title: 'Introducción', type: 'text', rows: 3, group: 'page', validation: (Rule) => Rule.required().max(400)}),
    defineField({name: 'homeTitle', title: 'Titular del bloque de la home', type: 'string', group: 'home', validation: (Rule) => Rule.required().max(80)}),
    defineField({name: 'homeIntro', title: 'Texto del bloque de la home', type: 'text', rows: 2, group: 'home', validation: (Rule) => Rule.required().max(200)}),
    defineField({name: 'seoTitle', title: 'Título SEO', type: 'string', group: 'seo', validation: (Rule) => Rule.required().max(70)}),
    defineField({name: 'seoDescription', title: 'Descripción SEO', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.required().max(170)}),
    defineField({
      name: 'collaborators',
      title: 'Colaboradores',
      type: 'array',
      group: 'partners',
      description: 'Arrastra para ordenar. Puedes ocultar una marca sin borrarla. Los cambios se reflejan en la página y la home tras volver a publicar la web.',
      validation: (Rule) => Rule.custom((items) => {
        const slugs = (items ?? []).map((item) => (item as {slug?: string}).slug).filter(Boolean)
        return new Set(slugs).size === slugs.length || 'Cada colaborador debe tener un identificador diferente.'
      }),
      of: [defineArrayMember({
        name: 'collaborator',
        title: 'Colaborador',
        type: 'object',
        fieldsets: [{name: 'images', title: 'Logos y fotografía', options: {collapsible: true}}],
        initialValue: {isVisible: true, relationship: 'affiliate'},
        fields: [
          defineField({name: 'isVisible', title: 'Visible en la web', type: 'boolean', initialValue: true}),
          defineField({name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required().max(60)}),
          defineField({
            name: 'slug', title: 'Identificador', type: 'string',
            description: 'Ejemplo: iati. Se usa en el enlace directo y la medición de clics; mantenlo estable tras publicar.',
            validation: (Rule) => Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {name: 'identificador sin espacios ni tildes'}),
          }),
          defineField({
            name: 'relationship', title: 'Relación con Travelhood', type: 'string',
            options: {list: [{title: 'Colaboración con afiliación', value: 'affiliate'}, {title: 'Proyecto del mismo propietario', value: 'sister'}], layout: 'radio'},
            validation: (Rule) => Rule.required(),
          }),
          defineField({name: 'category', title: 'Qué ofrece', type: 'string', validation: (Rule) => Rule.required().max(60)}),
          defineField({name: 'summary', title: 'Resumen para la home', type: 'text', rows: 2, validation: (Rule) => Rule.required().max(160)}),
          defineField({name: 'headline', title: 'Titular de presentación', type: 'string', validation: (Rule) => Rule.required().max(100)}),
          defineField({name: 'description', title: 'Presentación', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(700)}),
          defineField({
            name: 'benefit', title: 'Ventaja confirmada', type: 'string',
            description: 'Ejemplo: 5 % de descuento. Déjalo vacío si no hay una ventaja vigente; desaparecerá también de la home.',
            validation: (Rule) => Rule.max(80),
          }),
          defineField({
            name: 'benefitDetails', title: 'Condiciones de la ventaja', type: 'text', rows: 3,
            validation: (Rule) => Rule.custom((value, context) =>
              !(context.parent as {benefit?: string} | undefined)?.benefit?.trim() || value?.trim()
                ? true : 'Explica cómo se aplica la ventaja y dónde consultar sus condiciones.'),
          }),
          defineField({name: 'url', title: 'Enlace de destino', type: 'url', description: 'Pega el enlace completo, incluidos los parámetros de afiliación.', validation: (Rule) => Rule.required().uri({scheme: ['https']})}),
          defineField({name: 'ctaLabel', title: 'Texto del botón', type: 'string', validation: (Rule) => Rule.required().max(70)}),
          defineField({name: 'logo', title: 'Logo', type: 'image', fieldset: 'images'}),
          defineField({
            name: 'logoUrl', title: 'Logo inicial (si no subes uno)', type: 'string', fieldset: 'images',
            description: 'Admite una ruta /images/ de esta web o una dirección HTTPS.',
            validation: (Rule) => Rule.custom((value) => !value || isCollaboratorAssetUrl(value) || 'Usa una ruta local /images/ o una URL HTTPS.'),
          }),
          defineField({name: 'image', title: 'Fotografía', type: 'image', options: {hotspot: true}, fieldset: 'images'}),
          defineField({
            name: 'imageUrl', title: 'Fotografía inicial (si no subes una)', type: 'string', fieldset: 'images',
            description: 'Borra este campo y la fotografía subida para mostrar el bloque sin foto.',
            validation: (Rule) => Rule.custom((value) => !value || isCollaboratorAssetUrl(value) || 'Usa una ruta local /images/ o una URL HTTPS.'),
          }),
          defineField({
            name: 'imageAlt', title: 'Descripción de la fotografía', type: 'string', fieldset: 'images',
            validation: (Rule) => Rule.custom((value, context) => {
              const parent = context.parent as {image?: unknown; imageUrl?: string} | undefined
              return !(parent?.image || parent?.imageUrl) || value?.trim() ? true : 'Describe la fotografía para quienes no puedan verla.'
            }),
          }),
        ],
        preview: {
          select: {title: 'name', category: 'category', visible: 'isVisible', media: 'logo'},
          prepare({title, category, visible, media}) {
            return {title, subtitle: visible === false ? 'Oculto en la web' : category, media}
          },
        },
      })],
    }),
  ],
  preview: {prepare: () => ({title: 'Colaboradores', subtitle: 'Página, home y enlaces a IATI y Nomadcamper'})},
})
