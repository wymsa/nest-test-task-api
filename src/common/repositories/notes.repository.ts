import { Result } from 'src/common/types'

export interface INotesRepository<T, CreateDto, UpdateDto, FilterDto> {
  create(createNoteDto: CreateDto, userID: number): Promise<Result<T>>
  update(noteID: number, updateNoteDto: UpdateDto): Promise<Result<T>>
  remove(noteID: number): Promise<Result<T>>
  findAll(filterNoteDto: FilterDto, userID?: number): Promise<Result<T[]>>
  findOneByID(noteID: number, userID?: number): Promise<Result<T>>
}
