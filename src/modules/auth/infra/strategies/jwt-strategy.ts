import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '@/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    // o que você retornar aqui vai estar disponível em request.user
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
