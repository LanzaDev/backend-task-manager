import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractTaskReadRepository } from '../../domain/repositories/task.read-repository';

import { UpdateTaskDTO } from '@/modules/task/presentation/dto/input/update-task.dto';
import { Role } from '@/shared/types/role.type';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    private readonly taskWriteRepository: AbstractTaskWriteRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
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
