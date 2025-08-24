import { User } from '@/modules/user/domain/entities/user.entity';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export class ResponseUserDTO {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsEnum(['USER', 'ADMIN'])
  readonly role: string;

  constructor(user: User) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmailValue();
    this.role = user.getRole();
  }
}
