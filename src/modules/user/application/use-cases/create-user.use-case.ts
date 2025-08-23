import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDTO } from '../dto/input/create-user.dto';
import { ResponseUserDTO } from '../dto/output/response-user.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<ResponseUserDTO> {
    const email = new Email(data.email);

    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Email already registered');
    }
    // DTO --> Entity
    const user = await UserMapper.toEntity(data);
    await this.userRepository.save(user);

    return UserMapper.toDTO(user);
  }
}
