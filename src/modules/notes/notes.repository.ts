import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_PROVIDER_KEY } from 'src/common/constants'
import { INotesRepository } from 'src/common/repositories/notes.repository'
import { CreateNoteDto } from 'src/modules/notes/dtos/create-note.dto'
import { FilterNotesDto } from 'src/modules/notes/dtos/filter-note.dto'
import { UpdateNoteDto } from 'src/modules/notes/dtos/update-note.dto'
import * as schemas from '../../database/schemas'
import { Result } from 'src/common/types'
import { NotesEntity } from 'src/modules/notes/notes.entity'
import { ok, fail } from 'src/common/utils'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class NotesRepository
  implements
    INotesRepository<NotesEntity, CreateNoteDto, UpdateNoteDto, FilterNotesDto>
{
  constructor(
    @Inject(DATABASE_PROVIDER_KEY)
    private readonly _database: NodePgDatabase<typeof schemas>,
  ) {}
  findOne(noteID: number, userID?: number): Promise<Result<NotesEntity>> {
    throw new Error('Method not implemented.')
  }
  async create(
    createNoteDto: CreateNoteDto,
    userID: number,
  ): Promise<Result<NotesEntity>> {
    const { title, content } = createNoteDto

    const createdNote = await this._database
      .insert(schemas.notesSchema)
      .values({
        ownerId: userID,
        title,
        content,
      })
      .returning()

    return ok(
      new NotesEntity(
        createdNote[0].id,
        createdNote[0].title,
        createdNote[0].content,
        createdNote[0].createdAt,
        createdNote[0].updatedAt,
        createdNote[0].ownerId,
      ),
    )
  }

  async update(
    noteID: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Result<NotesEntity>> {
    const { title, content } = updateNoteDto

    const note = await this.findOneByID(noteID)
    if (note.success === false) {
      return fail(note.error)
    }

    const setData = Object.fromEntries(
      Object.entries(updateNoteDto).filter(([key, value]) => value != null),
    )
    if (Object.keys(setData).length === 0) {
      return ok(
        new NotesEntity(
          note.data.id,
          note.data.title,
          note.data.content,
          note.data.createdAt,
          note.data.updatedAt,
          note.data.ownerID,
        ),
      )
    }

    const updatedNote = await this._database
      .update(schemas.notesSchema)
      .set({
        title,
        content,
      })
      .where(eq(schemas.notesSchema.id, noteID))
      .returning()

    return ok(
      new NotesEntity(
        updatedNote[0].id,
        updatedNote[0].title,
        updatedNote[0].content,
        updatedNote[0].createdAt,
        updatedNote[0].updatedAt,
        updatedNote[0].ownerId,
      ),
    )
  }

  async remove(noteID: number): Promise<Result<NotesEntity>> {
    const note = await this.findOneByID(noteID)
    if (note.success === false) {
      return fail(note.error)
    }

    const deletedNote = await this._database
      .delete(schemas.notesSchema)
      .where(eq(schemas.notesSchema.id, noteID))
      .returning()

    return ok(
      new NotesEntity(
        deletedNote[0].id,
        deletedNote[0].title,
        deletedNote[0].content,
        deletedNote[0].createdAt,
        deletedNote[0].updatedAt,
        deletedNote[0].ownerId,
      ),
    )
  }

  async findAll(
    filterNotesDto: FilterNotesDto,
    userID?: number,
  ): Promise<Result<NotesEntity[]>> {
    const { limit = 10, page = 1 } = filterNotesDto

    const notes = await this._database.query.notesSchema.findMany({
      ...(userID != null
        ? { where: eq(schemas.notesSchema.ownerId, userID) }
        : {}),
      limit: limit,
      offset: (page - 1) * 10,
    })

    return ok(
      notes.map(
        note =>
          new NotesEntity(
            note.id,
            note.title,
            note.content,
            note.createdAt,
            note.updatedAt,
            note.ownerId,
          ),
      ),
    )
  }

  async findOneByID(
    noteID: number,
    userID?: number,
  ): Promise<Result<NotesEntity>> {
    const note = await this._database.query.notesSchema.findFirst({
      ...(userID != null
        ? {
            where: and(
              eq(schemas.notesSchema.id, noteID),
              eq(schemas.notesSchema.ownerId, userID),
            ),
          }
        : { where: eq(schemas.notesSchema.id, noteID) }),
    })

    if (!note) {
      return fail(
        `Note with ID: ${noteID}${userID != null ? ` and user ID: ${userID}` : ''} not found`,
      )
    }

    return ok(
      new NotesEntity(
        note.id,
        note.title,
        note.content,
        note.createdAt,
        note.updatedAt,
        note.ownerId,
      ),
    )
  }
}
