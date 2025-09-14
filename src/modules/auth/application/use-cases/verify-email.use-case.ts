import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AbstractVerificationTokenRepository } from '../../domain/repositories/password.repository';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

export enum EmailVerificationStatus {
  INVALID = 'invalid',
  ALREADY_VERIFIED = 'alreadyVerified',
  EXPIRED = 'expired',
}

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly verificationTokenRepository: AbstractVerificationTokenRepository,
  ) {}

  async verifyEmailToken(token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const record = await this.verificationTokenRepository.findByToken(token);

    if (!record) {
      return EmailVerificationStatus.INVALID;
    }
    if (record.isUsed) {
      return EmailVerificationStatus.ALREADY_VERIFIED;
    }
    if (record.expiresAt < new Date()) {
      return EmailVerificationStatus.EXPIRED;
    }

    await this.userWriteRepository.updateIsVerified(record.userId);
    await this.verificationTokenRepository.markAsUsed(record.id);

    return { status: EmailVerificationStatus.ALREADY_VERIFIED };
  }
}
