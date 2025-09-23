import { LogoutDTO } from '@/modules/auth/presentation/dto/input/logout.dto';

export class LogoutUserCommand {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
  ) {}
}
