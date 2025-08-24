import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './infra/providers/auth.service';
import { ValidateUserPasswordUseCase } from './application/use-cases/validate-user-password.use-case';
import { JwtModule } from '@nestjs/jwt';
import { IUserRepository } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infra/repositories/prisma-user.repository';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { env } from '@/config/env';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN || '1h'
      }
  }),
],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInUseCase,
    SignUpUseCase,
    ValidateUserPasswordUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
