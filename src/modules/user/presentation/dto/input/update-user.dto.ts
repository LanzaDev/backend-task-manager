import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@/shared/types/role.type';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Lucas Lanza',
    description: 'Updated name. Optional',
    required: false,
  })
  newName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'lanzadev1@example.com',
    description: 'Updated email. Optional',
    required: false,
  })
  newEmail?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    example: 'Password123!',
    description:
      'New password for the user. Optional; if the requester is a regular user, current password is required to update. Admins can update without providing the current password. Must be at least 6 characters if provided.',
    required: false,
  })
  newPassword?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    example: 'Password123!',
    description:
      'Confirmation of the new password. Must match newPassword if provided.',
    required: false,
  })
  confirmNewPassword?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description:
      'Role of the user. Only an admin can update this field. Possible values: USER | ADMIN.',
    required: false,
  })
  role?: Role;
}
