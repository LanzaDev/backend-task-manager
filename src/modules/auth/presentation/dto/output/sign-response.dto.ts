import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { Expose } from 'class-transformer';

export class SignResponseDTO {
  @Expose()
  user: ResponseUserDTO;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  constructor(user: ResponseUserDTO, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
