import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaTaskCommandRepository
  implements AbstractTaskWriteRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    const taskRecord = await this.prisma.task.create({
      data: {
        id: task.getId(),
        userId: task.getUserId(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus(),
        priority: task.getPriority(),
        dueDate: task.getDueDate(),
        completedAt: task.getCompletedAt(),
      },
    });
    return new Task(
      {
        userId: taskRecord.userId,
        title: taskRecord.title,
        description: taskRecord.description ?? undefined,
        status: taskRecord.status as TaskStatus,
        priority: taskRecord.priority ?? undefined,
        dueDate: taskRecord.dueDate ?? undefined,
        completedAt: taskRecord.completedAt ?? undefined,
        createdAt: taskRecord.createdAt,
      },
      taskRecord.id,
    );
  }

  async update(task: Task): Promise<Task> {
    const updatedTaskRecord = await this.prisma.task.update({
      where: { id: task.getId() },
      data: {
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus(),
        priority: task.getPriority(),
        dueDate: task.getDueDate(),
        completedAt: task.getCompletedAt(),
      },
    });

    return new Task(
      {
        userId: updatedTaskRecord.userId,
        title: updatedTaskRecord.title,
        description: updatedTaskRecord.description ?? undefined,
        status: updatedTaskRecord.status as TaskStatus,
        priority: updatedTaskRecord.priority ?? undefined,
        dueDate: updatedTaskRecord.dueDate ?? undefined,
        completedAt: updatedTaskRecord.completedAt ?? undefined,
        createdAt: updatedTaskRecord.createdAt,
      },
      updatedTaskRecord.id,
    );
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({ where: { id: taskId } });
  }
}
