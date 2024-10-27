import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Grouplist } from './grouplists.entity';
import { GrouplistController } from './grouplists.controller';
import { GrouplistService } from './grouplists.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grouplist])],
  controllers: [GrouplistController],
  providers: [GrouplistService],
  exports: [GrouplistService],
})
export class GrouplistModule {}
