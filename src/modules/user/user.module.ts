import { Module } from '@nestjs/common';

import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@/modules/user/infra/repositories/prisma-user.repository';

import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/delete-user.use-case';

import { UserController } from '@/modules/user/presentation/controllers/user.controller';
import { AdminController } from '@/modules/user/presentation/controllers/admin.controller';

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
