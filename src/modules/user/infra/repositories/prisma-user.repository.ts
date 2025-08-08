import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        password: user.getPassword().getValue(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) return null;

    return new User(
      {
        name: userData.name,
        email: new Email(userData.email),
        password: Password.restore(userData.password),
      },
      userData.id,
    );
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) return null;

    return new User(
      {
        name: userData.name,
        email: new Email(userData.email),
        password: Password.restore(userData.password),
      },
      userData.id,
    );
  }
}
