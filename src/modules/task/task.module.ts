import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AbstractTaskReadRepository } from './domain/repositories/task.read-repository';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { PrismaTaskQueryRepository } from './infra/repositories/database/prisma-task.query.repository';
import { PrismaTaskCommandRepository } from '@/modules/task/infra/repositories/database/prisma-task.command.repository';
import { AbstractUserReadRepository } from '../user/domain/repositories/user.read-repository';
import { PrismaUserQueryRepository } from '../user/infra/repositories/database/prisma-user.query.repository';

import { CreateTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/create-task.handler';
import { DeleteTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/delete-task.handler';
import { UpdateTaskHandler } from '@/modules/task/application/use-cases/commands/handlers/update-task.handler';
import { GetAllTaskByUserIdHandler } from './application/use-cases/query/handlers/get-all-tasks-by-user-id.handler';

import { UserTaskController } from '@/modules/task/presentation/controllers/user-task.controller';
import { AdminTaskController } from '@/modules/task/presentation/controllers/admin-task.controller';
import { GetAllTasksHandler } from './application/use-cases/query/handlers/get-all-tasks.handler';
import { GetTaskByIdHandler } from './application/use-cases/query/handlers/get-task-by-id.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AdminTaskController, UserTaskController],
  providers: [
    CreateTaskHandler,
    UpdateTaskHandler,
    DeleteTaskHandler,
    GetAllTaskByUserIdHandler,
    GetAllTasksHandler,
    GetTaskByIdHandler,
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
  ],
})
export class TaskModule {}
