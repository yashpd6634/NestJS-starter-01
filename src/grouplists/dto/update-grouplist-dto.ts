import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/users.entity';

export class UpdateGrouplistDto {
  @IsNumber()
  @IsNotEmpty()
  readonly groupId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly userIds: number[];

  @IsNumber()
  @IsNotEmpty()
  readonly ownerId: number;
}
