import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nombre del sitio',
      type: 'string',
      description: 'Nombre del sitio web. Aparece en el footer y en el schema.org.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteUrl',
      title: 'URL del sitio',
      type: 'url',
      description: 'URL principal del sitio (ej: https://travelhood.es). No cambiar sin consultar.',
      validation: (Rule) => Rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'orgLogo',
      title: 'Logo de la organización',
      type: 'image',
      description: 'Logo principal de Travelhood. Se usa en schema.org y redes sociales.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'string',
      description: 'Rango de precios que se muestra en Google (ej: "590€ - 1.590€").',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacto',
      type: 'string',
      description: 'Email de contacto principal. Se muestra en el footer.',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {name: 'email'}).warning('Introduce un email válido.'),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      of: [{type: 'socialLink'}],
      description: 'Redes sociales de Travelhood. Cada una con plataforma y enlace.',
    }),
    defineField({
      name: 'defaultSeoImage',
      title: 'Imagen SEO por defecto',
      type: 'image',
      description:
        'Imagen por defecto cuando se comparte en redes sociales y no hay otra específica. Tamaño ideal: 1200x630px.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Configuración del sitio'}
    },
  },
})
