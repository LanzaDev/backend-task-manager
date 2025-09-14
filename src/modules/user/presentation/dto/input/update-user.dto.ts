import { RoleEnum } from '@/shared/types/role.type';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
