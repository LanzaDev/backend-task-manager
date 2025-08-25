import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { IUserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { AdminController } from './presentation/controllers/admin.controller';
import { AdminUserService } from './application/services/admin-user.service';

@Module({
  imports: [],
  controllers: [UserController, AdminController],
  providers: [
    CreateUserUseCase,
    FindUserUseCase,
    DeleteUserUseCase,
    AdminUserService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
