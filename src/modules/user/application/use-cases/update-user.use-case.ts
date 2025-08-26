import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserDTO } from "../dto/input/update-user.dto";
import { Email } from "@/shared/domain/value-objects/email.vo";
import { Password } from "@/shared/domain/value-objects/password.vo";

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    dto: UpdateUserDTO,
    requester: { id: string; role: string },
    targetUserId: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(targetUserId);
    if (!user) throw new NotFoundException('User not found');

    // Se é user comum, só pode atualizar a si mesmo
    if (requester.role === 'USER' && requester.id !== targetUserId) {
      throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
    }

    // Se é user, não pode atualizar role
    if (requester.role === 'USER') {
      delete dto.role;
    }

    // Aplica os updates na entidade
    if (dto.name) user.setName(dto.name);
    if (dto.email) user.setEmail(new Email(dto.email));
    if (dto.password) {
      const newPassword = await Password.create(dto.password);
      user.setPassword(newPassword);
    }
    if (dto.role) user.setRole(dto.role);

    await this.userRepository.save(user); // upsert do prisma
  }
}
