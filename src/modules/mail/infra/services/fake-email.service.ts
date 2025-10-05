import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../domain/services/email.service';
import { SendEmailVO } from '@/shared/domain/value-objects/send-email';

@Injectable()
export class FakeEmailService implements IEmailService {
  private tokens: Record<string, string> = {};
  private codes: Record<string, string> = {};

  async sendEmail(email: SendEmailVO): Promise<void> {
    const { to, subject, html } = email;
    const recipients = Array.isArray(to) ? to : [to];

    const urlMatch = html.match(/https?:\/\/[^\s"]+/);
    if (urlMatch) {
      try {
        const url = new URL(urlMatch[0]);
        const token = url.searchParams.get('token');
        const code = url.searchParams.get('code');

        recipients.forEach((recipient) => {
          if (code) {
            this.codes[recipient] = code;
            console.log(`[FAKE EMAIL] Para: ${recipient} — code: ${code}`);
          }
          if (token) {
            this.tokens[recipient] = token;
            console.log(`[FAKE EMAIL] Para: ${recipient} — token: ${token}`);
          }
        });
      } catch (error) {
        console.warn('[FAKE EMAIL] URL inválida no conteúdo do e-mail', error);
      }
    }

    recipients.forEach((recipient) => {
      console.log(`[FAKE EMAIL] Para: ${recipient}, Assunto: ${subject}`);
      console.log('------------------------------------');
    });

    return Promise.resolve();
  }

  getToken(email: string): string | undefined {
    return this.tokens[email];
  }

  getCode(email: string): string | undefined {
    return this.codes[email];
  }

  clear(email?: string) {
    if (email) {
      delete this.tokens[email];
      delete this.codes[email];
    } else {
      this.tokens = {};
      this.codes = {};
    }
  }
}
