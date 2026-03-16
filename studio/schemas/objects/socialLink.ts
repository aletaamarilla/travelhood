import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'socialLink',
  title: 'Red social',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Plataforma',
      type: 'string',
      description: 'Nombre de la red social (ej: Instagram, TikTok, YouTube).',
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'Twitter / X', value: 'twitter'},
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'Pinterest', value: 'pinterest'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Enlace',
      type: 'url',
      description: 'URL completa del perfil (ej: https://instagram.com/travelhood.es).',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
  },
})
