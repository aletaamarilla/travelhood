import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {structure} from './deskStructure'

const SINGLETON_TYPES = new Set(['siteSettings'])

export default defineConfig({
  name: 'travelhood',
  title: 'Travelhood Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return input.filter(
          ({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action),
        )
      }
      return input
    },
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter(({templateId}) => !SINGLETON_TYPES.has(templateId))
      }
      return prev
    },
  },
})
