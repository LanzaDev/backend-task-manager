import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserDTO } from '../dto/input/delete-user.dto';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: DeleteUserDTO): Promise<void> {
    const user = await this.userRepository.findById(data.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(data.id);
  }
}
