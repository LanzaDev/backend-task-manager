import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getId() },
      update: {
        name: user.getName(),
        email: user.getEmailValue(),
        password: user.getHashedPassword(),
        role: user.getRole(),
        updatedAt: user.getUpdatedAt(),
      },
      create: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmailValue(),
        password: user.getHashedPassword(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;

    return new User(
      {
        name: data.name,
        email: new Email(data.email),
        password: Password.fromHashed(data.password),
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id,
    );
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    if (!data) return null;

    return new User(
      {
        name: data.name,
        email: new Email(data.email),
        password: Password.fromHashed(data.password),
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id,
    );
  }
}
