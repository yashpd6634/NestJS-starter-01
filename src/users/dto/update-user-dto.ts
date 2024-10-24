import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from './create-user-dto';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role needs to be correct value' })
  readonly role: UserRole;

  @IsOptional()
  @IsDateString()
  readonly dateOfBirth: Date;
}
