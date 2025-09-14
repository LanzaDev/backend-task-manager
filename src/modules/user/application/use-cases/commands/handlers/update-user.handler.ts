import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../implements/update-user.command';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { UpdateUserDTO } from '../../../../presentation/dto/input/update-user.dto';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userReadRepository.findById(command.targetUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      command.requesterRole === 'USER' &&
      command.requesterId !== command.targetUserId
    ) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updateData: Partial<UpdateUserDTO> = { ...command.updateData };

    if (command.requesterRole === 'USER') {
      delete updateData.role;
    }

    if (updateData.name) user.setName(updateData.name);
    if (updateData.email) user.setEmail(new Email(updateData.email));
    if (updateData.password) {
      const newPassword = await Password.create(updateData.password);
      user.setPassword(newPassword);
    }
    if (updateData.role) user.setRole(updateData.role);

    await this.userWriteRepository.update(user);
  }
}
