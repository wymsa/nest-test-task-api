import { z } from 'zod/v4'
import 'zod-openapi'

export const NotesSchema = z.object({
  title: z.string().meta({
    description: 'Title of the note',
    examples: ['note_title'],
  }),
  content: z.string().meta({
    description: 'Content of the note',
    examples: ['note_content'],
  }),
})

export const FilterNotesSchema = z.object({
  page: z
    .number()
    .optional()
    .meta({
      description: 'Page of the notes list',
      examples: [1],
    }),
  limit: z
    .number()
    .optional()
    .meta({
      description: 'Limit of the notes count from notes list',
      examples: [10],
    }),
})
