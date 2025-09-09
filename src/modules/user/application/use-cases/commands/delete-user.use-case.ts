import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { IUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { DeleteUserDTO } from '@/modules/user/application/dto/input/delete-user.dto';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userWriteRepository: IUserWriteRepository,
    private readonly userReadRepository: IUserReadRepository,
  ) {}

  async execute(
    dto: DeleteUserDTO,
    req: { id: string; role: Role },
  ): Promise<void> {
    const user = await this.userReadRepository.findById(dto.id);

    if (!user) throw new NotFoundException('User not found');

    if (req.role === 'USER') {
      if (req.id !== dto.id) {
        throw new BadRequestException('Cannot delete other user');
      }

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

    await this.userWriteRepository.delete(dto.id);
  }
}
