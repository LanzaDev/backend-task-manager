import { Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { UpdateTaskDTO } from '../dto/input/update-task.dto';
import { Task } from '../../domain/entities/task.entity';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskId: string, dto: UpdateTaskDTO, user: { id: string; role: Role }): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    if (dto.title) task.setTitle(dto.title);
    if (dto.description) task.setDescription(dto.description);
    if (dto.status) task.setStatus(dto.status);
    if (dto.priority) task.setPriority(dto.priority);
    if (dto.dueDate) task.setDueDate(dto.dueDate);
    if (dto.completedAt) task.setCompletedAt(dto.completedAt);

    return this.taskRepository.update(task);
  }
}
