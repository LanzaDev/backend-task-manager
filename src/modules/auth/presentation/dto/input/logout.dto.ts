import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDTO {
  @Expose()
  @IsString()
  @ApiProperty({ example: '3500347a-ab2a-46b2-b48c-e4a244c2ca39' })
  userId: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: '4b42c17a-11f1-4ad8-9345-08d93bcaafc3' })
  refreshToken: string;
}
