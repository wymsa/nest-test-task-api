import { roleEnum, statusEnum } from 'src/database/schemas'

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type UserRole = (typeof roleEnum.enumValues)[number]
export type UserStatus = (typeof statusEnum.enumValues)[number]
export type JwtPayload = { userID: number }
export type RequestUser = { userID: number; role: UserRole; status: UserStatus }
