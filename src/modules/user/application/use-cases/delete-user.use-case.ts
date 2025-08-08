import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserDTO } from '../dtos/delete-user.dto';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: DeleteUserDTO): Promise<void> {
    const user = await this.userRepository.findById(data.id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.delete(data.id);
  }
}
