import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { CreateUserDTO } from '@/modules/user/application/dto/input/create-user.dto';
import { ResponseAdminDTO } from '@/modules/user/application/dto/output/response-admin.dto';
import { UserMapper } from '@/modules/user/application/mappers/user.mapper';
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
