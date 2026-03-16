import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título interno',
      type: 'string',
      description: 'Título interno de la landing (ej: "Viajar sola"). Se usa para identificarla en el panel.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'string',
      description:
        'Slug fijo de la página (ej: "viajar-sola", "viajes-para-mujeres"). ⚠️ NO CAMBIAR. Coincide con la ruta en la web.',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Titular principal (H1)',
      type: 'string',
      description: 'Titular principal (H1) de la página. Se muestra en el hero.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
      description: 'Subtítulo bajo el H1. Una frase que refuerce el mensaje.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen hero',
      type: 'image',
      description: 'Imagen de fondo del hero. Mínimo 1920x1080px.',
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
      name: 'editorial',
      title: 'Texto editorial',
      type: 'text',
      rows: 8,
      description: 'Texto editorial principal de la página. 200-400 palabras. Tono Travelhood.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredDestinations',
      title: 'Destinos destacados',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'destination'}]}],
      description: 'Destinos destacados que se muestran en esta landing. Seleccionar 3-6.',
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [{type: 'faqItem'}],
      description: 'Preguntas frecuentes. Mínimo 3. Generan schema FAQ en Google.',
      validation: (Rule) => Rule.min(3).warning('Se recomiendan al menos 3 preguntas frecuentes.'),
    }),
    defineField({
      name: 'stats',
      title: 'Datos estadísticos',
      type: 'array',
      of: [{type: 'statItem'}],
      description:
        'Datos estadísticos que se muestran en bloques grandes (ej: "70%" + "reservan solos"). 3-5 datos.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
      media: 'heroImage',
    },
  },
})
