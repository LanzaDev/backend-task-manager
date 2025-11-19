import { Task, TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { Task as TaskPrisma } from '@prisma/client';

export class TaskMapper {
  static toDomain(raw: TaskPrisma): Task {
    return new Task({
      id: raw.id,
      userId: raw.userId,
      title: raw.title,
      description: raw.description ?? null,
      status: raw.status as TaskStatus,
      priority: raw.priority ?? null,
      dueDate: raw.dueDate ?? null,
      completedAt: raw.completedAt ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(task: Task): TaskPrisma {
    return {
      id: task.getId(),
      userId: task.getUserId(),
      title: task.getTitle(),
      description: task.getDescription(),
      status: task.getStatus(),
      priority: task.getPriority(),
      dueDate: task.getDueDate(),
      completedAt: task.getCompletedAt(),
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    } as TaskPrisma;
  }
}
