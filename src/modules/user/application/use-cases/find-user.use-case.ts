import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
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
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    input: IFindUserByEmailInput,
  ): Promise<IFindUserByEmailOutput | null> {
    const emailVO = new Email(input.email);
    const user = await this.userRepository.findByEmail(emailVO.getValue());

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return UserMapper.toDTO(user);
  }
}
