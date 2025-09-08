import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schemas from '../../database/schemas'
import { UserEntity } from 'src/modules/users/users.entity'
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto'
import { UpdateUserDto } from 'src/modules/users/dtos/update-user.dto'
import { and, eq, SQLWrapper } from 'drizzle-orm'
import { Result } from 'src/common/types'
import { fail, ok } from 'src/common/utils'
import { DATABASE_PROVIDER_KEY } from 'src/common/constants'
import { IUsersRepository } from 'src/common/repositories/users.repository'
import { FilterUsersDto } from 'src/modules/users/dtos/filter-users.dto'
import { NotesEntity } from 'src/modules/notes/notes.entity'

@Injectable()
export class UsersRepository
  implements
    IUsersRepository<UserEntity, CreateUserDto, UpdateUserDto, FilterUsersDto>
{
  constructor(
    @Inject(DATABASE_PROVIDER_KEY)
    private readonly _database: NodePgDatabase<typeof schemas>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Result<UserEntity>> {
    const { username, password, role, status } = createUserDto

    const createdUser = await this._database
      .insert(schemas.usersSchema)
      .values({
        username,
        password,
        role,
        status,
      })
      .returning()

    return ok(
      new UserEntity(
        createdUser[0].id,
        createdUser[0].username,
        createdUser[0].password,
        createdUser[0].role,
        createdUser[0].status,
        createdUser[0].createdAt,
        createdUser[0].updatedAt,
      ),
    )
  }

  async update(
    userID: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Result<UserEntity>> {
    const { username, password, role, status } = updateUserDto

    const user = await this.findOneByID(userID)
    if (user.success === false) {
      return fail(user.error)
    }

    const setData = Object.fromEntries(
      Object.entries(updateUserDto).filter(([key, value]) => value != null),
    )
    if (Object.keys(setData).length === 0) {
      return ok(
        new UserEntity(
          user.data.id,
          user.data.username,
          user.data.password,
          user.data.role,
          user.data.status,
          user.data.createdAt,
          user.data.updatedAt,
          user.data.notes,
        ),
      )
    }

    const updatedUser = await this._database
      .update(schemas.usersSchema)
      .set({
        username,
        password,
        role,
        status,
      })
      .where(eq(schemas.usersSchema.id, userID))
      .returning()

    return ok(
      new UserEntity(
        updatedUser[0].id,
        updatedUser[0].username,
        updatedUser[0].password,
        updatedUser[0].role,
        updatedUser[0].status,
        updatedUser[0].createdAt,
        updatedUser[0].updatedAt,
        user.data.notes,
      ),
    )
  }

  async remove(userID: number): Promise<Result<UserEntity>> {
    const user = await this.findOneByID(userID)
    if (user.success === false) {
      return fail(user.error)
    }

    const deletedUser = await this._database
      .delete(schemas.usersSchema)
      .where(eq(schemas.usersSchema.id, userID))
      .returning()

    return ok(
      new UserEntity(
        deletedUser[0].id,
        deletedUser[0].username,
        deletedUser[0].password,
        deletedUser[0].role,
        deletedUser[0].status,
        deletedUser[0].createdAt,
        deletedUser[0].updatedAt,
        user.data.notes,
      ),
    )
  }

  async findAll(filterUsersDto: FilterUsersDto): Promise<Result<UserEntity[]>> {
    const { username, status } = filterUsersDto

    const filters: SQLWrapper[] = []
    if (username != null) {
      filters.push(eq(schemas.usersSchema.username, username))
    }
    if (status != null) {
      filters.push(eq(schemas.usersSchema.status, status))
    }

    const users = await this._database.query.usersSchema.findMany({
      where: and(...filters),
      with: {
        notes: true,
      },
    })

    const formattedResult = users.map(user => {
      return new UserEntity(
        user.id,
        user.username,
        user.password,
        user.role,
        user.status,
        user.createdAt,
        user.updatedAt,
        user.notes.map(note => {
          return new NotesEntity(
            note.id,
            note.title,
            note.content,
            note.createdAt,
            note.updatedAt,
            user.id,
          )
        }),
      )
    })

    return ok(formattedResult)
  }

  async findOneByID(userID: number): Promise<Result<UserEntity>> {
    const user = await this._database.query.usersSchema.findFirst({
      where: eq(schemas.usersSchema.id, userID),
      with: {
        notes: true,
      },
    })

    if (!user) {
      return fail(`User with ID: ${userID} not found`)
    }

    const formattedResult = new UserEntity(
      user.id,
      user.username,
      user.password,
      user.role,
      user.status,
      user.createdAt,
      user.updatedAt,
      user.notes.map(
        note =>
          new NotesEntity(
            note.id,
            note.title,
            note.content,
            note.createdAt,
            note.updatedAt,
            user.id,
          ),
      ),
    )

    return ok(formattedResult)
  }

  async findOneByUsername(username: string): Promise<Result<UserEntity>> {
    const user = await this._database.query.usersSchema.findFirst({
      where: eq(schemas.usersSchema.username, username),
      with: { notes: true },
    })

    if (!user) {
      return fail(`User with username: ${username} not found`)
    }

    const formattedResult = new UserEntity(
      user.id,
      user.username,
      user.password,
      user.role,
      user.status,
      user.createdAt,
      user.updatedAt,
      user.notes.map(
        note =>
          new NotesEntity(
            note.id,
            note.title,
            note.content,
            note.createdAt,
            note.updatedAt,
            user.id,
          ),
      ),
    )

    return ok(formattedResult)
  }
}
