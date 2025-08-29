import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDTO } from '../dto/input/create-user.dto';
import { ResponseAdminDTO } from '../dto/output/response-admin.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<ResponseAdminDTO> {
    const email = new Email(dto.email);

    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Email already registered');
    }
    // DTO --> Entity
    const user = await UserMapper.toEntity(dto);
    await this.userRepository.create(user);

    return new ResponseAdminDTO(user);
  }
}
