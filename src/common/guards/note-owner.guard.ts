import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { NotesService } from 'src/modules/notes/notes.service'

@Injectable()
export class NoteOwnerGuard implements CanActivate {
  constructor(private readonly _notesService: NotesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user
    const resourceNoteID = request.params.noteID

    const foundNote = await this._notesService.getOneByID(
      Number(resourceNoteID),
    )

    if (user.role === 'ADMIN') return true

    if (foundNote.ownerID !== user.userID) return false

    return false
  }
}
