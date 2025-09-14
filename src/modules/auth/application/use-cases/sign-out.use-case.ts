import { Injectable } from '@nestjs/common';
import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { AbstractAuthTokenCacheReadRepository } from '../../domain/repositories/auth-token-cache.read-repository';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly authTokenCacheWriteRepository: AbstractAuthTokenCacheWriteRepository,
    private readonly authTokenCacheReadRepository: AbstractAuthTokenCacheReadRepository,
  ) {}

  async execute(refreshToken: string) {
    const userId =
      await this.authTokenCacheReadRepository.getUserIdByToken(refreshToken);

    if (!userId) {
      return false;
    }

    await this.authTokenCacheWriteRepository.deleteSession(userId);

    return true;
  }
}
