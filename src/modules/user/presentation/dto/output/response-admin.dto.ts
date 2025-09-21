import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Role } from '@/shared/types/role.type';

export class ResponseAdminDTO {
  @Expose()
  @IsUUID()
  @ApiProperty({
    example: 'a3b1c4d5-6789-40ab-91cd-ef1234567890',
    description: 'Unique identifier of the user',
  })
  readonly id: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'Lucas Lanza',
    description: 'Full name of the user',
  })
  readonly name: string;

  @Expose()
  @IsEmail()
  @ApiProperty({
    example: 'lanzadev1@gmail.com',
    description: 'Email address of the user',
  })
  readonly email: string;

  @Expose()
  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    description: 'Role assigned to the user',
  })
  readonly role: Role;

  @Expose()
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2025-09-21T12:00:00.000Z',
    description:
      'Timestamp when the resource was created. Automatically set by the system.',
    required: false,
  })
  readonly createdAt?: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2025-09-22T08:30:00.000Z',
    description:
      'Timestamp when the resource was last updated. Automatically updated by the system.',
    required: false,
  })
  readonly updatedAt?: Date;

  constructor(user: User) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmailValue();
    this.role = user.getRole();
    this.createdAt = user.getCreatedAt()
      ? new Date(user.getCreatedAt())
      : undefined;
    this.updatedAt = user.getUpdatedAt()
      ? new Date(user.getUpdatedAt())
      : undefined;
  }
}
