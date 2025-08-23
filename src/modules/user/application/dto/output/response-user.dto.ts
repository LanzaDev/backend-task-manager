import { IsEmail, IsString, IsUUID } from 'class-validator';

export class ResponseUserDTO {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
