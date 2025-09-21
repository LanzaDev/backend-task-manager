import { User } from '@/modules/user/domain/entities/user.entity';
import { Role } from '@/shared/types/role.type';
import { Expose } from 'class-transformer'
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export class ResponseUserDTO {
  @IsUUID()
  @Expose()
  readonly id: string;

  @IsString()
  @Expose()
  readonly name: string;

  @IsEmail()
  @Expose()
  readonly email: string;

  @Expose()
  @IsEnum(Role)
  readonly role: Role;

  constructor(user: User) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmailValue();
    this.role = user.getRole();
  }
}
