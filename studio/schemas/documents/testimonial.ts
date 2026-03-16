import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Solo el nombre de pila del viajero/a (ej: "Laura"). No apellidos por privacidad.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'age',
      title: 'Edad',
      type: 'number',
      description: 'Edad del viajero/a en el momento del viaje.',
      validation: (Rule) => Rule.required().min(16).max(99),
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      description: 'Ciudad de origen (ej: "Madrid", "Barcelona").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destino',
      type: 'reference',
      to: [{type: 'destination'}],
      description: '¿A qué destino corresponde este testimonio?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Testimonio',
      type: 'text',
      rows: 4,
      description:
        'Testimonio del viajero/a. Debe ser textual, en primera persona (ej: "Fui sin conocer a nadie. Volví con gente que ya considero amigos."). Máx. 2-3 frases.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Valoración',
      type: 'number',
      description: 'Valoración de 1 a 5 estrellas. Normalmente 5.',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      description: 'Foto del viajero/a. Opcional. Si hay, usar foto real del viaje.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la foto',
      type: 'string',
      description: 'Texto alternativo de la foto.',
    }),
    defineField({
      name: 'featured',
      title: '¿Destacado en home?',
      type: 'boolean',
      description: '¿Mostrar este testimonio en la home? Marcar solo los mejores (3-6 máximo).',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `📍 ${subtitle}` : ''}
    },
  },
})
