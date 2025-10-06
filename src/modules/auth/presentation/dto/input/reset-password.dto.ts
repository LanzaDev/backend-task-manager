import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  password!: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  confirmPassword!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'abcdef123456...' })
  token?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'abcdef' })
  code?: string;
}
