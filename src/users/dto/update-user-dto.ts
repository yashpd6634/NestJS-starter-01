import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from './create-user-dto';
import { Grouplist } from 'src/grouplists/grouplists.entity';

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

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly grouplists: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly ownedGroups: number[];
}
