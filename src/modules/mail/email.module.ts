import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodemailerEmailProvider } from './infra/providers/nodemailer.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IEmailProvider',
      useClass: NodemailerEmailProvider,
    },
  ],
  exports: ['IEmailProvider'],
})
export class EmailModule {}
