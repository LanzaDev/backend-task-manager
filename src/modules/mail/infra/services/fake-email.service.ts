import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../domain/services/email.service';
import { SendEmailVO } from '@/shared/domain/value-objects/send-email';

@Injectable()
export class FakeEmailService implements IEmailService {
  private tokens: Record<string, string> = {};

  async sendEmail(email: SendEmailVO): Promise<void> {
    const { to, subject, html } = email;

    const recipients = Array.isArray(to) ? to : [to];

    const tokenMatch = html.match(/token=([a-zA-Z0-9-]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      recipients.forEach((recipient) => {
        this.tokens[recipient] = token;
      });
    }

    recipients.forEach((recipient) => {
      console.log(`[FAKE EMAIL] Para: ${recipient}, Assunto: ${subject}`);
    });
  }

  getToken(email: string): string | undefined {
    return this.tokens[email];
  }
}
