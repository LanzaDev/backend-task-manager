import { Task } from "@/modules/task/domain/entities/task.entity";
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';

export abstract class AbstractTaskReadRepository {
  abstract findById(taskId: string): Promise<Task | null>;
  abstract findAllTasks(): Promise<Task[]>
  abstract findAllByUser(userId: string): Promise<Task[]>;
  abstract findByStatus(userId: string, status: TaskStatus): Promise<Task[]>;
}
