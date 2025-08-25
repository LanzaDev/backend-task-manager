import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { User } from '@/modules/user/domain/entities/user.entity';
import { CreateUserDTO } from '../dto/input/create-user.dto';
import { UpdateUserDTO } from '../dto/input/update-user.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/domain/value-objects/role.vo';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user.repository';

@Injectable()
export class AdminUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const existing = await this.userRepo.findByEmail(new Email(dto.email));
    if (existing) throw new BadRequestException('User already exists');

    const user = new User({
      name: dto.name,
      email: new Email(dto.email),
      password: await Password.create(dto.password),
      role: dto.role ?? 'USER',
    });

    await this.userRepo.save(user);
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(id);

    if (dto.name) user.setName(dto.name);
    if (dto.email) user.setEmail(new Email(dto.email));
    if (dto.password) user.setPassword(await Password.create(dto.password));
    if (dto.role) user.setRole(dto.role as Role); // admin pode alterar role

    await this.userRepo.save(user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user.getRole() === 'ADMIN') throw new BadRequestException('Cannot delete admin');
    await this.userRepo.delete(id);
  }
}
