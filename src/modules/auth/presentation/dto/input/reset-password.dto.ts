import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'abcdef123456...' })
  token!: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  password!: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  confirmPassword!: string;
}
