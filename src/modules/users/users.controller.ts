import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/admin-required.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { OwnerGuard } from 'src/common/guards/owner.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { statusEnum } from 'src/database/schemas'
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto'
import { FilterUsersDto } from 'src/modules/users/dtos/filter-users.dto'
import { UpdateUserDto } from 'src/modules/users/dtos/update-user.dto'
import { UsersService } from 'src/modules/users/users.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  @Roles('ADMIN')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this._usersService.create(createUserDto)
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':userID')
  @Roles('ADMIN', 'USER')
  @UseGuards(OwnerGuard)
  async update(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this._usersService.update(userID, updateUserDto)
  }

  @ApiOperation({ summary: 'Block user' })
  @Patch(':userID/block')
  @Roles('ADMIN')
  async block(@Param('userID', ParseIntPipe) userID: number) {
    return await this._usersService.update(userID, {
      status: statusEnum.enumValues[1],
    })
  }

  @ApiOperation({ summary: 'Unblock user' })
  @Patch(':userID/unblock')
  @Roles('ADMIN')
  async unblock(@Param('userID', ParseIntPipe) userID: number) {
    return await this._usersService.update(userID, {
      status: statusEnum.enumValues[0],
    })
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @Roles('ADMIN')
  async getAll(@Query() filterUsersDto: FilterUsersDto) {
    return await this._usersService.getAll(filterUsersDto)
  }

  @ApiOperation({ summary: 'Get one user' })
  @Get(':userID')
  @Roles('ADMIN', 'USER')
  @UseGuards(OwnerGuard)
  async getOneByID(@Param('userID', ParseIntPipe) userID: number) {
    return await this._usersService.getOneByID(userID)
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':userID')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN', 'USER')
  @UseGuards(OwnerGuard)
  async delete(@Param('userID', ParseIntPipe) userID: number) {
    return await this._usersService.delete(userID)
  }
}
