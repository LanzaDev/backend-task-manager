import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { DeleteTaskDTO } from '../dto/input/delete-task.dto';
import { Role } from '@prisma/client';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: DeleteTaskDTO, user: { id: string; role: Role }): Promise<void> {
    const task = await this.taskRepository.findById(dto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    // Verifica permissão: usuário normal só pode deletar suas tasks
    if (user.role !== Role.ADMIN && task.getUserId() !== user.id) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.taskRepository.delete(task.getId());
  }
}
