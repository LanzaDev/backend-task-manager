import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

export class CreateUserSessionCommand {
  constructor(public readonly responseUserDTO: ResponseUserDTO) {}
}
