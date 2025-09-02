import { createZodDto } from 'nestjs-zod'
import { NotesSchema } from 'src/modules/notes/zod'

export class UpdateNoteDto extends createZodDto(NotesSchema.partial()) {}
