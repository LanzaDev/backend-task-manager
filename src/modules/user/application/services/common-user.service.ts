import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { UpdateUserDTO } from '../dto/input/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  // Atualiza o próprio perfil
  async updateProfile(userId: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (dto.name) user.setName(dto.name);
    if (dto.email) user.setEmail(new Email(dto.email));
    if (dto.password) user.setPassword(await Password.create(dto.password));

    // Usuário comum não pode alterar role
    // role é ignorado aqui

    await this.userRepo.save(user);
    return user;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
