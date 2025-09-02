import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/mail/email.module';
import { TaskModule } from '@/modules/task/task.module';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';

import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';

import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';

import { RedisHealthRepository } from '@/modules/app/infra/providers/redis-health.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/providers/prisma-health.provider';

import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';

@Module({
  imports: [SharedModule, UserModule, TaskModule, AuthModule, EmailModule],
  controllers: [CheckApiHealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: CacheRepository,
      useClass: RedisHealthRepository,
    },
    {
      provide: DatabaseRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
