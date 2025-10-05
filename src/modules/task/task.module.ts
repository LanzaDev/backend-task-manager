import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AbstractTaskReadRepository } from './domain/repositories/task.read-repository';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractUserReadRepository } from '../user/domain/repositories/user.read-repository';

import { PrismaTaskQueryRepository } from './infra/repositories/database/prisma-task.query.repository';
import { PrismaTaskCommandRepository } from '@/modules/task/infra/repositories/database/prisma-task.command.repository';
import { PrismaUserQueryRepository } from '../user/infra/repositories/database/prisma-user.query.repository';

import { CreateTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/create-task.handler';
import { DeleteTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/delete-task.handler';
import { UpdateTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/update-task.handler';

import { GetAllTaskByUserIdHandler } from './application/use-cases/query/handlers/get-all-tasks-by-user-id.handler';
import { GetAllTasksHandler } from './application/use-cases/query/handlers/get-all-tasks.handler';
import { GetTaskByIdHandler } from './application/use-cases/query/handlers/get-task-by-id.handler';
import { SearchTasksHandler } from './application/use-cases/query/handlers/search-tasks.handler';

import { UserTaskController } from '@/modules/task/presentation/controllers/user-task.controller';
import { AdminTaskController } from '@/modules/task/presentation/controllers/admin-task.controller';

const CommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
];

const QueryHandlers = [
  GetAllTaskByUserIdHandler,
  GetAllTasksHandler,
  GetTaskByIdHandler,
  SearchTasksHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [AdminTaskController, UserTaskController],
  providers: [
    {
      provide: AbstractUserReadRepository,
      useClass: PrismaUserQueryRepository,
    },
    {
      provide: AbstractTaskWriteRepository,
      useClass: PrismaTaskCommandRepository,
    },
    {
      provide: AbstractTaskReadRepository,
      useClass: PrismaTaskQueryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class TaskModule {}
