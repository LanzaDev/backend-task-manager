import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AbstractVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { ResetPasswordDTO } from '../../../../presentation/dto/input/reset-password.dto';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../implements/reset-password.command';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly tokenRepository: AbstractVerificationTokenRepository,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const tokenRecord = await this.tokenRepository.findByToken(command.token);

    if (command.password !== command.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (
      !tokenRecord ||
      tokenRecord.isUsed ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userReadRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPassword = await Password.create(command.password);

    await user.setPassword(newPassword);
    await this.userWriteRepository.update(user);
    await this.tokenRepository.markAsUsed(tokenRecord.id);
  }
}
