import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaTaskQueryRepository implements AbstractTaskReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(taskId: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return null;

    return new Task(
      {
        userId: task.userId,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status as TaskStatus,
        priority: task.priority ?? undefined,
        dueDate: task.dueDate ?? undefined,
        completedAt: task.completedAt ?? undefined,
        createdAt: task.createdAt,
      },
      task.id,
    );
  }

  async findAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks.map(
      (task) =>
        new Task(
          {
            userId: task.userId,
            title: task.title,
            description: task.description ?? undefined,
            status: task.status as TaskStatus,
            priority: task.priority ?? undefined,
            dueDate: task.dueDate ?? undefined,
            completedAt: task.completedAt ?? undefined,
            createdAt: task.createdAt,
          },
          task.id,
        ),
    );
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return tasks.map(
      (task) =>
        new Task(
          {
            userId: task.userId,
            title: task.title,
            description: task.description ?? undefined,
            status: task.status as TaskStatus,
            priority: task.priority ?? undefined,
            dueDate: task.dueDate ?? undefined,
            completedAt: task.completedAt ?? undefined,
            createdAt: task.createdAt,
          },
          task.id,
        ),
    );
  }

  async findByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId, status },
    });
    return tasks.map(
      (task) =>
        new Task(
          {
            userId: task.userId,
            title: task.title,
            description: task.description ?? undefined,
            status: task.status as TaskStatus,
            priority: task.priority ?? undefined,
            dueDate: task.dueDate ?? undefined,
            completedAt: task.completedAt ?? undefined,
            createdAt: task.createdAt,
          },
          task.id,
        ),
    );
  }
}
