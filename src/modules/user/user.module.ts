import { Module } from '@nestjs/common';

import { IUserReadRepository } from './domain/repositories/user.read-repository';
import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { PrismaUserQueryRepository } from './infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from './infra/repositories/database/prisma-user.command.repository';

import { CreateUserUseCase } from '@/modules/user/application/use-cases/commands/create-user.use-case';
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/commands/update-user.use-case';
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/commands/delete-user.use-case';

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
      provide: IUserWriteRepository,
      useClass: PrismaUserCommandRepository,
    },
    {
      provide: IUserReadRepository,
      useClass: PrismaUserQueryRepository,
    },
  ],
})
export class UserModule {}
