import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@/config/env';
import { AuthTokenCacheRepository } from '@/modules/auth/domain/repositories/auth-token-cache.repository';

interface AuthUserPayload {
  id: string;
  role: string;
}

@Injectable()
export class AuthTokenService {
  constructor(private readonly jwtService: JwtService, private readonly authCache: AuthTokenCacheRepository) {}

  async generateTokens(user: AuthUserPayload) {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: env.ACCESS_TOKEN_EXP });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: env.REFRESH_TOKEN_EXP });

    await this.authCache.setToken(`access:${accessToken}`, payload, Number(env.ACCESS_TOKEN_EXP));
    await this.authCache.setToken(`refresh:${refreshToken}`, payload, Number(env.REFRESH_TOKEN_EXP));

    return { accessToken, refreshToken };
  }
}
