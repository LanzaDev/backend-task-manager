import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LogoutDTO {
  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  refreshToken: string;
}
