import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { DeleteUserDTO } from '@/modules/user/application/dto/input/delete-user.dto';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    dto: DeleteUserDTO,
    req: { id: string; role: Role },
  ): Promise<void> {
    const user = await this.userRepository.findById(dto.id);

    if (!user) throw new NotFoundException('User not found');

    if (req.role === 'USER' && req.id !== dto.id) {
      throw new BadRequestException('Cannot delete other user');
    }

    if (req.role === 'USER' && req.id === dto.id) {
      if (!dto.password) {
        throw new Error('Password is required to delete your own account');
      }

      const isPasswordValid = await user.validatePassword(dto.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    }

    if (req.role === 'ADMIN' && !user.canBeDeleted()) {
      throw new BadRequestException('Cannot delete admin');
    }

    await this.userRepository.delete(dto.id);
  }
}
