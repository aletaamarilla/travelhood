import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fieldsets: [
    {name: 'homeImages', title: 'Imágenes de la Home', options: {collapsible: true, collapsed: true}},
    {
      name: 'travelhood',
      title: 'Imágenes de /travelhood',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'pageImages',
      title: 'Imágenes de páginas',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'contact', title: 'WhatsApp y contacto', options: {collapsible: true, collapsed: false}},
    {name: 'legal', title: 'Identidad legal', options: {collapsible: true, collapsed: false}},
    {
      name: 'reviewsTrust',
      title: 'Confianza y opiniones',
      options: {collapsible: true, collapsed: false},
    },
  ],
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
      name: 'whatsappPhone',
      title: 'Teléfono WhatsApp',
      type: 'string',
      description: 'Número en formato internacional sin "+" (ej: 34686684204). Se usa para generar los enlaces wa.me/.',
      fieldset: 'contact',
      validation: (Rule) => Rule.required().regex(/^\d{7,15}$/, {name: 'phone'}),
    }),
    defineField({
      name: 'whatsappCommunityUrl',
      title: 'Enlace comunidad WhatsApp',
      type: 'url',
      description: 'Link de invitación al grupo/comunidad de WhatsApp (ej: https://chat.whatsapp.com/XXXXX).',
      fieldset: 'contact',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'legalLicenseType',
      title: 'Tipo de licencia legal',
      type: 'string',
      description: 'Etiqueta visible del registro/licencia administrativa (ej: CIAN).',
      fieldset: 'legal',
      initialValue: 'CIAN',
    }),
    defineField({
      name: 'legalLicenseNumber',
      title: 'Número de licencia legal',
      type: 'string',
      description:
        'Número de registro/licencia de la agencia. Se muestra de forma discreta en el footer y puede usarse en schema.org.',
      fieldset: 'legal',
      initialValue: '048161-2',
      validation: (Rule) =>
        Rule.regex(/^[A-Z0-9\s.-]+$/i, {name: 'license'}).warning('Revisa el formato del número de licencia.'),
    }),
    defineField({
      name: 'depositAmount',
      title: 'Señal de reserva (€)',
      type: 'number',
      description: 'Importe de la señal de reserva que se muestra en la web. Se aplica globalmente.',
      initialValue: 250,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'trustpilotProfileUrl',
      title: 'URL del perfil en Trustpilot',
      type: 'url',
      description:
        'Enlace principal al perfil público de Travel Hood en Trustpilot. No usar widgets, logos, badges ni claims de verificación.',
      fieldset: 'reviewsTrust',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'reviewsAttributionText',
      title: 'Texto de atribución de opiniones',
      type: 'text',
      rows: 2,
      description:
        'Texto breve bajo las opiniones. Ej: "También puedes leer más opiniones en nuestro perfil público de Trustpilot."',
      fieldset: 'reviewsTrust',
      validation: (Rule) => Rule.max(220).warning('Mantén la atribución breve y transparente.'),
    }),
    defineField({
      name: 'reviewsLastReviewedAt',
      title: 'Última revisión manual de opiniones',
      type: 'datetime',
      description:
        'Fecha interna de la última revisión manual del origen y trazabilidad de las opiniones publicadas.',
      fieldset: 'reviewsTrust',
    }),
    defineField({
      name: 'reviewsCtaLabel',
      title: 'Texto del CTA de opiniones',
      type: 'string',
      description:
        'Etiqueta del enlace hacia el perfil externo de opiniones. Ej: "Ver opiniones en Trustpilot".',
      fieldset: 'reviewsTrust',
      validation: (Rule) => Rule.max(80).warning('Usa una etiqueta clara y breve.'),
    }),
    defineField({
      name: 'defaultSeoImage',
      title: 'Imagen SEO por defecto',
      type: 'image',
      description:
        'Imagen por defecto cuando se comparte en redes sociales y no hay otra específica. Tamaño ideal: 1200x630px.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'defaultIncluded',
      title: 'Incluye (por defecto)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Lo que incluyen TODOS los viajes de Travelhood por defecto.',
    }),
    defineField({
      name: 'defaultNotIncluded',
      title: 'No incluye (por defecto)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Lo que NO incluye ningún viaje por defecto.',
    }),
    // ── Home images ──────────────────────────────────────────────
    defineField({
      name: 'homeHeroImage',
      title: 'Hero principal (Home)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeHeroImageAlt',
      title: 'Alt text — Hero principal',
      type: 'string',
      description: 'Texto alternativo para la imagen hero de la home.',
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeWhyUsImage',
      title: 'Sección "Por qué Travelhood"',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeHowItWorksImage',
      title: 'Sección "Cómo funciona"',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeAboutBgImage',
      title: 'Fondo sección "Sobre nosotros"',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeAboutPhoto',
      title: 'Foto editorial "Sobre nosotros"',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'homeImages',
    }),
    defineField({
      name: 'homeAboutPhotoAlt',
      title: 'Alt text — Foto "Sobre nosotros"',
      type: 'string',
      description: 'Texto alternativo para la foto editorial de la sección Sobre nosotros.',
      fieldset: 'homeImages',
    }),

    // ── Travelhood page images ────────────────────────────────────
    defineField({
      name: 'travelhood_heroImage',
      title: 'Hero (Travelhood)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_heroImageAlt',
      title: 'Alt text — Hero Travelhood',
      type: 'string',
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_purposePhoto',
      title: 'Foto de propósito (Travelhood)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_purposePhotoAlt',
      title: 'Alt text — Propósito',
      type: 'string',
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_diffPhoto',
      title: 'Foto de diferenciación (Travelhood)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_diffPhotoAlt',
      title: 'Alt text — Diferenciación',
      type: 'string',
      fieldset: 'travelhood',
    }),
    defineField({
      name: 'travelhood_communityPhotos',
      title: 'Fotos de comunidad (Travelhood)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        },
      ],
      description: 'Hasta 3 fotos para la sección de comunidad en /travelhood.',
      validation: (Rule) => Rule.max(3),
      fieldset: 'travelhood',
    }),

    // ── Page hero images ──────────────────────────────────────────
    defineField({
      name: 'blog_heroImage',
      title: 'Hero — Blog',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'blog_heroImageAlt',
      title: 'Alt text — Hero Blog',
      type: 'string',
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'opiniones_heroImage',
      title: 'Hero — Opiniones',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'opiniones_heroImageAlt',
      title: 'Alt text — Hero Opiniones',
      type: 'string',
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'comoFunciona_heroImage',
      title: 'Hero — Cómo funciona',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'comoFunciona_heroImageAlt',
      title: 'Alt text — Hero Cómo funciona',
      type: 'string',
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'viajes_heroImage',
      title: 'Hero — Viajes',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'viajes_heroImageAlt',
      title: 'Alt text — Hero Viajes',
      type: 'string',
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'ofertas_heroImage',
      title: 'Hero — Ofertas',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'ofertas_heroImageAlt',
      title: 'Alt text — Hero Ofertas',
      type: 'string',
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'faq_heroImage',
      title: 'Hero — FAQ',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'pageImages',
    }),
    defineField({
      name: 'faq_heroImageAlt',
      title: 'Alt text — Hero FAQ',
      type: 'string',
      fieldset: 'pageImages',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Configuración del sitio'}
    },
  },
})
