import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infra/strategies/jwt-strategy';
import { env } from '@/config/env';
import { IUserRepository } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infra/repositories/prisma-user.repository';
import { AuthService } from './infra/providers/auth.service';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { RecoverPasswordUseCase } from './application/use-cases/recover-password.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { IPasswordResetTokenRepository } from './domain/repositories/password.repository';
import { PrismaPasswordResetTokenRepository } from './infra/repositories/prisma-auth.repository';
import { EmailModule } from '../mail/email.module';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN || '1h'
      }
  }),
  EmailModule,
],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    SignInUseCase,
    SignUpUseCase,
    PrismaPasswordResetTokenRepository,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IPasswordResetTokenRepository,
      useClass: PrismaPasswordResetTokenRepository
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
