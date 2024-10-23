import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { connection } from 'src/common/constants/connection';

const mockUsersService = {
  findAll() {
    return [
      {
        name: 'Gara the sand',
        email: 'gara.sand@mail.com',
        role: 'INTERN',
      },
    ];
  },
};

@Module({
  controllers: [UsersController],
  providers: [
    //standard provider
    UsersService,
    //class provider
    // {
    //   provide: UsersService,
    //   useClass: UsersService,
    // },

    //value provider
    // {
    //   provide: UsersService,
    //   useValue: mockUsersService,
    // },

    // add constant value (non service)
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class UsersModule {}
