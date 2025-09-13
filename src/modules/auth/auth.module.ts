import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config/env';

import { AuthController } from '@/modules/auth/presentation/controllers/auth.controller';
import { JwtStrategy } from '@/common/strategies/jwt-strategy';

import { SignInUseCase } from '@/modules/auth/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/auth/application/use-cases/sign-up.use-case';
import { RecoverPasswordUseCase } from '@/modules/auth/application/use-cases/recover-password.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { SignOutUseCase } from '@/modules/auth/application/use-cases/sign-out.use-case';
import { EmailVerificationUseCase } from './application/use-cases/email-verification.use-case';

import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { IUserReadRepository } from '../user/domain/repositories/user.read-repository';
import { AuthTokenCacheReadRepository } from './domain/repositories/auth-token-cache.read-repository';
import { AuthTokenCacheWriteRepository } from './domain/repositories/auth-token-cache.write-repository';

import { IVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { RedisAuthTokenCacheQueryRepository } from './infra/repositories/cache/redis-auth.query.repository';
import { RedisAuthTokenCommandCacheRepository } from './infra/repositories/cache/redis-auth.command.repository';

import { PrismaUserQueryRepository } from '../user/infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from '../user/infra/repositories/database/prisma-user.command.repository';
import { PrismaPasswordResetTokenRepository } from '@/modules/auth/infra/repositories/database/prisma-auth.repository';

import { EmailModule } from '@/modules/mail/email.module';
import { CacheModule } from '@/shared/infra/cache/cache.module';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.ACCESS_TOKEN_EXP },
    }),
    EmailModule,
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignInUseCase,
    SignUpUseCase,
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    SignOutUseCase,
    EmailVerificationUseCase,
    {
      provide: IUserWriteRepository,
      useClass: PrismaUserCommandRepository,
    },
    {
      provide: IUserReadRepository,
      useClass: PrismaUserQueryRepository,
    },
    {
      provide: IVerificationTokenRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
    {
      provide: AuthTokenCacheReadRepository,
      useClass: RedisAuthTokenCacheQueryRepository,
    },
    {
      provide: AuthTokenCacheWriteRepository,
      useClass: RedisAuthTokenCommandCacheRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
