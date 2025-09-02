import { Result } from 'src/common/types'

export interface INotesRepository<T, CreateDto, UpdateDto, FilterDto> {
  create(createNoteDto: CreateDto, userID: number): Promise<Result<T>>
  update(noteID: number, updateNoteDto: UpdateDto): Promise<Result<T>>
  delete(noteID: number): Promise<Result<T>>
  getAll(filterNoteDto: FilterDto, userID?: number): Promise<Result<T[]>>
  getOneByID(noteID: number, userID?: number): Promise<Result<T>>
}
