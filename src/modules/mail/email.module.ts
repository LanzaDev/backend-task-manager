import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodemailerEmailService } from '@/modules/mail/infra/services/nodemailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IEmailService',
      useClass: NodemailerEmailService,
    },
  ],
  exports: ['IEmailService'],
})
export class EmailModule {}
