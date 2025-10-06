import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AbstractVerificationRepository } from '@/modules/auth/domain/repositories/verify.repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { Password } from '@/shared/domain/value-objects/password.vo';
import { ResetPasswordCommand } from '../implements/reset-password.command';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly verificationRepository: AbstractVerificationRepository,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ success: boolean }> {
    const { code, token, password, confirmPassword } = command;

    const record = token
      ? await this.verificationRepository.findByToken(token)
      : await this.verificationRepository.findByCode(code!);

    if (!record || record.isUsed || record.expiresAt.getTime() <= Date.now()) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userReadRepository.findById(record.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const newPassword = await Password.create(password);
    user.setPassword(newPassword);

    await this.userWriteRepository.update(user);
    await this.verificationRepository.markAsUsed(record.id);

    return { success: true };
  }
}
