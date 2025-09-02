import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { ITaskRepository } from '@/modules/task/domain/repositories/task.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    const created = await this.prisma.task.create({
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
        userId: created.userId,
        title: created.title,
        description: created.description ?? undefined,
        status: created.status as TaskStatus,
        priority: created.priority ?? undefined,
        dueDate: created.dueDate ?? undefined,
        completedAt: created.completedAt ?? undefined,
        createdAt: created.createdAt,
      },
      created.id,
    );
  }

  async update(task: Task): Promise<Task> {
    const updated = await this.prisma.task.update({
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
        userId: updated.userId,
        title: updated.title,
        description: updated.description ?? undefined,
        status: updated.status as TaskStatus,
        priority: updated.priority ?? undefined,
        dueDate: updated.dueDate ?? undefined,
        completedAt: updated.completedAt ?? undefined,
        createdAt: updated.createdAt,
      },
      updated.id,
    );
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({ where: { id: taskId } });
  }

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
