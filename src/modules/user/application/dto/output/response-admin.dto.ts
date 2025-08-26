import { User } from '@/modules/user/domain/entities/user.entity';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ResponseAdminDTO {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsEnum(['USER', 'ADMIN'])
  readonly role: string;

  @IsOptional()
  @IsDate()
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  readonly updatedAt?: Date;

  constructor(user: User) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmailValue();
    this.role = user.getRole();
    this.createdAt = user.getCreatedAt() ? new Date(user.getCreatedAt()) : undefined;
    this.updatedAt = user.getUpdatedAt() ? new Date(user.getUpdatedAt()) : undefined;
  }
}
