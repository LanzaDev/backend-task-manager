import { Task } from '@/modules/task/domain/entities/task.entity';

export abstract class AbstractTaskWriteRepository {
  abstract create(task: Task): Promise<Task>;
  abstract update(task: Task): Promise<Task>;
  abstract delete(taskId: string): Promise<void>;
}
