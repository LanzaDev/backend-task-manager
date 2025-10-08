import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants';

export class ValidateUserCredentialsQuery {
  readonly [RESULT_TYPE_SYMBOL] = {} as ResponseUserDTO;

  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
