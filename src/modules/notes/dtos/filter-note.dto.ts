import { createZodDto } from 'nestjs-zod'
import { FilterNotesSchema } from 'src/modules/notes/zod'

export class FilterNotesDto extends createZodDto(FilterNotesSchema) {}
