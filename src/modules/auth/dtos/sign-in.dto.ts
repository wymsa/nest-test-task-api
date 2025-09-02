import { createZodDto } from 'nestjs-zod'
import { SignInUserSchema } from 'src/modules/auth/zod'

export class SignInUserDto extends createZodDto(SignInUserSchema) {}
