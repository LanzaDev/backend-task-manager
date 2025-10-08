import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants';

export class CreateUserSessionCommand {
  readonly [RESULT_TYPE_SYMBOL] = {} as SignResponseDTO;

  constructor(public readonly responseUserDTO: ResponseUserDTO) {}
}
