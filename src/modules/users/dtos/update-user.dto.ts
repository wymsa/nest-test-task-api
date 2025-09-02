import { createZodDto } from 'nestjs-zod'
import { UsersSchema } from 'src/modules/users/zod'

export class UpdateUserDto extends createZodDto(UsersSchema.partial()) {}
