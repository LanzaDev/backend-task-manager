import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/types/role.type';

@Injectable()
export class PrismaUserQueryRepository implements AbstractUserReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
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
