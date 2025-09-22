import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';
import { ResetPasswordDTO } from '@/modules/auth/presentation/dto/input/reset-password.dto';

import { VerifyEmailTokenCommand } from '../../application/use-cases/commands/implements/verify-email-token.command';
import { CreateUserSessionCommand } from '../../application/use-cases/commands/implements/create-user-session.command';
import { CreateAccountCommand } from '../../application/use-cases/commands/implements/create-account.command';
import { LogoutUserCommand } from '../../application/use-cases/commands/implements/logout-user.command';

import { ValidateUserCredentialsQuery } from '../../application/use-cases/query/implements/validate-user-credentials.query';
import { RequestPasswordResetCommand } from '../../application/use-cases/commands/implements/request-password-reset.command';
import { ResetPasswordCommand } from '../../application/use-cases/commands/implements/reset-password.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  async signIn(@Body() credentials): Promise<SignResponseDTO> {
    const user = await this.queryBus.execute(
      new ValidateUserCredentialsQuery(credentials.email, credentials.password),
    );

    return this.commandBus.execute(new CreateUserSessionCommand(user));
  }

  @Post('register')
  async signUp(@Body() userData): Promise<string> {
    return this.commandBus.execute(new CreateAccountCommand(userData));
  }

  @Post('request-password-reset')
  async forgotPassword(@Body() dto) {
    return this.commandBus.execute(new RequestPasswordResetCommand(dto.email));
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    const command = new ResetPasswordCommand(
      dto.token,
      dto.password,
      dto.confirmPassword,
    );
    return this.commandBus.execute(command);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    return this.commandBus.execute(new VerifyEmailTokenCommand(token));
  }

  @Post('logout')
  async logoutSession(@Body('refreshToken') refreshToken: string) {
    return this.commandBus.execute(new LogoutUserCommand(refreshToken));
  }
}
