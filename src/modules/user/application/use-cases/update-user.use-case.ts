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
    req: { id: string; role: string },
    targetUserId: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(targetUserId);
    if (!user) throw new NotFoundException('User not found');

    if (req.role === 'USER' && req.id !== targetUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (req.role === 'USER') {
      delete dto.role;
    }

    if (dto.name) user.setName(dto.name);
    if (dto.email) user.setEmail(new Email(dto.email));
    if (dto.password) {
      const newPassword = await Password.create(dto.password);
      user.setPassword(newPassword);
    }
    if (dto.role) user.setRole(dto.role);

    await this.userRepository.update(user);
  }
}
