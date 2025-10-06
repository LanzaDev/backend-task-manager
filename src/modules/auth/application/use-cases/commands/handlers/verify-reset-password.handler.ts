import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { VerifyResetPasswordCommand } from '../implements/verify-reset-password.command';

@Injectable()
@CommandHandler(VerifyResetPasswordCommand)
export class VerifyResetPasswordHandler
  implements ICommandHandler<VerifyResetPasswordCommand>
{
  constructor(
    private readonly verificationRepository: AbstractVerificationRepository,
  ) {}

  async execute(
    command: VerifyResetPasswordCommand,
  ): Promise<{ valid: boolean }> {
    const { token, code } = command;

    if (!token && !code)
      throw new HttpException(
        'Token or code is required',
        HttpStatus.BAD_REQUEST,
      );

    const record = token
      ? await this.verificationRepository.findByToken(token)
      : await this.verificationRepository.findByCode(code!);

    if (!record || record.isUsed || record.expiresAt.getTime() <= Date.now()) {
      return { valid: false };
    }

    return { valid: true };
  }
}
