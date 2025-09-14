import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDTO } from '@/modules/auth/presentation/dto/input/login.dto';
import { RegisterDTO } from '@/modules/auth/presentation/dto/input/register.dto';
import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';
import { ForgotYourPasswordDTO } from '@/modules/auth/presentation/dto/input/forgot-your-password.dto';
import { ResetPasswordDTO } from '@/modules/auth/presentation/dto/input/reset-password.dto';

import { SignInUseCase } from '@/modules/auth/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/auth/application/use-cases/sign-up.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { RecoverPasswordUseCase } from '@/modules/auth/application/use-cases/recover-password.use-case';
import { SignOutUseCase } from '@/modules/auth/application/use-cases/sign-out.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('signIn')
  async signIn(@Body() dto: LoginDTO): Promise<SignResponseDTO> {
    try {
      const { accessToken, refreshToken, user } =
        await this.signInUseCase.execute(dto);
      return { accessToken, refreshToken, user };
    } catch (err) {
      throw new HttpException(
        err.message || 'Unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('signUp')
  async signUp(@Body() dto: RegisterDTO): Promise<string> {
    try {
      const user = await this.signUpUseCase.execute(dto);
      return user;
    } catch (err) {
      throw new HttpException(
        err.message || 'Bad Request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotYourPasswordDTO) {
    await this.recoverPasswordUseCase.execute(dto);
    return { message: 'Recovery email sent if the email is registered' };
  }

  @Post('recover')
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    await this.resetPasswordUseCase.execute(dto);
    return { message: 'Password successfully reset' };
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const result = await this.verifyEmailUseCase.verifyEmailToken(token);
    return result;
  }

  @Post('logout')
  async logoutSession(@Body('refreshToken') refreshToken: string) {
    const success = await this.signOutUseCase.execute(refreshToken);
    return { message: success ? 'Logout successful' : 'No active session' };
  }
}
