import { createZodDto } from 'nestjs-zod'
import { FilterUsersSchema } from 'src/modules/users/zod'

export class FilterUsersDto extends createZodDto(FilterUsersSchema.partial()) {}
