import { Module } from '@nestjs/common';
import { SharedModule } from '@/shared/shared.module';
import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';
import { GetHealthUseCase } from '@/modules/app/application/use-cases/get-health.use-case';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/providers/prisma-health.provider';

@Module({
  imports: [SharedModule],
  controllers: [CheckApiHealthController],
  providers: [
    GetHealthUseCase,
    {
      provide: DatabaseRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
