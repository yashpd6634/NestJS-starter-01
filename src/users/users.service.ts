import { forwardRef, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO, UserRole } from './dto/create-user-dto';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Grouplist } from 'src/grouplists/grouplists.entity';
import { Employee } from 'src/employees/employees.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-dto';

@Injectable()
//     {
//   scope: Scope.TRANSIENT,
// }
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Grouplist)
    private grouplistRepository: Repository<Grouplist>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userRepository.find({
        where: {
          role,
        },
        relations: ['grouplists', 'ownedGroups'],
      });
    }
    return this.userRepository.find({
      relations: ['grouplists', 'ownedGroups'],
    });
  }

  findOne(id: number): Promise<User> {
    const user = this.userRepository.findOne({
      where: { id },
      relations: ['grouplists', 'ownedGroups'],
    });

    return user;
  }

  async findOneByEmail(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.name = userDTO.name;
    user.email = userDTO.email;
    user.dateOfBirth = userDTO.dateOfBirth;
    user.role = userDTO.role;
    user.grouplists = [];
    user.ownedGroups = [];
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);

    const employee = this.employeeRepository.create();
    await this.employeeRepository.save(employee);

    user.employee = employee;

    const resUser = await this.userRepository.save(user);
    delete resUser.password;

    return resUser;
  }

  async update(id: number, updatedUser: UpdateUserDTO): Promise<UpdateResult> {
    const { grouplists, ownedGroups, ...otherUpdates } = updatedUser;

    let groupEntities: Grouplist[] = [];
    if (grouplists) {
      groupEntities = await this.grouplistRepository.find({
        where: { id: In(grouplists) },
      });
    }

    let ownedGroupEntities: Grouplist[] = [];
    if (ownedGroups) {
      ownedGroupEntities = await this.grouplistRepository.find({
        where: { id: In(ownedGroups) },
      });
    }

    const updateData = {
      ...otherUpdates,
      grouplists: groupEntities,
      ownedGroups: ownedGroupEntities,
    };

    return this.userRepository.update(id, updateData);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async paginate(
    options: IPaginationOptions,
    role?: UserRole,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.grouplists', 'grouplist')
      .leftJoinAndSelect('user.ownedGroups', 'ownedGroup');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    queryBuilder.orderBy('user.id', 'ASC');

    return paginate<User>(queryBuilder, options);
  }

  async findAllGrouplistOfUser(id: number): Promise<Grouplist[]> {
    return this.grouplistRepository.findBy({
      owner: await this.userRepository.findOneBy({ id }),
    });
  }
}
