import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [PrismaModule],
})
export class SharedModule {}
