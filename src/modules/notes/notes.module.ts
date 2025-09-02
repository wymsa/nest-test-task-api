import { Module } from '@nestjs/common'
import { NotesService } from './notes.service'
import { NOTES_REPOSITORY_KEY } from 'src/common/constants'
import { NotesRepository } from 'src/modules/notes/notes.repository'
import { DatabaseModule } from 'src/database/database.module'
import { NotesController } from './notes.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    NotesService,
    {
      provide: NOTES_REPOSITORY_KEY,
      useClass: NotesRepository,
    },
  ],
  controllers: [NotesController],
})
export class NotesModule {}
