import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { TaskMapper } from './mapper/task.mapper';

@Injectable()
export class PrismaTaskCommandRepository
  implements AbstractTaskWriteRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    const taskRecord = await this.prisma.task.create({
      data: TaskMapper.toPersistence(task),
    });
    return TaskMapper.toDomain(taskRecord);
  }

  async update(task: Task): Promise<Task> {
    const updatedTaskRecord = await this.prisma.task.update({
      where: { id: task.getId() },
      data: {
        id: task.getId(),
        userId: task.getUserId(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus(),
        priority: task.getPriority(),
        dueDate: task.getDueDate(),
        completedAt: task.getCompletedAt(),
        createdAt: task.getCreatedAt(),
        updatedAt: new Date(),
      },
    });
    return TaskMapper.toDomain(updatedTaskRecord);
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({ where: { id: taskId } });
  }
}
