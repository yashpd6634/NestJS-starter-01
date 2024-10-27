import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/users.entity';

export class CreateGrouplistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly ownerId: number;
}
