import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserDTO } from '../dto/input/delete-user.dto';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: DeleteUserDTO, req: { id: string; role: Role }): Promise<void> {
    const user = await this.userRepository.findById(dto.id);

    if (!user) throw new NotFoundException('User not found');

    if (req.role === 'USER' && req.id !== dto.id) {
      throw new BadRequestException('Cannot delete other user');
    }

    if (req.role === 'ADMIN' && !user.canBeDeleted()) {
      throw new BadRequestException('Cannot delete admin');
    }

    await this.userRepository.delete(dto.id);
  }
}
