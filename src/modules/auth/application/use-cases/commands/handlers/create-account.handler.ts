import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { User } from '@/modules/user/domain/entities/user.entity';
import { IEmailService } from '@/modules/mail/domain/services/email.service';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractVerificationRepository } from '../../../../domain/repositories/verify.repository';

import { CreateAccountCommand } from '../implements/create-account.command';

import { GenerateVerificationCode } from '@/shared/utils/generate-verification-code';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Token } from '@/shared/domain/value-objects/token.vo';
import { env } from '@/config/env';

@Injectable()
@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    @Inject('IEmailService') private readonly emailService: IEmailService,
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationTokenRepository: AbstractVerificationRepository,
  ) {}

  async execute(command: CreateAccountCommand): Promise<string> {
    const email = new Email(command.email);

    const existingUser = await this.userReadRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    if (command.confirmPassword !== command.password) {
      throw new ConflictException('Passwords do not match');
    }

    const password = await Password.create(command.password);

    const user = new User({
      name: command.name,
      email,
      password,
      isVerified: false,
    });
    await this.userWriteRepository.create(user);

    const verificationToken = new Token(randomUUID());
    const verificationCode = GenerateVerificationCode(6);

    await this.verificationTokenRepository.create({
      userId: user.getId(),
      token: verificationToken.toString(),
      code: verificationCode,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      isUsed: false,
    });

    const redirect_url = `http://localhost:5173/verify-email?token=${verificationToken.getValue()}&code=${verificationCode}`;

    await this.emailService.sendEmail({
      to: [user.getEmailValue()],
      subject: 'Verifique seu e-mail',
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333;">
          <p style="color: #333333; text-decoration: none;">Olá ${user.getName()},</p>
          <p style="color: #333333; text-decoration: none;">
            Você se cadastrou no ${env.APP_NAME}. Verifique seu e-mail.
            Você pode usar o código( ${verificationCode} ) abaixo ou clicar no botão para redefinir:
          </p>

          <!-- Bloco do código -->
          <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px 0;">
            <tr>
              <td align="center">
                <p style="font-size: 24px; font-weight: bold; color: #3803f6; margin-bottom: 20px;">
                  ${verificationCode}
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#3803f6" style="border-radius: 8px;">
                <a href="${redirect_url}"
                  target="_blank"
                  style="font-size: 16px;
                        font-weight: bold;
                        font-family: Arial, sans-serif;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 14px 28px;
                        display: inline-block;">
                  Clique aqui para verificar
                </a>
              </td>
            </tr>
          </table>

          <p style="margin-top: 20px; color: #333333; text-decoration: none; font-size: 16px; line-height: 1.5;">
            Se você não se cadastrou na nossa plataforma, pode ignorar este e-mail.
          </p>
        </div>
      `,
    });

    return 'Registration successful';
  }
}
