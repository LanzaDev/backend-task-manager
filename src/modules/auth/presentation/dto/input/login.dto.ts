import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  password!: string;
}
