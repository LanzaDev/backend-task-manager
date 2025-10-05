import { Injectable } from '@nestjs/common';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Verification } from '@/shared/domain/value-objects/verify.vo';

@Injectable()
export class PrismaPasswordResetTokenRepository
  implements AbstractVerificationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: string;
    code: string;
    expiresAt: Date;
    isUsed: boolean;
  }): Promise<void> {
    await this.prisma.verification.create({
      data: {
        userId: data.userId,
        token: data.token,
        code: data.code,
        expiresAt: data.expiresAt,
        isUsed: data.isUsed,
      },
    });
  }

  async findByToken(token: string): Promise<Verification | null> {
    return this.prisma.verification.findUnique({
      where: { token },
    });
  }

  async findByCode(code: string): Promise<Verification | null> {
    return this.prisma.verification.findUnique({
      where: { code },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.verification.update({
      where: { id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.verification.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        isUsed: false,
      },
    });
  }
}
