import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  token!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword!: string;
}
