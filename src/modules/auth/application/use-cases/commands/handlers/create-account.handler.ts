import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { User } from '@/modules/user/domain/entities/user.entity';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { AbstractVerificationTokenRepository } from '../../../../domain/repositories/password.repository';

import { IEmailService } from '@/modules/mail/domain/services/email.service';
import { CreateAccountCommand } from '../implements/create-account.command';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Token } from '@/shared/domain/value-objects/token.vo';

@Injectable()
@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @Inject('IEmailService') private readonly emailService: IEmailService,
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationTokenRepository: AbstractVerificationTokenRepository,
  ) {}

  async execute(command: CreateAccountCommand): Promise<string> {
    const { dto } = command;
    const email = new Email(dto.email);

    const existingUser = await this.userReadRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const password = await Password.create(dto.password);
    const user = new User({
      name: dto.name,
      email,
      password,
      isVerified: false,
    });
    await this.userWriteRepository.create(user);

    const verificationToken = new Token(randomUUID());

    await this.verificationTokenRepository.create({
      userId: user.getId(),
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      isUsed: false,
    });

    const redirect_url = `http://localhost:5173/verify-email?token=${verificationToken.getValue()}`;

    await this.emailService.sendEmail({
      to: [user.getEmailValue()],
      subject: 'Verifique seu e-mail',
      html: `<div style="font-family: Arial, sans-serif; color: #333333; font-size: 16px; line-height: 1.5;">
      <p>Olá ${user.getName()},</p>
      <p>Você se cadastrou no TaskManager, verifique seu e-mail. Clique no botão abaixo:</p>

      <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px 0;">
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

      <p style="color: #333333; text-decoration: none; margin-top: 20px;">
        Se você não se cadastrou na nossa plataforma, pode ignorar este e-mail.
      </p>
    </div>
  `,
    });

    return 'Registration successful';
  }
}
