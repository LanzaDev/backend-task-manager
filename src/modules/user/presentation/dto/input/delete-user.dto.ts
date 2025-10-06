import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class DeleteUserDTO {
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
