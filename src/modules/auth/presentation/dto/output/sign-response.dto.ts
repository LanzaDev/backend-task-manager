import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { Expose } from 'class-transformer';

export class SignResponseDTO {
  @Expose()
  user: ResponseUserDTO;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken!: string;
}
