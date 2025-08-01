import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
