import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { env } from '@/config/env';

import { User } from '@/modules/user/domain/entities/user.entity';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { AuthTokenCacheRepository } from '@/modules/auth/domain/repositories/auth-token-cache.repository';

import { RegisterDTO } from '../dto/input/register.dto';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { SignResponseDTO } from '@/modules/auth/application/dto/output/sign-response.dto';

import { Token } from '@/shared/domain/value-objects/token.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly authTokenCacheRepository: AuthTokenCacheRepository,
  ) {}

  async execute(dto: RegisterDTO): Promise<SignResponseDTO> {
    const email = new Email(dto.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const password = await Password.create(dto.password);
    const user = new User({
      name: dto.name,
      email,
      password,
    });

    await this.userRepository.create(user);

    // Access token (curto prazo)
    const accessToken = new Token(
      this.jwtService.sign(
        { sub: user.getId(), role: user.getRole() },
        { expiresIn: env.ACCESS_TOKEN_EXP },
      ),
    );

    // Refresh token (UUID aleatório)
    const refreshToken = randomUUID();

    // Salva no Redis com TTL
    await this.authTokenCacheRepository.setSession(
      user.getId(),
      { refreshToken },
      env.REFRESH_TOKEN_EXP,
    );

    return {
      user: new ResponseUserDTO(user),
      accessToken: accessToken.getValue(),
      refreshToken,
    };
  }
}
