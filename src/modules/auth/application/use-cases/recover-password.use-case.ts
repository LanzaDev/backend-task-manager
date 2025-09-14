import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { ForgotYourPasswordDTO } from '@/modules/auth/presentation/dto/input/forgot-your-password.dto';

import type { IEmailService } from '@/modules/mail/domain/services/email.service';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Token } from '@/shared/domain/value-objects/token.vo';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject('IEmailService') private readonly emailService: IEmailService,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly tokenRepository: AbstractVerificationTokenRepository,
  ) {}

  async execute(dto: ForgotYourPasswordDTO): Promise<void> {
    const email = new Email(dto.email);
    const user = await this.userReadRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const rawToken = randomUUID();
    const token = new Token(rawToken);
    const expiresAt = addHours(new Date(), 1);

    await this.tokenRepository.create({
      userId: user.getId(),
      token,
      expiresAt,
      isUsed: false,
    });

    const resetLink = `http://localhost:5173/recover?token=${token}`;

    await this.emailService.sendEmail({
      to: [user.getEmailValue()],
      subject: 'Recuperação de senha',
      html: `<div style="font-family: Arial, sans-serif; color: #333333; font-size: 16px; line-height: 1.5;">
      <p>Olá ${user.getName()},</p>
      <p>Você solicitou a recuperação da sua senha. Clique no botão abaixo:</p>

      <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px 0;">
        <tr>
          <td align="center" bgcolor="#3803f6" style="border-radius: 8px;">
            <a href="${resetLink}"
               target="_blank"
               style="font-size: 16px;
                      font-weight: bold;
                      font-family: Arial, sans-serif;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 14px 28px;
                      display: inline-block;">
              Redefinir Senha
            </a>
          </td>
        </tr>
      </table>

      <p style="color: #333333; text-decoration: none; margin-top: 20px;">
        Se você não solicitou a redefinição, pode ignorar este e-mail.
      </p>
    </div>
  `,
    });
  }
}
