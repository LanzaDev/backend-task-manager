import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { Expose } from 'class-transformer';

export class SignResponseDTO {
  @Expose()
  user: ResponseUserDTO;
  
  @Expose()
  token: string;
}
