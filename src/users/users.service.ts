import { Injectable, Scope } from '@nestjs/common';
import { CreateUserDTO, UserRole } from './dto/create-user-dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
//     {
//   scope: Scope.TRANSIENT,
// }
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepositry: Repository<User>,
  ) {}
  private users = [];

  findAll(role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userRepositry.find({
        where: {
          role,
        },
      });
    }
    return this.userRepositry.find();
  }

  findOne(id: number): Promise<User> {
    const user = this.userRepositry.findOneBy({ id });

    return user;
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.name = userDTO.name;
    user.email = userDTO.email;
    user.dateOfBirth = userDTO.dateOfBirth;
    user.role = userDTO.role;

    return await this.userRepositry.save(user);
  }

  update(id: number, updatedUser: UpdateUserDTO): Promise<UpdateResult> {
    return this.userRepositry.update(id, updatedUser);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepositry.delete(id);
  }
}
