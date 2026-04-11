import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Página legal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nombre del documento legal (ej: "Aviso legal", "Política de privacidad").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL de la página: /legal/aviso-legal/. ⚠️ No cambiar después de publicar.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Versión',
      type: 'string',
      description:
        'Versión del documento (ej: "1.0", "1.1"). Incrementar cada vez que se modifique el contenido.',
      validation: (Rule) => Rule.required(),
      initialValue: '1.0',
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Fecha de vigencia',
      type: 'date',
      description: 'Fecha desde la que esta versión del documento es válida.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Última revisión',
      type: 'date',
      description: 'Fecha de la última revisión legal del documento.',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
          marks: {
            decorators: [
              {title: 'Negrita', value: 'strong'},
              {title: 'Cursiva', value: 'em'},
              {title: 'Subrayado', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) =>
                      Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
                  },
                ],
              },
            ],
          },
          lists: [
            {title: 'Viñetas', value: 'bullet'},
            {title: 'Numerada', value: 'number'},
          ],
        },
      ],
      description: 'Contenido completo del texto legal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta título',
          type: 'string',
          description: 'Título para SEO. Máx. 60 caracteres.',
        }),
        defineField({
          name: 'description',
          title: 'Meta descripción',
          type: 'text',
          rows: 3,
          description: 'Descripción para SEO. Máx. 160 caracteres.',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Título (A-Z)',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      version: 'version',
      effectiveDate: 'effectiveDate',
    },
    prepare({title, version, effectiveDate}) {
      return {
        title,
        subtitle: `v${version || '?'} — Vigente desde ${effectiveDate || 'sin fecha'}`,
      }
    },
  },
})
