import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { CacheModule } from './infra/cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [],
  exports: [DatabaseModule, CacheModule],
})
export class SharedModule {}
