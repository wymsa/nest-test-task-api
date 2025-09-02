import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { RequestUser } from 'src/common/types'
import { AuthService } from 'src/modules/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    })
  }

  async validate(username: string, password: string): Promise<RequestUser> {
    const { id, role, status } = await this._authService.validateUser({
      username,
      password,
    })

    return { userID: id, role: role, status }
  }
}
