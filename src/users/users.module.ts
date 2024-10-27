import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Grouplist } from 'src/grouplists/grouplists.entity';
import { Employee } from 'src/employees/employees.entity';
import { GrouplistModule } from 'src/grouplists/grouplists.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grouplist, Employee])],
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
  exports: [UsersService],
})
export class UsersModule {}
