import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'globalFaq',
  title: 'FAQ Global',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Bloque',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'pages',
      title: 'Páginas donde mostrar',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Preguntas frecuentes', value: 'preguntas-frecuentes'},
          {title: 'Cómo funciona', value: 'como-funciona'},
          {title: 'Detalle de viaje', value: 'trip-detail'},
          {title: 'Viajar sola', value: 'viajar-sola'},
        ],
      },
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas',
      type: 'array',
      of: [{type: 'faqItem'}],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'order'},
    prepare({title, subtitle}) {
      return {title, subtitle: `Orden: ${subtitle ?? '-'}`}
    },
  },
})
