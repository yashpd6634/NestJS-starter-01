import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(loginDto: LoginDTO): Promise<User> {
    const user = await this.userService.findOneByEmail(loginDto);
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException('Password does not match'); // 5.
    }
  }
}
