import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, UserRole } from './dto/create-user-dto';
import { Connection } from 'src/common/constants/connection';
import { User } from './users.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(
      `This is the connection string ${JSON.stringify(this.connection)}`,
    );
  }

  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: UserRole): Promise<User[]> {
    try {
      return this.usersService.findAll(role);
    } catch (error) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id') // GET /users/:id
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post() // POST /users
  create(@Body() user: CreateUserDTO): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH /users/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    userUpdate: UpdateUserDTO,
  ): Promise<UpdateResult> {
    return this.usersService.update(id, userUpdate);
  }

  @Delete(':id') // DELETE /users/:id
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.delete(id);
  }
}
