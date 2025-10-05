import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lucas Lanza' })
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: 'mypassword123', minLength: 6 })
  password!: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: 'mypassword123', minLength: 6 })
  confirmPassword!: string;
}
