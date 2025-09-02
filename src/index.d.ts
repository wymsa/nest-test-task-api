import { RequestUser } from 'src/common/types'

declare global {
  namespace Express {
    interface User extends RequestUser {}
  }
}
