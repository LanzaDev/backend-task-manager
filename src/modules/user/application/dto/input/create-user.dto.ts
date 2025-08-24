import { ArrayNotEmpty, IsArray, IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
