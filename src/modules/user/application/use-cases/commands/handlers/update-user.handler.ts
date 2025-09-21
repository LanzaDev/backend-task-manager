import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { UpdateUserCommand } from '../implements/update-user.command';
import { UpdateUserDTO } from '../../../../presentation/dto/input/update-user.dto';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/types/role.type';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
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

    if (
      command.requesterRole === Role.USER &&
      command.targetUserId !== command.requesterId
    ) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updateData: Partial<UpdateUserDTO> = { ...command.updateData };

    if (command.requesterRole === Role.USER) {
      delete updateData.role;
    }

    if (updateData.newName) targetUser.setName(updateData.newName);
    if (updateData.newEmail)
      targetUser.setEmail(new Email(updateData.newEmail));
    if (updateData.newPassword) {
      if (command.requesterRole === Role.USER) {
        if (!command.currentPassword) {
          throw new Error('Password is required to update password');
        }

        const isPasswordValid = await requesterUser.comparePassword(
          command.currentPassword,
        );
        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid password');
        }

        if (updateData.newPassword !== updateData.confirmNewPassword) {
          throw new BadRequestException(
            'New password confirmation does not match',
          );
        }
      }
      const newPassword = await Password.create(updateData.newPassword);
      targetUser.setPassword(newPassword);
    }
    if (updateData.role) targetUser.setRole(updateData.role);

    await this.userWriteRepository.update(targetUser);
  }
}
