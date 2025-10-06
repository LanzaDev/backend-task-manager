import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'abcdef123456...' })
  token?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'abcdef' })
  code?: string;
}
