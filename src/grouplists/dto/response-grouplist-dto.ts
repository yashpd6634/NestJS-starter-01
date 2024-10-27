import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ResponseUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

// grouplists.dto.ts
export class ResponseGrouplistDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ResponseUserDto)
  owner: ResponseUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseUserDto)
  users: ResponseUserDto[];
}
