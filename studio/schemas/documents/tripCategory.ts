import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tripCategory',
  title: 'Categoría de viaje',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre de la categoría (ej: "Aventura", "Playa", "Cultural", "Naturaleza", "Nieve").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL: /tipos/aventura/. ⚠️ No cambiar.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorial',
      title: 'Texto editorial',
      type: 'text',
      rows: 6,
      description: 'Texto editorial largo describiendo esta categoría de viaje. 150-250 palabras. Tono Travelhood.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen hero',
      type: 'image',
      description: 'Imagen principal de la categoría. Mínimo 1920x1080px.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Texto alternativo del hero',
      type: 'string',
      description: 'Texto alternativo del hero.',
    }),
    defineField({
      name: 'idealProfile',
      title: 'Perfil de viajero ideal',
      type: 'text',
      rows: 3,
      description:
        'Descripción del perfil de viajero ideal para esta categoría (ej: "Viajeros activos que buscan experiencias intensas...").',
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [{type: 'faqItem'}],
      description: 'Preguntas frecuentes sobre esta categoría. Mínimo 3.',
      validation: (Rule) => Rule.min(3).warning('Se recomiendan al menos 3 preguntas frecuentes.'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'heroImage',
    },
  },
})
