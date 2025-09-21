import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@/shared/types/role.type';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Lucas Lanza',
    description: 'Full name of the new user',
  })
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'lanzadev1@example.com',
    description: 'Email address of the new user',
  })
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Password123!',
    description: 'Password for the new user',
    minLength: 6,
  })
  password!: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Role of the new user',
    required: false,
  })
  role?: Role;
}
