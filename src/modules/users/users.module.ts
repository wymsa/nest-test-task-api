import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { USERS_REPOSITORY_KEY } from 'src/common/constants'
import { UsersRepository } from 'src/modules/users/users.repository'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY_KEY,
      useClass: UsersRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
