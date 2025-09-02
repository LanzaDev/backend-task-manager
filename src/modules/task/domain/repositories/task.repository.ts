import { Task } from "@/modules/task/domain/entities/task.entity";
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';

export abstract class ITaskRepository {
  abstract create(task: Task): Promise<Task>;
  abstract update(task: Task): Promise<Task>;
  abstract delete(taskId: string): Promise<void>;
  abstract findById(taskId: string): Promise<Task | null>;
  abstract findAllTasks(): Promise<Task[]>
  abstract findAllByUser(userId: string): Promise<Task[]>;
  abstract findByStatus(userId: string, status: TaskStatus): Promise<Task[]>;
}
