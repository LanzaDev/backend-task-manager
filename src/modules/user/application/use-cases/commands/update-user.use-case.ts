import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { IUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { UpdateUserDTO } from '@/modules/user/application/dto/input/update-user.dto';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userWriteRepository: IUserWriteRepository,
    private readonly userReadRepository: IUserReadRepository,
  ) {}

  async execute(
    dto: UpdateUserDTO,
    req: { id: string; role: string },
    targetUserId: string,
  ): Promise<void> {
    const user = await this.userReadRepository.findById(targetUserId);
    if (!user) throw new NotFoundException('User not found');

    if (req.role === 'USER' && req.id !== targetUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (req.role === 'USER') {
      delete dto.role;
    }

    if (dto.name) user.setName(dto.name);
    if (dto.email) user.setEmail(new Email(dto.email));
    if (dto.password) {
      const newPassword = await Password.create(dto.password);
      user.setPassword(newPassword);
    }
    if (dto.role) user.setRole(dto.role);

    await this.userWriteRepository.update(user);
  }
}
