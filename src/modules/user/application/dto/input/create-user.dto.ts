import { RoleEnum } from '@/shared/domain/value-objects/role.vo';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
