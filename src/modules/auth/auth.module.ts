import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config/env';

import { AuthController } from '@/modules/auth/presentation/controllers/auth.controller';
import { AuthTokenService } from '@/modules/auth/infra/providers/auth-token.service';
import { JwtStrategy } from '@/modules/auth/infra/strategies/jwt-strategy';

import { SignInUseCase } from '@/modules/auth/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/auth/application/use-cases/sign-up.use-case';
import { RecoverPasswordUseCase } from '@/modules/auth/application/use-cases/recover-password.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { SignOutUseCase } from '@/modules/auth/application/use-cases/sign-out.use-case';

import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@/modules/user/infra/repositories/prisma-user.repository';
import { IPasswordResetTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { PrismaPasswordResetTokenRepository } from '@/modules/auth/infra/repositories/prisma-auth.repository';

import { EmailModule } from '@/modules/mail/email.module';

import { AuthTokenCacheRepository } from '@/modules/auth/domain/repositories/auth-token-cache.repository';
import { RedisAuthTokenCacheRepository } from '@/modules/auth/infra/repositories/redis-auth.repository';
import { RedisClient } from '@/modules/auth/infra/config/redis.config';
import { RedisClientRepository } from '@/modules/auth/domain/repositories/redis-client.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.ACCESS_TOKEN_EXP },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthTokenService,
    JwtStrategy,
    SignInUseCase,
    SignUpUseCase,
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    SignOutUseCase,
    RedisAuthTokenCacheRepository,

    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IPasswordResetTokenRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
    {
      provide: AuthTokenCacheRepository,
      useClass: RedisAuthTokenCacheRepository,
    },
    {
      provide: RedisClientRepository,
      useClass: RedisClient,
    },
  ],
  exports: [AuthTokenService],
})
export class AuthModule {}
