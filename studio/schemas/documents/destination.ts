import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'destination',
  title: 'Destino',
  type: 'document',
  fieldsets: [
    {name: 'basic', title: 'Información básica', options: {collapsible: true, collapsed: false}},
    {name: 'gallery', title: 'Galería', options: {collapsible: true, collapsed: true}},
    {name: 'geo', title: 'Datos GEO', options: {collapsible: true, collapsed: true}},
    {name: 'climate', title: 'Clima', options: {collapsible: true, collapsed: true}},
    {name: 'budget', title: 'Presupuesto', options: {collapsible: true, collapsed: true}},
    {name: 'seoFieldset', title: 'SEO', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // --- Información básica ---
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      fieldset: 'basic',
      description: 'Nombre del destino (ej: Laponia, Bali, Zanzíbar). No siempre coincide con el país.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      fieldset: 'basic',
      description: 'URL del destino: /destino/bali/. ⚠️ No cambiar después de publicar.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'reference',
      to: [{type: 'country'}],
      fieldset: 'basic',
      description: '¿En qué país está este destino?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Continente',
      type: 'reference',
      to: [{type: 'continent'}],
      fieldset: 'basic',
      description: '¿En qué continente? Redundante pero necesario para filtros rápidos.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 5,
      fieldset: 'basic',
      description:
        'Descripción larga y emocional del destino. 3-5 frases en tono Travelhood. Se muestra en la página del destino.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'string',
      fieldset: 'basic',
      description:
        'Una sola frase corta para las cards de destino (ej: "Auroras boreales, huskies y magia bajo la nieve ártica."). Máx. 80 caracteres.',
      validation: (Rule) =>
        Rule.required().max(80).warning('La descripción corta no debe superar los 80 caracteres.'),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen hero',
      type: 'image',
      fieldset: 'basic',
      description: 'Imagen principal del destino. Se muestra como fondo del hero. Mínimo 1920x1080px.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Texto alternativo del hero',
      type: 'string',
      fieldset: 'basic',
      description:
        'Texto alternativo del hero (ej: "Atardecer en los templos de Bali con arrozales"). Para SEO y accesibilidad.',
    }),
    defineField({
      name: 'highlights',
      title: 'Lugares destacados',
      type: 'array',
      of: [{type: 'string'}],
      fieldset: 'basic',
      description:
        'Lugares destacados del destino (ej: "Tokio", "Kioto", "Monte Fuji"). Se muestran como chips/etiquetas.',
    }),
    defineField({
      name: 'idealFor',
      title: 'Ideal para',
      type: 'string',
      fieldset: 'basic',
      description: 'Para quién es ideal este destino (ej: "Amantes de la naturaleza y el ecoturismo"). Una frase.',
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{type: 'string'}],
      fieldset: 'basic',
      description: 'Tipos de viaje que aplican a este destino. Seleccionar todas las que correspondan.',
      options: {
        list: [
          {title: 'Playa', value: 'playa'},
          {title: 'Aventura', value: 'aventura'},
          {title: 'Cultural', value: 'cultural'},
          {title: 'Naturaleza', value: 'naturaleza'},
          {title: 'Nieve', value: 'nieve'},
        ],
      },
    }),

    // --- Galería ---
    defineField({
      name: 'gallery',
      title: 'Galería de fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Descripción de la imagen para SEO y accesibilidad. ⚠️ Obligatorio.',
              validation: (Rule) => Rule.required().error('Cada imagen debe tener texto alternativo.'),
            }),
          ],
        },
      ],
      fieldset: 'gallery',
      description:
        'Galería de fotos del destino. Mínimo 6 fotos, ideal 8-10. Subir fotos reales de viajeros. Cada foto debe tener su texto alternativo (alt).',
    }),

    // --- Datos GEO ---
    defineField({
      name: 'climate',
      title: 'Clima (resumen)',
      type: 'string',
      fieldset: 'geo',
      description:
        'Resumen del clima (ej: "Tropical, 27-30°C"). Se usa en las tablas de datos y en la página "cuándo viajar".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas',
      type: 'geopoint',
      fieldset: 'geo',
      description:
        'Coordenadas del centro del destino (latitud, longitud). Se usan para el mapa. Puedes buscar en Google Maps.',
    }),

    // --- Clima ---
    defineField({
      name: 'climateByMonth',
      title: 'Clima por mes',
      type: 'array',
      of: [{type: 'climateMonth'}],
      fieldset: 'climate',
      description:
        'Datos de clima mes a mes. Se usan en la página "Cuándo viajar a [destino]". Rellenar al menos los meses en los que hay viajes.',
    }),

    // --- Presupuesto ---
    defineField({
      name: 'budgetPerDay',
      title: 'Presupuesto diario',
      type: 'budgetPerDay',
      fieldset: 'budget',
    }),

    // --- FAQs ---
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [{type: 'faqItem'}],
      description:
        'Preguntas frecuentes del destino. Se muestran en la página del destino y generan schema FAQ. Mínimo 3.',
      validation: (Rule) => Rule.min(3).warning('Se recomiendan al menos 3 preguntas frecuentes.'),
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'destinationSeo',
      fieldset: 'seoFieldset',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortDescription',
      media: 'heroImage',
    },
  },
})
