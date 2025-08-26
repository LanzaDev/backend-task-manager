import { Module } from '@nestjs/common';
import { IUserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { AdminController } from './presentation/controllers/admin.controller';

@Module({
  imports: [],
  controllers: [UserController, AdminController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
