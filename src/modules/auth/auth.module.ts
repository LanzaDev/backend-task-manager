import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@/modules/mail/email.module';
import { CacheModule } from '@/shared/infra/cache/cache.module';
import { env } from '@/config/env';

import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractUserReadRepository } from '../user/domain/repositories/user.read-repository';
import { AbstractAuthTokenCacheReadRepository } from './domain/repositories/auth-token-cache.read-repository';
import { AbstractAuthTokenCacheWriteRepository } from './domain/repositories/auth-token-cache.write-repository';
import { RedisAuthTokenCacheQueryRepository } from './infra/repositories/cache/redis-auth.query.repository';
import { RedisAuthTokenCommandCacheRepository } from './infra/repositories/cache/redis-auth.command.repository';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { PrismaUserQueryRepository } from '../user/infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from '../user/infra/repositories/database/prisma-user.command.repository';
import { PrismaPasswordResetTokenRepository } from '@/modules/auth/infra/repositories/database/prisma-auth.repository';

import { RequestPasswordResetHandler } from '@/modules/auth/application/use-cases/commands/handlers/request-password-reset.handler';
import { VerifyResetPasswordHandler } from './application/use-cases/commands/handlers/verify-reset-password.handler';
import { LogoutUserHandler } from '@/modules/auth/application/use-cases/commands/handlers/logout-user.handler';
import { ValidateUserCredentialsHandler } from './application/use-cases/query/handlers/validate-user-credentials.handler';
import { CreateUserSessionHandler } from './application/use-cases/commands/handlers/create-user-session.handler';
import { VerifyEmailHandler } from './application/use-cases/commands/handlers/verify.email.handler';
import { CreateAccountHandler } from './application/use-cases/commands/handlers/create-account.handler';

import { JwtStrategy } from '@/modules/auth/infra/strategies/jwt-strategy';
import { LoginAuthController } from './presentation/controllers/login-auth.controller';
import { VerifyEmailAuthController } from './presentation/controllers/verify-email-auth.controller';
import { RegisterAuthController } from './presentation/controllers/register-auth.controller';
import { LogoutAuthController } from './presentation/controllers/logout-auth.controller';
import { RequestPasswordResetAuthController } from './presentation/controllers/request-password-reset-auth.controller';
import { VerifyResetPasswordAuthController } from './presentation/controllers/reset-password-auth.controller';
import { ResetPasswordHandler } from './application/use-cases/commands/handlers/reset-password.handler';

const CommandHandlers = [
  CreateAccountHandler,
  CreateUserSessionHandler,
  LogoutUserHandler,
  RequestPasswordResetHandler,
  VerifyResetPasswordHandler,
  ResetPasswordHandler,
  VerifyEmailHandler,
];

const QueryHandlers = [ValidateUserCredentialsHandler];

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
  controllers: [
    LoginAuthController,
    LogoutAuthController,
    RegisterAuthController,
    RequestPasswordResetAuthController,
    VerifyResetPasswordAuthController,
    VerifyEmailAuthController,
  ],
  providers: [
    JwtStrategy,
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
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [],
})
export class AuthModule {}
