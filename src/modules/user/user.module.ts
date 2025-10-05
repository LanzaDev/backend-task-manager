import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from './domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { PrismaUserQueryRepository } from './infra/repositories/database/prisma-user.query.repository';
import { PrismaUserCommandRepository } from './infra/repositories/database/prisma-user.command.repository';

import { CreateUserHandler } from '@/modules/user/application/use-cases/commands/handlers/create-user.handler';
import { UpdateUserHandler } from '@/modules/user/application/use-cases/commands/handlers/update-user.handler';
import { DeleteUserHandler } from '@/modules/user/application/use-cases/commands/handlers/delete-user.handler';

import { GetUserByIdHandler } from './application/use-cases/query/handlers/get-user-by-id.handler';
import { CheckEmailHandler } from './application/use-cases/query/handlers/check-email.handler';
import { GetAllUsersHandler } from './application/use-cases/query/handlers/get-all-users.handler';

import { UserController } from '@/modules/user/presentation/controllers/user.controller';
import { AdminController } from '@/modules/user/presentation/controllers/admin.controller';

const CommandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
];

const QueryHandlers = [
  GetUserByIdHandler,
  GetAllUsersHandler,
  CheckEmailHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [UserController, AdminController],
  providers: [
    {
      provide: AbstractUserWriteRepository,
      useClass: PrismaUserCommandRepository,
    },
    {
      provide: AbstractUserReadRepository,
      useClass: PrismaUserQueryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class UserModule {}
