import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Role } from '@/shared/types/role.type';

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

  async searchByUser(userId: string, searchText: string) {
    const terms = searchText.trim().split(/\s+/);

    const ilikeConditions = terms
      .map((_, i) => `"title" ILIKE '%' || $${i + 3} || '%'`)
      .join(' OR ');

    return this.prisma.$queryRawUnsafe<any[]>(
      `
    SELECT *
    FROM "Task"
    WHERE "userId" = $1
      AND (
        SIMILARITY("title"::text, $2::text) > 0.1
        OR (${ilikeConditions})
      )
    ORDER BY SIMILARITY("title"::text, $2::text) DESC
    LIMIT 10
    `,
      userId,
      searchText,
      ...terms,
    );
  }

  async searchGlobal(searchText: string) {
    const terms = searchText.trim().split(/\s+/);
    const ilikeConditions = terms
      .map((_, i) => `"title" ILIKE '%' || $${i + 2} || '%'`)
      .join(' OR ');

    return this.prisma.$queryRawUnsafe<any[]>(
      `
    SELECT *
    FROM "Task"
    WHERE (
      SIMILARITY("title"::text, $1::text) > 0.1
      OR (${ilikeConditions})
    )
    ORDER BY SIMILARITY("title"::text, $1::text) DESC
    LIMIT 20
    `,
      searchText,
      ...terms,
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
