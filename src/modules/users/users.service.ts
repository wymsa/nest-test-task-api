import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto'
import { UpdateUserDto } from 'src/modules/users/dtos/update-user.dto'
import { USERS_REPOSITORY_KEY } from 'src/common/constants'
import { IUsersRepository } from 'src/common/repositories/users.repository'
import { UserEntity } from 'src/modules/users/users.entity'
import { hashPassword } from 'src/common/utils'
import { FilterUsersDto } from 'src/modules/users/dtos/filter-users.dto'

@Injectable()
export class UsersService {
  private readonly _logger = new Logger(UsersService.name, { timestamp: true })
  constructor(
    @Inject(USERS_REPOSITORY_KEY)
    private readonly _usersRepository: IUsersRepository<
      UserEntity,
      CreateUserDto,
      UpdateUserDto,
      FilterUsersDto
    >,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await hashPassword(createUserDto.password)

    const createdUser = await this._usersRepository.create(createUserDto)
    if (createdUser.success === false)
      throw new HttpException(createdUser.error, 400)

    this._logger.log('User created')
    return createdUser.data
  }

  async update(
    userID: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    if (updateUserDto.password)
      updateUserDto.password = await hashPassword(updateUserDto.password)

    const updatedUser = await this._usersRepository.update(
      userID,
      updateUserDto,
    )
    if (updatedUser.success === false)
      throw new HttpException(updatedUser.error, 400)

    this._logger.log(`User ${userID} updated`)
    return updatedUser.data
  }

  async remove(userID: number): Promise<UserEntity> {
    const deletedUser = await this._usersRepository.remove(userID)
    if (deletedUser.success === false)
      throw new HttpException(deletedUser.error, 400)

    this._logger.log(`User ${userID} deleted`)
    return deletedUser.data
  }

  async findAll(filterUsersDto: FilterUsersDto): Promise<UserEntity[]> {
    const users = await this._usersRepository.findAll(filterUsersDto)
    if (users.success === false) throw new HttpException(users.error, 400)

    this._logger.log(`Users received`)
    return users.data
  }

  async findOneByID(userID: number): Promise<UserEntity> {
    const user = await this._usersRepository.findOneByID(userID)
    if (user.success === false) throw new HttpException(user.error, 400)

    this._logger.log(`User ${userID} received`)
    return user.data
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    const user = await this._usersRepository.findOneByUsername(username)

    if (user.success === false) throw new UnauthorizedException()

    this._logger.log(`User ${username} received`)
    return user.data
  }
}
