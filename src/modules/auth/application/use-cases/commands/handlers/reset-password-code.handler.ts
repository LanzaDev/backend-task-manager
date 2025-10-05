import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { Password } from '@/shared/domain/value-objects/password.vo';
import { ResetPasswordCodeCommand } from '../implements/reset-password-code.command';

@Injectable()
@CommandHandler(ResetPasswordCodeCommand)
export class ResetPasswordCodeHandler
  implements ICommandHandler<ResetPasswordCodeCommand>
{
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationRepository: AbstractVerificationRepository,
  ) {}

  async execute(command: ResetPasswordCodeCommand): Promise<void> {
    const codeRecord = await this.verificationRepository.findByCode(
      command.code,
    );

    if (command.password !== command.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (!codeRecord || codeRecord.isUsed || codeRecord.expiresAt < new Date()) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userReadRepository.findById(codeRecord.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPassword = await Password.create(command.password);

    user.setPassword(newPassword);
    await this.userWriteRepository.update(user);
    await this.verificationRepository.markAsUsed(codeRecord.id);
  }
}
