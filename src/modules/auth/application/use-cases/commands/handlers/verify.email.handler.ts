import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { EmailVerificationStatus } from '@/shared/types/email-status.type';
import { VerifyEmailCommand } from '../implements/verify-email.command';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly verificationRepository: AbstractVerificationRepository,
    private readonly userWriteRepository: AbstractUserWriteRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { token, code } = command;

    if (!token && !code)
      throw new HttpException(
        'Token or code is required',
        HttpStatus.BAD_REQUEST,
      );

    const record = token
      ? await this.verificationRepository.findByToken(token)
      : await this.verificationRepository.findByCode(code!);

    if (!record) return EmailVerificationStatus.INVALID;
    if (record.isUsed) return EmailVerificationStatus.ALREADY_VERIFIED;
    if (record.expiresAt.getTime() < Date.now())
      return EmailVerificationStatus.EXPIRED;

    await this.userWriteRepository.updateIsVerified(record.userId);
    await this.verificationRepository.markAsUsed(record.id);
  }
}
