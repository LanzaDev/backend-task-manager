import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IVerificationTokenRepository } from '@/modules/auth/domain/repositories/password.repository';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { ResetPasswordDTO } from '../dto/input/reset-password.dto';
import { Password } from '@/shared/domain/value-objects/password.vo';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IVerificationTokenRepository,
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const tokenRecord = await this.tokenRepository.findByToken(dto.token);

    if (dto.password !== dto.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (!tokenRecord || tokenRecord.used || tokenRecord.expiresAt < new Date()) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPassword = await Password.create(dto.password);

    await user.setPassword(newPassword);
    await this.userRepository.update(user);
    await this.tokenRepository.markAsUsed(tokenRecord.id);
  }
}
