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
