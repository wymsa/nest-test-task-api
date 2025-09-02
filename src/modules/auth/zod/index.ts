import z from 'zod/v4'
import 'nestjs-zod'

export const SignInUserSchema = z.object({
  username: z.string().meta({
    description: 'Username of the user',
    examples: ['user_username'],
  }),
  password: z.string().meta({
    description: 'Password of the user',
    examples: ['secure_user_password'],
  }),
})
