import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserMapper } from '../mappers/user.mapper';
import { ResponseUserDTO } from '../dtos/response-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<ResponseUserDTO> {
    try {
      // Verifica se já existe
      const userExists = await this.userRepository.findByEmail(data.email);
      if (userExists) {
        throw new ConflictException('Email já cadastrado');
      }
      // DTO --> Entity
      const user = await UserMapper.toEntity(data);
      await this.userRepository.create(user); // Salva no DB
      return UserMapper.toDTO(user); // retorna DTO de resposta

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email já está em uso');
      }
      throw error; // Lança outros erros normalmente
    }
  }
}
