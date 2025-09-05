import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import { LocaAuthGuard } from 'src/common/guards/local-auth.guard'
import { RequestUser } from 'src/common/types'
import { AuthService } from 'src/modules/auth/auth.service'
import { SignInUserDto } from 'src/modules/auth/dtos/sign-in.dto'
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this._authService.signUp(createUserDto)
  }

  @Public()
  @Post('sign-in')
  @UseGuards(LocaAuthGuard)
  async signIn(
    @Body() signInDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: RequestUser,
  ) {
    const { accessToken, refreshToken } = await this._authService.signIn({
      userID: user.userID,
    })

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return { accessToken }
  }
}
