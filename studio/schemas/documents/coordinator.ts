import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'coordinator',
  title: 'Coordinador/a',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre completo',
      type: 'string',
      description: 'Nombre completo del coordinador/a (ej: "Marta López").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Se genera automáticamente.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'age',
      title: 'Edad',
      type: 'number',
      description: 'Edad del coordinador/a. Se muestra en su perfil.',
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      description: 'Rol (ej: "Coordinadora Senior", "Coordinador de Aventura").',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      rows: 4,
      description:
        'Biografía corta del coordinador/a. 2-3 frases en tono Travelhood: cercano y personal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Frase destacada',
      type: 'string',
      description:
        'Frase destacada del coordinador/a que lo defina (ej: "Lo mejor de un viaje no es el destino, es con quién lo compartes.").',
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      description: 'Foto del coordinador/a. Foto real, cercana y en acción. Mínimo 400x400px.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la foto',
      type: 'string',
      description: 'Texto alternativo de la foto (ej: "Marta López, coordinadora de Travelhood en Japón").',
    }),
    defineField({
      name: 'destinations',
      title: 'Destinos que coordina',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'destination'}]}],
      description: 'Destinos que coordina. Se muestran en su perfil.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
