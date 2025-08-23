import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { IUserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindUserUseCase,
    DeleteUserUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
