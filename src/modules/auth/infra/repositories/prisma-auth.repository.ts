import { Injectable } from '@nestjs/common';
import { IPasswordResetTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { PasswordResetToken } from '@prisma/client';
import { Token } from '@/shared/domain/value-objects/token.vo';

@Injectable()
export class PrismaPasswordResetTokenRepository
  implements IPasswordResetTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: Token;
    expiresAt: Date;
    used: boolean;
  }): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        userId: data.userId,
        token: data.token.getValue(),
        expiresAt: data.expiresAt,
        used: data.used,
      },
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        used: false,
      },
    });
  }
}
