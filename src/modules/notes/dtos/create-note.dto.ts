import { createZodDto } from 'nestjs-zod'
import { NotesSchema } from 'src/modules/notes/zod'

export class CreateNoteDto extends createZodDto(NotesSchema) {}
