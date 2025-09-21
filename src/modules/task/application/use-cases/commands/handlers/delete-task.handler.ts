import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractTaskReadRepository } from '../../../../domain/repositories/task.read-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { DeleteTaskCommand } from '../implements/delete-task.command';
import { Role } from '@/shared/types/role.type';

@Injectable()
@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly taskWriteRepository: AbstractTaskWriteRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const requester = await this.userReadRepository.findById(
      command.requesterId,
    );
    if (!requester) {
      throw new NotFoundException('User not found');
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

      throw new ForbiddenException('You cannot delete this task');
    }

    await this.taskWriteRepository.delete(command.taskId);
  }
}
