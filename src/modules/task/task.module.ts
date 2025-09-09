import { Module } from '@nestjs/common';

import { ITaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { ITaskReadRepository } from './domain/repositories/task.read-repository';
import { PrismaTaskQueryRepository } from './infra/repositories/database/prisma-task.query.repository';
import { PrismaTaskCommandRepository } from '@/modules/task/infra/repositories/database/prisma-task.command.repository';

import { CreateTaskUseCase } from '@/modules/task/application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '@/modules/task/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@/modules/task/application/use-cases/delete-task.use-case';

import { UserTaskController } from '@/modules/task/presentation/controllers/user-task.controller';
import { AdminTaskController } from '@/modules/task/presentation/controllers/admin-task.controller';

@Module({
  imports: [],
  controllers: [AdminTaskController, UserTaskController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    {
      provide: ITaskWriteRepository,
      useClass: PrismaTaskCommandRepository,
    },
    {
      provide: ITaskReadRepository,
      useClass: PrismaTaskQueryRepository,
    },
  ],
})
export class TaskModule {}
