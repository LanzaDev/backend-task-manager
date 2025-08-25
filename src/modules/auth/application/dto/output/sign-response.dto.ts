import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';

export class SignResponseDTO {
  user: ResponseUserDTO;
  token: string;
  redirectUrl: string;
}
