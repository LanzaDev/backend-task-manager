import { Module } from '@nestjs/common';

import { IUserReadRepository } from './domain/repositories/user.read-repository';
import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { PrismaUserQueryRepository } from './infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from './infra/repositories/database/prisma-user.command.repository';

import { CreateUserHandler } from '@/modules/user/application/use-cases/commands/handlers/create-user.handler';
import { UpdateUserHandler } from '@/modules/user/application/use-cases/commands/handlers/update-user.handler';
import { DeleteUserHandler } from '@/modules/user/application/use-cases/commands/handlers/delete-user.handler';

import { UserController } from '@/modules/user/presentation/controllers/user.controller';
import { AdminController } from '@/modules/user/presentation/controllers/admin.controller';

import { CqrsModule } from '@nestjs/cqrs';
import { GetUserByIdHandler } from './application/use-cases/query/handlers/get-user-by-id.handler';
import { CheckEmailHandler } from './application/use-cases/query/handlers/check-email.handler';

@Module({
  imports: [CqrsModule],
  controllers: [UserController, AdminController],
  providers: [
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    GetUserByIdHandler,
    CheckEmailHandler,
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
