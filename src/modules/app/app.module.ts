import { Module } from '@nestjs/common';
import { SharedModule } from '@/shared/shared.module';
import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';
import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/providers/prisma-health.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';
import { EmailModule } from '../mail/email.module';
import { CacheRepository } from './domain/providers/cache.provider';
import { RedisHealthRepository } from './infra/providers/redis-health.provider';

@Module({
  imports: [SharedModule, UserModule, TaskModule, AuthModule, EmailModule],
  controllers: [CheckApiHealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: DatabaseRepository,
      useClass: PrismaHealthRepository,
    },
    {
      provide: CacheRepository,
      useClass: RedisHealthRepository,
    },
  ],
})
export class AppModule {}
