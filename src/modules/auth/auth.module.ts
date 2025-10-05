import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config/env';

import { AuthController } from '@/modules/auth/presentation/controllers/auth.controller';
import { JwtStrategy } from '@/modules/auth/infra/strategies/jwt-strategy';

import { RequestPasswordResetHandler } from '@/modules/auth/application/use-cases/commands/handlers/request-password-reset.handler';
import { ResetPasswordCodeHandler } from './application/use-cases/commands/handlers/reset-password-code.handler';
import { ResetPasswordTokenHandler } from '@/modules/auth/application/use-cases/commands/handlers/reset-password-token.handler';
import { LogoutUserHandler } from '@/modules/auth/application/use-cases/commands/handlers/logout-user.handler';

import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractUserReadRepository } from '../user/domain/repositories/user.read-repository';
import { AbstractAuthTokenCacheReadRepository } from './domain/repositories/auth-token-cache.read-repository';
import { AbstractAuthTokenCacheWriteRepository } from './domain/repositories/auth-token-cache.write-repository';

import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { RedisAuthTokenCacheQueryRepository } from './infra/repositories/cache/redis-auth.query.repository';
import { RedisAuthTokenCommandCacheRepository } from './infra/repositories/cache/redis-auth.command.repository';

import { PrismaUserQueryRepository } from '../user/infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from '../user/infra/repositories/database/prisma-user.command.repository';
import { PrismaPasswordResetTokenRepository } from '@/modules/auth/infra/repositories/database/prisma-auth.repository';

import { EmailModule } from '@/modules/mail/email.module';
import { CacheModule } from '@/shared/infra/cache/cache.module';
import { ValidateUserCredentialsHandler } from './application/use-cases/query/handlers/validate-user-credentials.handler';
import { CreateUserSessionHandler } from './application/use-cases/commands/handlers/create-user-session.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { VerifyEmailHandler } from './application/use-cases/commands/handlers/verify.email.handler';
import { CreateAccountHandler } from './application/use-cases/commands/handlers/create-account.handler';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.ACCESS_TOKEN_EXP },
    }),
    EmailModule,
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [
    VerifyEmailHandler,
    JwtStrategy,
    CreateAccountHandler,
    RequestPasswordResetHandler,
    LogoutUserHandler,
    ResetPasswordCodeHandler,
    ResetPasswordTokenHandler,
    ValidateUserCredentialsHandler,
    CreateUserSessionHandler,
    {
      provide: AbstractUserWriteRepository,
      useClass: PrismaUserCommandRepository,
    },
    {
      provide: AbstractUserReadRepository,
      useClass: PrismaUserQueryRepository,
    },
    {
      provide: AbstractVerificationRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
    {
      provide: AbstractAuthTokenCacheReadRepository,
      useClass: RedisAuthTokenCacheQueryRepository,
    },
    {
      provide: AbstractAuthTokenCacheWriteRepository,
      useClass: RedisAuthTokenCommandCacheRepository,
    },
    {
      provide: AbstractVerificationRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
