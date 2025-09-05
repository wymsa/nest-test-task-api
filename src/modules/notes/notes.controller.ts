import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { NoteOwnerGuard } from 'src/common/guards/note-owner.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { RequestUser } from 'src/common/types'
import { CreateNoteDto } from 'src/modules/notes/dtos/create-note.dto'
import { FilterNotesDto } from 'src/modules/notes/dtos/filter-note.dto'
import { UpdateNoteDto } from 'src/modules/notes/dtos/update-note.dto'
import { NotesService } from 'src/modules/notes/notes.service'

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(RoleGuard)
export class NotesController {
  constructor(private readonly _notesService: NotesService) {}

  @ApiOperation({ summary: 'Create a new note' })
  @Post()
  @Roles('ADMIN', 'USER')
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: RequestUser,
  ) {
    return await this._notesService.create(createNoteDto, user.userID)
  }

  @ApiOperation({ summary: 'Update note' })
  @Patch(':noteID')
  @Roles('ADMIN', 'USER')
  @UseGuards(NoteOwnerGuard)
  async update(
    @Param('noteID', ParseIntPipe) noteID: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return await this._notesService.update(noteID, updateNoteDto)
  }

  @ApiOperation({ summary: 'Get all notes' })
  @Get()
  @Roles('ADMIN', 'USER')
  async findAll(
    @Query() FilterNotesDto: FilterNotesDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { userID, role } = user
    if (role === 'ADMIN') {
      return await this._notesService.findAll(FilterNotesDto)
    }

    return await this._notesService.findAll(FilterNotesDto, userID)
  }

  @ApiOperation({ summary: 'Get one note' })
  @Get(':noteID')
  @Roles('ADMIN', 'USER')
  @UseGuards(NoteOwnerGuard)
  async findOneByID(@Param('noteID', ParseIntPipe) noteID: number) {
    return await this._notesService.findOneByID(noteID)
  }

  @ApiOperation({ summary: 'Delete note' })
  @Delete(':noteID')
  @Roles('ADMIN', 'USER')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(NoteOwnerGuard)
  async remove(@Param('noteID', ParseIntPipe) noteID: number) {
    return await this._notesService.remove(noteID)
  }
}
