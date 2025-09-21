import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class DeleteUserDTO {
  @IsUUID()
  @ApiProperty({
    example: 'a3b1c4d5-6789-40ab-91cd-ef1234567890',
    description: 'Unique identifier of the user to be deleted',
  })
  id!: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @ApiProperty({
    example: 'currentPass123',
    description:
      'Current password of the user. Required for deleting own account (user role). Not required if the requester is an admin.',
    required: false,
  })
  password?: string;
}
