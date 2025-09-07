import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IVerificationTokenRepository } from '../../domain/repositories/password.repository';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';

export enum EmailVerificationStatus {
  SUCCESS = 'success',
  INVALID = 'invalid',
  ALREADY_VERIFIED = 'alreadyVerified',
  EXPIRED = 'expired',
}

@Injectable()
export class EmailVerificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
  ) {}

  async verifyEmailToken(token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const record = await this.verificationTokenRepository.findByToken(token);

    if (!record) {
      return EmailVerificationStatus.INVALID;
    }
    if (record.used) {
      return EmailVerificationStatus.ALREADY_VERIFIED;
    }
    if (record.expiresAt < new Date()) {
      return EmailVerificationStatus.EXPIRED;
    }

    await this.userRepository.updateIsVerified(record.userId);
    await this.verificationTokenRepository.markAsUsed(record.id);

    return EmailVerificationStatus.SUCCESS;
  }
}
