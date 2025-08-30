import { IPasswordResetTokenRepository } from '../../domain/repositories/password.repository';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
  ) {}

  async execute(dto: { token: string; newPassword: string }): Promise<void> {
    const tokenRecord = await this.tokenRepository.findByToken(dto.token);

    if (!tokenRecord) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    if (!tokenRecord || tokenRecord.used) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const password = await Password.create(dto.newPassword);
    await user.setPassword(password);
    await this.userRepository.update(user);
    await this.tokenRepository.markAsUsed(tokenRecord.id);
  }
}
