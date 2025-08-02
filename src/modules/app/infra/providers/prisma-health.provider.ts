import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaHealthRepository implements DatabaseRepository {
  constructor(private readonly prisma: PrismaService) {}
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.log('db connection error: ', error);
      return false;
    }
  }
}
