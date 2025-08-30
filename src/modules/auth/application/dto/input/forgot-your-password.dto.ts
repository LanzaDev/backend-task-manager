import { IsEmail } from 'class-validator';

export class ForgotYourPasswordDTO {
  @IsEmail()
  email!: string;
}
