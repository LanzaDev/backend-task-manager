import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDTO } from '../../application/dto/input/login.dto';
import { RegisterDTO } from '../../application/dto/input/register.dto';
import { SignResponseDTO } from '../../application/dto/output/sign-response.dto';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';

@Controller('auth')
export class AuthController {
  constructor(
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
}
