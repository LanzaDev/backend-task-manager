import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordCodeDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'abc123' })
  code!: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  password!: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  confirmPassword!: string;
}
