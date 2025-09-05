import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from 'src/common/types'
import { comparePassword } from 'src/common/utils'
import { SignInUserDto } from 'src/modules/auth/dtos/sign-in.dto'
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto'
import { UserEntity } from 'src/modules/users/users.entity'
import { UsersService } from 'src/modules/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = await this._usersService.create(createUserDto)

    return createdUser
  }

  async signIn(payload: JwtPayload) {
    const { accessToken, refreshToken } = await this.issueTokens(payload)
    return { accessToken, refreshToken }
  }

  async validateUser(signInUserDto: SignInUserDto): Promise<UserEntity>
  async validateUser(
    signInUserDto: undefined,
    userID: number,
  ): Promise<UserEntity>
  async validateUser(
    signInUserDto?: SignInUserDto,
    userID?: number,
  ): Promise<UserEntity> {
    let foundUser: UserEntity

    if (signInUserDto) {
      const { username, password } = signInUserDto
      foundUser = await this._usersService.getOneByUsername(username)

      const isPasswordValid = await comparePassword(
        password,
        foundUser.password,
      )
      if (!isPasswordValid) {
        throw new UnauthorizedException()
      }
    } else if (userID) {
      foundUser = await this._usersService.getOneByID(userID)
    }

    if (foundUser.status === 'BLOCKED') throw new UnauthorizedException()

    return foundUser
  }

  async issueTokens(payload: JwtPayload) {
    return {
      accessToken: await this._jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refreshToken: await this._jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    }
  }
}
