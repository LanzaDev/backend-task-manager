import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { VerifyRecoveryCommand } from '../implements/verify-recovery.command';
import { VerificationType } from '@prisma/client';

@Injectable()
@CommandHandler(VerifyRecoveryCommand)
export class VerifyRecoveryHandler
  implements ICommandHandler<VerifyRecoveryCommand>
{
  constructor(
    private readonly verificationRepository: AbstractVerificationRepository,
  ) {}

  async execute(
    command: VerifyRecoveryCommand,
  ): Promise<{ id: string; userId: string; type: VerificationType }> {
    const { token, code } = command;

    if (!token && !code) {
      throw new HttpException(
        'Token or code is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const record = token
      ? await this.verificationRepository.findByToken(token)
      : await this.verificationRepository.findByCode(code!);

    if (!record) {
      throw new HttpException(
        'Invalid or expired verification record',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (record.isUsed) {
      const message =
        record.type === VerificationType.RESET_PASSWORD
          ? 'Reset link or code already used'
          : 'Email already verified';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new HttpException('Verification expired', HttpStatus.GONE);
    }

    return {
      id: record.id,
      userId: record.userId,
      type: record.type,
    };
  }
}
