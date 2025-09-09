import { ConflictException, Injectable } from '@nestjs/common';
import { IUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { IUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { UserMapper } from '@/modules/user/application/mappers/user.mapper';

import { CreateUserDTO } from '@/modules/user/application/dto/input/create-user.dto';
import { ResponseAdminDTO } from '@/modules/user/application/dto/output/response-admin.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userWriteRepository: IUserWriteRepository,
    private readonly userReadRepository: IUserReadRepository,
  ) {}

  async execute(dto: CreateUserDTO): Promise<ResponseAdminDTO> {
    const email = new Email(dto.email);

    const userExists = await this.userReadRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Email already registered');
    }
    // DTO --> Entity
    const user = await UserMapper.toEntity(dto);
    await this.userWriteRepository.create(user);

    return new ResponseAdminDTO(user);
  }
}
