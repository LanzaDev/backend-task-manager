import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { EmailVerificationStatus } from '@/shared/types/email-status.type';
import { VerifyEmailTokenCommand } from '../implements/verify-email-token.command';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

@Injectable()
@CommandHandler(VerifyEmailTokenCommand)
export class VerifyEmailTokenHandler
  implements ICommandHandler<VerifyEmailTokenCommand>
{
  constructor(
    private readonly verificationTokenRepository: AbstractVerificationTokenRepository,
    private readonly userWriteRepository: AbstractUserWriteRepository,
  ) {}

  async execute(
    command: VerifyEmailTokenCommand,
  ): Promise<EmailVerificationStatus> {
    if (!command.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const record = await this.verificationTokenRepository.findByToken(
      command.token,
    );

    if (!record) return EmailVerificationStatus.INVALID;
    if (record.isUsed) return EmailVerificationStatus.ALREADY_VERIFIED;
    if (record.expiresAt < new Date()) return EmailVerificationStatus.EXPIRED;

    await this.userWriteRepository.updateIsVerified(record.userId);
    await this.verificationTokenRepository.markAsUsed(record.id);

    return EmailVerificationStatus.ALREADY_VERIFIED;
  }
}
