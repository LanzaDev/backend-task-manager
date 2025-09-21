import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Task } from '@/modules/task/domain/entities/task.entity';

import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractTaskReadRepository } from '../../../../domain/repositories/task.read-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { UpdateTaskCommand } from '../implements/update-task.command';
import { UpdateTaskDTO } from '@/modules/task/presentation/dto/input/update-task.dto';
import { Role } from '@/shared/types/role.type';

@Injectable()
@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly taskWriteRepository: AbstractTaskWriteRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Task> {
    const requester = await this.userReadRepository.findById(
      command.requesterId,
    );
    if (!requester) {
      throw new NotFoundException('requester not found');
    }

    const task = await this.taskReadRepository.findById(command.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      command.requesterRole === Role.USER &&
      command.targetUserId !== command.requesterId
    ) {
      const targetUser = command.targetUserId
        ? await this.userReadRepository.findById(command.targetUserId)
        : null;

      if (!targetUser) {
        throw new ForbiddenException('Target user not found');
      }

      throw new ForbiddenException('You cannot update this task');
    }

    const updateData: Partial<UpdateTaskDTO> = { ...command.updateTaskData };

    if (updateData.title) task.setTitle(updateData.title);
    if (updateData.description) task.setDescription(updateData.description);
    if (updateData.status) task.setStatus(updateData.status);
    if (updateData.priority) task.setPriority(updateData.priority);
    if (updateData.dueDate) task.setDueDate(updateData.dueDate);
    if (updateData.completedAt) task.setCompletedAt(updateData.completedAt);

    return this.taskWriteRepository.update(task);
  }
}
