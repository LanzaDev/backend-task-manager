import { Module } from '@nestjs/common';
import { ITaskRepository } from './domain/repositories/task.repository';
import { PrismaTaskRepository } from './infra/repositories/prisma-task.repository';
import { AdminTaskController } from './presentation/controllers/admin-task.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { UserTaskController } from './presentation/controllers/user-task.controller';

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
