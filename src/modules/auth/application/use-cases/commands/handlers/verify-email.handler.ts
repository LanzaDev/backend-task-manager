import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';
import { VerifyRecoveryHandler } from './verify-recovery.handler';
import { VerificationType } from '@prisma/client';
import { VerifyEmailCommand } from '../implements/verify-email.command';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly verificationRepository: AbstractVerificationRepository,
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly verifyRecovery: VerifyRecoveryHandler,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const { data } = command;
    const record = await this.verifyRecovery.execute({
      type: VerificationType.VERIFY_EMAIL,
      token: data.token,
      code: data.code,
    });

    if (record.type !== VerificationType.VERIFY_EMAIL) {
      throw new HttpException(
        'Invalid verification type for this handler',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userWriteRepository.updateIsVerified(record.userId);
    await this.verificationRepository.markAsUsed(record.id);
  }
}
