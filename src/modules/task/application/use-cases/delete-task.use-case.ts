import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractTaskReadRepository } from '../../domain/repositories/task.read-repository';

import { DeleteTaskDTO } from '@/modules/task/presentation/dto/input/delete-task.dto';
import { Role } from '@prisma/client';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    private readonly taskWriteRepository: AbstractTaskWriteRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
  ) {}

  async execute(
    dto: DeleteTaskDTO,
    user: { id: string; role: Role },
  ): Promise<void> {
    const task = await this.taskReadRepository.findById(dto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== Role.ADMIN && task.getUserId() !== user.id) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.taskWriteRepository.delete(task.getId());
  }
}
