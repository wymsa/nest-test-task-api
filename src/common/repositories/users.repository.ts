import { Result } from 'src/common/types'

export interface IUsersRepository<T, CreateDto, UpdateDto, FilterDto> {
  create(createUserDto: CreateDto): Promise<Result<T>>
  update(userID: number, updateUserDto: UpdateDto): Promise<Result<T>>
  remove(userID: number): Promise<Result<T>>
  findAll(filterUserDto: FilterDto): Promise<Result<T[]>>
  findOneByID(userID: number): Promise<Result<T>>
  findOneByUsername(username: string): Promise<Result<T>>
}
