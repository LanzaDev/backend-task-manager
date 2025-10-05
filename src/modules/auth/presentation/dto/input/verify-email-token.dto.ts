import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailTokenDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1a54780a-7208-483b-ba0d-5a7e8ee978ec' })
  token: string;
}
