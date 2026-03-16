import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogSection',
  title: 'Sección del artículo',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Título (H2)',
      type: 'string',
      description: 'Título de la sección (H2). Incluir keywords de forma natural.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'text',
      rows: 8,
      description:
        'Contenido de la sección. Usar saltos de línea para párrafos. Se pueden usar • para listas. Tono Travelhood.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen de sección',
      type: 'image',
      description: 'Imagen opcional para esta sección. Rompe la monotonía del texto.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Texto alternativo de la imagen de sección.',
    }),
    defineField({
      name: 'cta',
      title: 'Botón CTA',
      type: 'object',
      description: 'Botón de llamada a la acción opcional.',
      fields: [
        defineField({
          name: 'text',
          title: 'Texto del botón',
          type: 'string',
          description: 'Texto del botón (ej: "Ver viajes disponibles").',
        }),
        defineField({
          name: 'href',
          title: 'URL del botón',
          type: 'string',
          description: 'URL a la que lleva el botón (ej: "/viajes/", "/destino/tailandia/").',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
  },
})
