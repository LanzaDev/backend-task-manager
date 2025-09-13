import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/mail/email.module';
import { TaskModule } from '@/modules/task/task.module';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';

import { HealthRepository } from '@/modules/app/domain/repositories/health.repository';

import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';

import { RedisHealthRepository } from '@/modules/app/infra/repositories/redis-health.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/repositories/prisma-health.provider';

import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';

@Module({
  imports: [SharedModule, UserModule, TaskModule, AuthModule, EmailModule],
  controllers: [CheckApiHealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: HealthRepository,
      useClass: RedisHealthRepository,
    },
    {
      provide: HealthRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
