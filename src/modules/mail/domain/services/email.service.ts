import { SendEmailVO } from '@/shared/domain/value-objects/send-email';

export interface IEmailService {
  sendEmail(email: SendEmailVO): Promise<void>;
}
