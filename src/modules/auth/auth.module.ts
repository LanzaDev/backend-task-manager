import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './infra/providers/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { IUserRepository } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infra/repositories/prisma-user.repository';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { env } from '@/config/env';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { JwtStrategy } from './infra/strategies/jwt-strategy';

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
    JwtStrategy,
    SignInUseCase,
    SignUpUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
