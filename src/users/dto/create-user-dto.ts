import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
}
