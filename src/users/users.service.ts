import { Injectable, Scope } from '@nestjs/common';
import { CreateUserDTO, UserRole } from './dto/create-user-dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
//     {
//   scope: Scope.TRANSIENT,
// }
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  private users = [];

  findAll(role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userRepository.find({
        where: {
          role,
        },
      });
    }
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ id });

    return user;
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.name = userDTO.name;
    user.email = userDTO.email;
    user.dateOfBirth = userDTO.dateOfBirth;
    user.role = userDTO.role;

    return await this.userRepository.save(user);
  }

  update(id: number, updatedUser: UpdateUserDTO): Promise<UpdateResult> {
    return this.userRepository.update(id, updatedUser);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async paginate(
    options: IPaginationOptions,
    role?: UserRole,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    queryBuilder.orderBy('user.id', 'ASC');

    return paginate<User>(queryBuilder, options);
  }
}
