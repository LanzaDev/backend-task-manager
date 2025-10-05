import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserSessionCommand } from '../../application/use-cases/commands/implements/create-user-session.command';
import { CreateAccountCommand } from '../../application/use-cases/commands/implements/create-account.command';
import { LogoutUserCommand } from '../../application/use-cases/commands/implements/logout-user.command';
import { ResetPasswordCommand } from '../../application/use-cases/commands/implements/reset-password.command';
import { RequestPasswordResetCommand } from '../../application/use-cases/commands/implements/request-password-reset.command';

import { ValidateUserCredentialsQuery } from '../../application/use-cases/query/implements/validate-user-credentials.query';

import { LoginDTO } from '../dto/input/login.dto';
import { RegisterDTO } from '../dto/input/register.dto';
import { LogoutDTO } from '../dto/input/logout.dto';
import { ResetPasswordCodeDTO } from '../dto/input/reset-password-code.dto';
import { ResetPasswordTokenDTO } from '@/modules/auth/presentation/dto/input/reset-password-token.dto';
import { RequestPasswordResetDTO } from '../dto/input/request-password-reset.dto';
import { VerifyEmailTokenDTO } from '../dto/input/verify-email-token.dto';
import { VerifyEmailCodeDTO } from '../dto/input/verify-email-code';

import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';
import { MessageResponseDTO } from '../../../../core/presentation/dto/message-response.dto';
import { VerifyEmailCommand } from '../../application/use-cases/commands/implements/verify-email.command';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: 'Login successful',
    type: SignResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Body() dto: LoginDTO): Promise<SignResponseDTO> {
    return await this.queryBus
      .execute(new ValidateUserCredentialsQuery(dto.email, dto.password))
      .then((user) =>
        this.commandBus.execute(new CreateUserSessionCommand(user)),
      );
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({
    description: 'Account successfully created',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid input data' })
  async signUp(@Body() dto: RegisterDTO): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new CreateAccountCommand(
        dto.name,
        dto.email,
        dto.password,
        dto.confirmPassword,
      ),
    );

    return new MessageResponseDTO(
      'User registered successfully. Please verify your email.',
    );
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: RequestPasswordResetDTO })
  @ApiOkResponse({
    description: 'Password reset email sent',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email' })
  async forgotPassword(
    @Body() dto: RequestPasswordResetDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(new RequestPasswordResetCommand(dto.email));
    return new MessageResponseDTO('Password reset email sent successfully.');
  }

  @Post('reset-password-code')
  @ApiOperation({ summary: 'Reset user password using code' })
  @ApiBody({ type: ResetPasswordCodeDTO })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid code or password mismatch',
  })
  async resetPasswordCode(
    @Body() dto: ResetPasswordCodeDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new ResetPasswordCommand(dto.password, dto.confirmPassword, dto.code),
    );

    return new MessageResponseDTO('Password reset successfully.');
  }

  @Post('reset-password-token')
  @ApiOperation({ summary: 'Reset user password using token' })
  @ApiBody({ type: ResetPasswordTokenDTO })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token or password mismatch',
  })
  async resetPasswordToken(
    @Body() dto: ResetPasswordTokenDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new ResetPasswordCommand(
        dto.password,
        dto.confirmPassword,
        undefined,
        dto.token,
      ),
    );
    return new MessageResponseDTO('Password reset successfully.');
  }

  @Post('verify-email-token')
  @ApiOperation({ summary: 'Verify user email using token' })
  @ApiBody({ type: VerifyEmailTokenDTO })
  @ApiOkResponse({
    description: 'Email verified successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async verifyEmailToken(
    @Body() dto: VerifyEmailTokenDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(new VerifyEmailCommand(dto.token));
    return new MessageResponseDTO('Email verified successfully.');
  }

  @Post('verify-email-code')
  @ApiOperation({ summary: 'Verify user email using code' })
  @ApiBody({ type: VerifyEmailCodeDTO })
  @ApiOkResponse({
    description: 'Email verified successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async verifyEmailCode(
    @Body() dto: VerifyEmailCodeDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(new VerifyEmailCommand(undefined, dto.code));
    return new MessageResponseDTO('Email verified successfully.');
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
  @ApiBody({ type: LogoutDTO })
  @ApiOkResponse({
    description: 'Logout successful',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token or user mismatch' })
  async logoutSession(@Body() dto: LogoutDTO): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new LogoutUserCommand(dto.userId, dto.refreshToken),
    );
    return new MessageResponseDTO('Logout successful.');
  }
}
