import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { Password } from '@/shared/domain/value-objects/password.vo';
import { ResetPasswordCommand } from '../implements/reset-password.command';
import { VerifyRecoveryHandler } from './verify-recovery.handler';
import { VerificationType } from '@/shared/types/verification-type.type';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationRepository: AbstractVerificationRepository,
    private readonly verifyRecovery: VerifyRecoveryHandler,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { password, data } = command;
    const record = await this.verifyRecovery.execute({
      type: VerificationType.RESET_PASSWORD,
      token: data.token,
      code: data.code,
    });

    const user = await this.userReadRepository.findById(record.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPassword = await Password.create(password);
    user.setPassword(newPassword);

    await this.userWriteRepository.update(user);
    await this.verificationRepository.markAsUsed(record.id);
  }
}
