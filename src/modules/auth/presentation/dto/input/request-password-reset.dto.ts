import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;
}
