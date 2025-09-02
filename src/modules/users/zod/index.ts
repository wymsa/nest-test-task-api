import { roleEnum, statusEnum } from '../users.schema'
import { z } from 'zod/v4'
import 'zod-openapi'

export const UsersSchema = z.object({
  username: z.string().meta({
    description: 'Unique username of the user',
    examples: ['user_username'],
  }),
  password: z.string().meta({
    description: 'Password of the user',
    examples: ['secure_user_password'],
  }),
  role: z
    .enum(roleEnum.enumValues)
    .optional()
    .meta({
      description: 'Role of the user',
      examples: ['ADMIN', 'USER'],
    }),
  status: z
    .enum(statusEnum.enumValues)
    .optional()
    .meta({
      description: 'Account status of the user',
      examples: ['ACTIVE', 'BLOCKED'],
    }),
})

export const FilterUsersSchema = z.object({
  username: z
    .string()
    .optional()
    .meta({
      description: 'Username of the user',
      examples: ['user_username'],
    }),
  status: z
    .enum(statusEnum.enumValues)
    .optional()
    .meta({
      description: 'Account status of the user',
      examples: ['ACTIVE', 'BLOCKED'],
    }),
})
