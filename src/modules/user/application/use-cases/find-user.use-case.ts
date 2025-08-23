import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { UserMapper } from '../mappers/user.mapper';

interface IFindUserByEmailInput {
  email: string;
}

export interface IFindUserByEmailOutput {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    input: IFindUserByEmailInput,
  ): Promise<IFindUserByEmailOutput | null> {
    const emailVO = new Email(input.email);
    const user = await this.userRepository.findByEmail(emailVO);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toDTO(user);
  }
}
