import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDTO } from '../../application/dto/input/login.dto';
import { RegisterDTO } from '../../application/dto/input/register.dto';
import { SignResponseDTO } from '../../application/dto/output/sign-response.dto';
import { ForgotYourPasswordDTO } from '../../application/dto/input/forgot-your-password.dto';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { RecoverPasswordUseCase } from '../../application/use-cases/recover-password.use-case';
import { ResetPasswordDTO } from '../../application/dto/input/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly signUpUseCase: SignUpUseCase,
  ) {}

  @Post('signIn')
  async signIn(@Body() dto: LoginDTO): Promise<SignResponseDTO> {
    try {
      const { token, user } = await this.signInUseCase.execute(dto);
      return {
        token,
        user,
      };
    } catch (err) {
      throw new HttpException(
        err.message || 'Unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('signUp')
  async signUp(@Body() dto: RegisterDTO): Promise<SignResponseDTO> {
    try {
      const { token, user } = await this.signUpUseCase.execute(dto);
      return { token, user };
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    if (dto.password !== dto.confirmPassword) {
      throw new HttpException(
        'Passwords do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.resetPasswordUseCase.execute({
      token: dto.token,
      newPassword: dto.password,
    });
  }
}
