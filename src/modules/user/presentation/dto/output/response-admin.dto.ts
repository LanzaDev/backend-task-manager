import { User } from '@/modules/user/domain/entities/user.entity';
import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ResponseAdminDTO {
  @IsUUID()
  @Expose()
  readonly id: string;

  @IsString()
  @Expose()
  readonly name: string;

  @IsEmail()
  @Expose()
  readonly email: string;

  @IsEnum(['USER', 'ADMIN'])
  @Expose()
  readonly role: string;

  @IsOptional()
  @IsDate()
  @Expose()
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
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
