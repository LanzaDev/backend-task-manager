import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { DeleteUserCommand } from '../implements/delete-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const targetUser = await this.userReadRepository.findById(
      command.targetUserId,
    );
    if (!targetUser) throw new NotFoundException('User not found');

    const requesterUser = await this.userReadRepository.findById(
      command.requesterId,
    );
    if (!requesterUser) throw new NotFoundException('User not found');

    if (command.requesterRole === 'USER') {
      if (command.requesterId !== command.targetUserId) {
        throw new BadRequestException('Cannot delete other user');
      }

      if (!command.password) {
        throw new Error('Password is required to delete your own account');
      }

      const isPasswordValid = await requesterUser.comparePassword(
        command.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    }

    if (command.requesterRole === 'ADMIN' && !targetUser.canBeDeleted()) {
      throw new BadRequestException('Cannot delete admin');
    }

    await this.userWriteRepository.delete(command.targetUserId);
  }
}
