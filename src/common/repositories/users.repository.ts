import { Result } from 'src/common/types'

export interface IUsersRepository<T, CreateDto, UpdateDto, FilterDto> {
  create(createUserDto: CreateDto): Promise<Result<T>>
  update(userID: number, updateUserDto: UpdateDto): Promise<Result<T>>
  delete(userID: number): Promise<Result<T>>
  getAll(filterUserDto: FilterDto): Promise<Result<T[]>>
  getOneByID(userID: number): Promise<Result<T>>
  getOneByUsername(username: string): Promise<Result<T>>
}
