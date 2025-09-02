import { compare, hash } from 'bcrypt'
import { Result } from 'src/common/types'

export function ok<T>(data: T): Result<T> {
  return { success: true, data }
}

export function fail<T = never>(error: string): Result<T> {
  return { success: false, error }
}

export async function hashPassword(password: string) {
  return await hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash)
}
