import { Body, Controller, Post } from '@nestjs/common';
import { GrouplistService } from './grouplists.service';
import { CreateGrouplistDto } from './dto/create-grouplist-dto';
import { Grouplist } from './grouplists.entity';
import { ResponseGrouplistDto } from './dto/response-grouplist-dto';

@Controller('grouplists')
export class GrouplistController {
  constructor(private grouplistService: GrouplistService) {}

  @Post()
  create(
    @Body()
    grouplistDTO: CreateGrouplistDto,
  ): Promise<ResponseGrouplistDto> {
    return this.grouplistService.create(grouplistDTO);
  }
}
