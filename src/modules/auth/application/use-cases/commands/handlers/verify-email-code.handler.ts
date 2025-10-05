import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EmailVerificationStatus } from '@/shared/types/email-status.type';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { VerifyEmailCodeCommand } from '../implements/verify-email-code.command';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';

@Injectable()
@CommandHandler(VerifyEmailCodeCommand)
export class VerifyEmailCodeHandler
  implements ICommandHandler<VerifyEmailCodeCommand>
{
  constructor(
    private readonly verificationRepository: AbstractVerificationRepository,
    private readonly userWriteRepository: AbstractUserWriteRepository,
  ) {}

  async execute(
    command: VerifyEmailCodeCommand,
  ): Promise<EmailVerificationStatus> {
    if (!command.code) {
      throw new HttpException('Code is required', HttpStatus.BAD_REQUEST);
    }

    const record = await this.verificationRepository.findByCode(command.code);

    if (!record) return EmailVerificationStatus.INVALID;
    if (record.isUsed) return EmailVerificationStatus.ALREADY_VERIFIED;
    if (record.expiresAt < new Date()) return EmailVerificationStatus.EXPIRED;

    await this.userWriteRepository.updateIsVerified(record.userId);
    await this.verificationRepository.markAsUsed(record.id);

    return EmailVerificationStatus.ALREADY_VERIFIED;
  }
}
