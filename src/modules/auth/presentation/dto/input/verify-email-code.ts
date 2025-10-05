import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailCodeDTO {
  @ApiProperty({ example: 'abc123' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  code: string;
}
