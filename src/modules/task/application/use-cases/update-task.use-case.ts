import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { ITaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { ITaskReadRepository } from '../../domain/repositories/task.read-repository';

import { UpdateTaskDTO } from '@/modules/task/application/dto/input/update-task.dto';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    private readonly taskWriteRepository: ITaskWriteRepository,
    private readonly taskReadRepository: ITaskReadRepository,
  ) {}

  async execute(
    taskId: string,
    dto: UpdateTaskDTO,
    user: { id: string; role: Role },
  ): Promise<Task> {
    const task = await this.taskReadRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== 'ADMIN' && task.getUserId() !== user.id) {
      throw new ForbiddenException('You cannot update this task');
    }

    if (dto.title) task.setTitle(dto.title);
    if (dto.description) task.setDescription(dto.description);
    if (dto.status) task.setStatus(dto.status);
    if (dto.priority) task.setPriority(dto.priority);
    if (dto.dueDate) task.setDueDate(dto.dueDate);
    if (dto.completedAt) task.setCompletedAt(dto.completedAt);

    return this.taskWriteRepository.update(task);
  }
}
