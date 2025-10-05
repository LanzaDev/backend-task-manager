import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';

import { RequestPasswordResetCommand } from '../implements/request-password-reset.command';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Token } from '@/shared/domain/value-objects/token.vo';
import type { IEmailService } from '@/modules/mail/domain/services/email.service';
import { GenerateVerificationCode } from '@/shared/utils/generate-verification-code';

@Injectable()
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetHandler
  implements ICommandHandler<RequestPasswordResetCommand>
{
  constructor(
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationRepository: AbstractVerificationRepository,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    const email = new Email(command.email);
    const existingUser = await this.userReadRepository.findByEmail(email);
    if (!existingUser) {
      return;
    }

    const rawToken = randomUUID();
    const token = new Token(rawToken);
    const expiresAt = addHours(new Date(), 1);
    const verificationCode = GenerateVerificationCode(6);

    await this.verificationRepository.create({
      userId: existingUser.getId(),
      token: token.toString(),
      code: verificationCode,
      expiresAt,
      isUsed: false,
    });

    const resetLink = `http://localhost:5173/recover?token=${token.getValue()}&code=${verificationCode}`;

    await this.emailService.sendEmail({
      to: [existingUser.getEmailValue()],
      subject: 'Recuperação de senha',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333333; font-size: 16px; line-height: 1.5;">
        <p>Olá ${existingUser.getName()},</p>
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
