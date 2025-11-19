import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { env } from '@/config/env';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { CreateUserSessionCommand } from '../implements/create-user-session.command';

import { SignResponseDTO } from '@/modules/auth/presentation/dto/output/sign-response.dto';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

import { Token } from '@/shared/domain/value-objects/token.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { parseTimeToSeconds } from '@/shared/utils/time.util';

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

    const existingUser = await this.userReadRepository.findByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!existingUser.isUserVerified()) {
      throw new UnauthorizedException('Email not verified');
    }

    const refreshPayload = {
      sub: existingUser.getId(),
      role: existingUser.getRole(),
      type: 'refresh',
      jti: randomUUID(),
    };

    const refreshToken = new Token(
      this.jwtService.sign(refreshPayload, {
        expiresIn: env.REFRESH_TOKEN_EXP,
      }),
    );

    await this.authTokenCacheWriteRepository.setRefreshToken(
      existingUser.getId(),
      refreshToken.getValue(),
      parseTimeToSeconds(env.REFRESH_TOKEN_EXP),
    );

    await this.authTokenCacheWriteRepository.setSession(
      existingUser.getId(),
      { refreshToken },
      parseTimeToSeconds(env.REFRESH_TOKEN_EXP),
    );

    const accessToken = new Token(
      this.jwtService.sign(
        { sub: existingUser.getId(), role: existingUser.getRole() },
        { expiresIn: env.ACCESS_TOKEN_EXP },
      ),
    );

    return new SignResponseDTO(
      new ResponseUserDTO(existingUser),
      accessToken.getValue(),
      refreshToken.getValue(),
    );
  }
}
