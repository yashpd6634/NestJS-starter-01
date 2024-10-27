import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grouplist } from './grouplists.entity';
import { User } from 'src/users/users.entity';
import { CreateGrouplistDto } from './dto/create-grouplist-dto';
import { UpdateGrouplistDto } from './dto/update-grouplist-dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { ResponseGrouplistDto } from './dto/response-grouplist-dto';

@Injectable()
export class GrouplistService {
  constructor(
    @InjectRepository(Grouplist)
    private grouplistRepository: Repository<Grouplist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    grouplistDTO: CreateGrouplistDto,
  ): Promise<ResponseGrouplistDto> {
    const owner = await this.userRepository.findOne({
      where: { id: grouplistDTO.ownerId },
      relations: ['grouplists', 'ownedGroups'],
    });
    if (!owner) throw new NotFoundException('Owner not found');

    const grouplist = new Grouplist();
    grouplist.name = grouplistDTO.name;
    grouplist.owner = owner;
    grouplist.users = [owner];
    await this.grouplistRepository.save(grouplist);

    owner.grouplists.push(grouplist);
    owner.ownedGroups.push(grouplist);
    await this.userRepository.save(owner);

    return {
      id: grouplist.id,
      name: grouplist.name,
      owner: { id: owner.id, name: owner.name },
      users: grouplist.users.map((user) => ({ id: user.id, name: user.name })),
    };
  }

  async addUsersToGroup(
    updateGroupDTO: UpdateGrouplistDto,
  ): Promise<Grouplist> {
    const grouplist = await this.grouplistRepository.findOne({
      where: { id: updateGroupDTO.groupId },
      relations: ['owners', 'users'],
    });
    if (!grouplist) throw new NotFoundException('Group not found');
    if (grouplist.owner.id !== updateGroupDTO.ownerId)
      throw new ForbiddenException('Only the owner can add users to the group');

    for (const userId of updateGroupDTO.userIds) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['grouplists'],
      });
      if (!user)
        throw new NotFoundException(`User with ID ${userId} not found`);

      if (!grouplist.users.some((u) => u.id === user.id)) {
        grouplist.users.push(user);
      }

      if (!user.grouplists.some((g) => g.id === grouplist.id)) {
        user.grouplists.push(grouplist);
        await this.userRepository.save(user);
      }
    }

    await this.grouplistRepository.save(grouplist);

    return grouplist;
  }

  async removeUserFromGroup(
    updateGroupDTO: UpdateGrouplistDto,
  ): Promise<Grouplist> {
    const group = await this.grouplistRepository.findOne({
      where: { id: updateGroupDTO.groupId },
      relations: ['owner', 'users'],
    });
    if (!group) throw new NotFoundException('Group not found');
    if (group.owner.id !== updateGroupDTO.ownerId)
      throw new ForbiddenException(
        'Only the owner can remove users from the group',
      );

    for (const userId of updateGroupDTO.userIds) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['grouplists'],
      });
      if (!user) throw new NotFoundException('User not found');

      group.users = group.users.filter((u) => u.id !== user.id);

      user.grouplists = user.grouplists.filter((g) => g.id !== group.id);
      await this.userRepository.save(user);
    }

    await this.grouplistRepository.save(group);

    return group;
  }
}
