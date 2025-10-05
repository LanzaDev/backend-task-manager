import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailCodeDTO {
  @Length(6)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc123' })
  code: string;
}
