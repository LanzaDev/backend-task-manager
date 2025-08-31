import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { IPasswordResetTokenRepository } from '../../domain/repositories/password.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Token } from '@/shared/domain/value-objects/token.vo';
import { ForgotYourPasswordDTO } from '../dto/input/forgot-your-password.dto';
import type { IEmailProvider } from '@/modules/mail/infra/providers/email.provider';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject('IEmailProvider') private readonly emailProvider: IEmailProvider,
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
  ) {}

  async execute(dto: ForgotYourPasswordDTO): Promise<void> {
    const email = new Email(dto.email);
    const user = await this.userRepository.findByEmail(email);
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
      used: false,
    });

    const resetLink = `https://localhost:3000/recover`;

    await this.emailProvider.sendEmail({
      to: [user.getEmailValue()],
      subject: 'Recuperação de senha',
      html: `<p>Olá ${user.getName()},</p>
             <p>Você solicitou a recuperação da sua senha. Clique no link abaixo:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
  }
}
