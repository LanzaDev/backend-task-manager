import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/mail/email.module';
import { TaskModule } from '@/modules/task/task.module';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';

import { CacheHealthRepository } from '@/modules/app/domain/repositories/cache-health.repository';
import { DatabaseHealthRepository } from './domain/repositories/database-health.repository';
import { RedisHealthRepository } from '@/modules/app/infra/repositories/redis-health.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/repositories/prisma-health.provider';

import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';
import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';

@Module({
  imports: [SharedModule, UserModule, TaskModule, AuthModule, EmailModule],
  controllers: [CheckApiHealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: CacheHealthRepository,
      useClass: RedisHealthRepository,
    },
    {
      provide: DatabaseHealthRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
