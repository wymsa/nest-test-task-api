import { HttpException, Inject, Injectable, Logger } from '@nestjs/common'
import { NOTES_REPOSITORY_KEY } from 'src/common/constants'
import { INotesRepository } from 'src/common/repositories/notes.repository'
import { CreateNoteDto } from 'src/modules/notes/dtos/create-note.dto'
import { FilterNotesDto } from 'src/modules/notes/dtos/filter-note.dto'
import { UpdateNoteDto } from 'src/modules/notes/dtos/update-note.dto'
import { NotesEntity } from 'src/modules/notes/notes.entity'

@Injectable()
export class NotesService {
  private readonly _logger = new Logger(NotesService.name, { timestamp: true })
  constructor(
    @Inject(NOTES_REPOSITORY_KEY)
    private readonly _notesRepository: INotesRepository<
      NotesEntity,
      CreateNoteDto,
      UpdateNoteDto,
      FilterNotesDto
    >,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
    userID: number,
  ): Promise<NotesEntity> {
    const createdNote = await this._notesRepository.create(
      createNoteDto,
      userID,
    )
    if (createdNote.success === false)
      throw new HttpException(createdNote.error, 400)

    this._logger.log('Note created')
    return createdNote.data
  }

  async update(
    noteID: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NotesEntity> {
    const updatedNote = await this._notesRepository.update(
      noteID,
      updateNoteDto,
    )
    if (updatedNote.success === false)
      throw new HttpException(updatedNote.error, 400)

    this._logger.log(`Note ${noteID} updated`)
    return updatedNote.data
  }

  async delete(noteID: number): Promise<NotesEntity> {
    const deletedNote = await this._notesRepository.delete(noteID)
    if (deletedNote.success === false)
      throw new HttpException(deletedNote.error, 400)

    this._logger.log(`Note ${noteID} deleted`)
    return deletedNote.data
  }

  async getAll(
    filterNotesDto: FilterNotesDto,
    userID?: number,
  ): Promise<NotesEntity[]> {
    const foundNotes = await this._notesRepository.getAll(
      filterNotesDto,
      userID,
    )
    if (foundNotes.success === false)
      throw new HttpException(foundNotes.error, 400)

    this._logger.log('Notes received')
    return foundNotes.data
  }

  async getOneByID(noteID: number, userID?: number): Promise<NotesEntity> {
    const foundNote = await this._notesRepository.getOneByID(noteID, userID)
    if (foundNote.success === false)
      throw new HttpException(foundNote.error, 400)

    this._logger.log(`Note ${noteID} received`)
    return foundNote.data
  }
}
