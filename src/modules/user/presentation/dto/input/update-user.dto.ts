import { Role } from '@/shared/types/role.type';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  newName?: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @MinLength(6)
  newPassword?: string;

  @IsOptional()
  @MinLength(6)
  confirmNewPassword?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
