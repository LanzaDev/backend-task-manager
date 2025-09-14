import { Injectable } from '@nestjs/common';
import { VerificationToken } from '@prisma/client';
import { AbstractVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Token } from '@/shared/domain/value-objects/token.vo';

@Injectable()
export class PrismaPasswordResetTokenRepository
  implements AbstractVerificationTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: Token;
    expiresAt: Date;
    isUsed: boolean;
  }): Promise<void> {
    await this.prisma.verificationToken.create({
      data: {
        userId: data.userId,
        token: data.token.getValue(),
        expiresAt: data.expiresAt,
        isUsed: data.isUsed,
      },
    });
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    return this.prisma.verificationToken.findUnique({
      where: { token },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.verificationToken.update({
      where: { id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.verificationToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        isUsed: false,
      },
    });
  }
}
