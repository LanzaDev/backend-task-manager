import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { env } from '@/config/env';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';

import { LoginDTO } from '@/modules/auth/presentation/dto/input/login.dto';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';

import { Token } from '@/shared/domain/value-objects/token.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly authTokenCacheWriteRepository: AbstractAuthTokenCacheWriteRepository,
  ) {}

  async execute(dto: LoginDTO): Promise<SignResponseDTO> {
    const email = new Email(dto.email);

    const user = await this.userReadRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const valid = await user.comparePassword(dto.password);

    if (!valid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified()) {
      throw new UnauthorizedException('Email not verified');
    }

    const refreshToken = randomUUID();

    await this.authTokenCacheWriteRepository.setRefreshToken(
      refreshToken,
      user.getId(),
      env.REFRESH_TOKEN_EXP,
    );

    await this.authTokenCacheWriteRepository.setSession(
      user.getId(),
      { refreshToken },
      env.REFRESH_TOKEN_EXP,
    );

    const accessToken = new Token(
      this.jwtService.sign(
        { sub: user.getId(), role: user.getRole() },
        { expiresIn: env.ACCESS_TOKEN_EXP },
      ),
    );

    return {
      user: new ResponseUserDTO(user),
      accessToken: accessToken.getValue(),
      refreshToken,
    };
  }
}
