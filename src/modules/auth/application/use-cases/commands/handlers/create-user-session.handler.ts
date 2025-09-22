import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { env } from '@/config/env';

import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { CreateUserSessionCommand } from '../implements/create-user-session.command';

import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';

import { Token } from '@/shared/domain/value-objects/token.vo';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

@Injectable()
@CommandHandler(CreateUserSessionCommand)
export class CreateUserSessionHandler
  implements ICommandHandler<CreateUserSessionCommand>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly authTokenCacheWriteRepository: AbstractAuthTokenCacheWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: CreateUserSessionCommand): Promise<SignResponseDTO> {
    const email = new Email(command.responseUserDTO.email);

    const user = await this.userReadRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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

    return new SignResponseDTO(
      new ResponseUserDTO(user),
      accessToken.getValue(),
      refreshToken,
    );
  }
}
