import { Module } from '@nestjs/common';
import { CacheModule } from './infra/cache/cache.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [],
  exports: [DatabaseModule, CacheModule],
})
export class SharedModule {}
