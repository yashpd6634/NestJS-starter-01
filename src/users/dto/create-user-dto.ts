import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Grouplist } from 'src/grouplists/grouplists.entity';

export enum UserRole {
  Admin = 'ADMIN',
  Engineer = 'ENGINEER',
  Intern = 'INTERN',
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsEnum(UserRole, { message: 'Role needs to be correct value' })
  @IsNotEmpty()
  readonly role: UserRole;

  @IsNotEmpty()
  @IsDateString()
  readonly dateOfBirth: Date;
}
