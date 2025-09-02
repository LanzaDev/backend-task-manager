import { Module } from '@nestjs/common';

import { ITaskRepository } from '@/modules/task/domain/repositories/task.repository';
import { PrismaTaskRepository } from '@/modules/task/infra/repositories/prisma-task.repository';

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
      provide: ITaskRepository,
      useClass: PrismaTaskRepository,
    },
  ],
})
export class TaskModule {}
