import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { DeleteUserCommand } from '../implements/delete-user.command';
import { Role } from '@/shared/types/role.type';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const requesterUser = await this.userReadRepository.findById(
      command.requesterId,
    );
    if (!requesterUser) {
      throw new NotFoundException('Requester not found');
    }

    const targetUser = await this.userReadRepository.findById(
      command.targetUserId,
    );
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (command.requesterRole === Role.USER) {
      if (command.targetUserId !== command.requesterId) {
        throw new BadRequestException('Cannot delete other user');
      }

      if (!command.currentPassword) {
        throw new Error('Password is required to delete your own account');
      }

      const isPasswordValid = await requesterUser.comparePassword(
        command.currentPassword,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    }

    if (!targetUser.isDeletable()) {
      throw new BadRequestException('Cannot delete admin');
    }

    await this.userWriteRepository.delete(command.targetUserId);
  }
}
