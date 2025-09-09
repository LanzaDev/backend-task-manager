import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { ITaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaTaskQueryRepository implements ITaskReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(taskId: string): Promise<Task | null> {
    const found = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!found) return null;

    return new Task(
      {
        userId: found.userId,
        title: found.title,
        description: found.description ?? undefined,
        status: found.status as TaskStatus,
        priority: found.priority ?? undefined,
        dueDate: found.dueDate ?? undefined,
        completedAt: found.completedAt ?? undefined,
        createdAt: found.createdAt,
      },
      found.id,
    );
  }

  async findAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks.map(
      (t) =>
        new Task(
          {
            userId: t.userId,
            title: t.title,
            description: t.description ?? undefined,
            status: t.status as TaskStatus,
            priority: t.priority ?? undefined,
            dueDate: t.dueDate ?? undefined,
            completedAt: t.completedAt ?? undefined,
            createdAt: t.createdAt,
          },
          t.id,
        ),
    );
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return tasks.map(
      (t) =>
        new Task(
          {
            userId: t.userId,
            title: t.title,
            description: t.description ?? undefined,
            status: t.status as TaskStatus,
            priority: t.priority ?? undefined,
            dueDate: t.dueDate ?? undefined,
            completedAt: t.completedAt ?? undefined,
            createdAt: t.createdAt,
          },
          t.id,
        ),
    );
  }

  async findByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId, status },
    });
    return tasks.map(
      (t) =>
        new Task(
          {
            userId: t.userId,
            title: t.title,
            description: t.description ?? undefined,
            status: t.status as TaskStatus,
            priority: t.priority ?? undefined,
            dueDate: t.dueDate ?? undefined,
            completedAt: t.completedAt ?? undefined,
            createdAt: t.createdAt,
          },
          t.id,
        ),
    );
  }
}
