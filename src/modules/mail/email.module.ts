import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerEmailService } from '@/modules/mail/infra/services/nodemailer.service';
import { FakeEmailService } from './infra/services/fake-email.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IEmailService',
      useFactory: (configService: ConfigService) => {
        const emailFake = configService.get<string>('EMAIL_FAKE') === 'true';
        if (emailFake) return new FakeEmailService();
        return new NodemailerEmailService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['IEmailService'],
})
export class EmailModule {}
