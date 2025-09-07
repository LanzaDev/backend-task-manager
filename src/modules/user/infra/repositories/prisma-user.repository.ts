import { Injectable } from '@nestjs/common';
import { User } from '@/modules/user/domain/entities/user.entity';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/domain/value-objects/role.vo';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmailValue(),
        password: user.getHashedPassword(),
        role: user.getRole(),
        isVerified: user.getIsVerified(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    });

    return new User(
      {
        name: created.name,
        email: new Email(created.email),
        password: Password.fromHashed(created.password),
        isVerified: created.isVerified,
        role: created.role as Role,
        createdAt: created.createdAt,
      },
      created.id,
    );
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        name: user.getName(),
        email: user.getEmailValue(),
        password: user.getHashedPassword(),
        isVerified: user.getIsVerified(),
        role: user.getRole(),
        updatedAt: user.getUpdatedAt(),
      },
    });

    return new User(
      {
        name: updated.name,
        email: new Email(updated.email),
        password: Password.fromHashed(updated.password),
        role: updated.role as Role,
        isVerified: updated.isVerified,
        createdAt: updated.createdAt,
      },
      updated.id,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateIsVerified(id: string): Promise<void> {
    await this.prisma.user.update({
    where: { id },
    data: { isVerified: true, updatedAt: new Date() },
  });
  }

  async findById(id: string): Promise<User | null> {
    const deleted = await this.prisma.user.findUnique({ where: { id } });
    if (!deleted) return null;

    return new User(
      {
        name: deleted.name,
        email: new Email(deleted.email),
        password: Password.fromHashed(deleted.password),
        role: deleted.role as Role,
        isVerified: deleted.isVerified,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt,
      },
      deleted.id,
    );
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    if (!user) return null;

    return new User(
      {
        name: user.name,
        email: new Email(user.email),
        password: Password.fromHashed(user.password),
        role: user.role as Role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }

  async findAll(): Promise<User[]> {
    const Users = await this.prisma.user.findMany();
    return Users.map(
      (user) =>
        new User(
          {
            name: user.name,
            email: new Email(user.email),
            password: Password.fromHashed(user.password),
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          user.id,
        ),
    );
  }
}
