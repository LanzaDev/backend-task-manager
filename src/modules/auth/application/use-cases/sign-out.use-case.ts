import { Injectable } from '@nestjs/common';
import { AuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { AuthTokenCacheReadRepository } from '../../domain/repositories/auth-token-cache.read-repository';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly authTokenCacheWriteRepository: AuthTokenCacheWriteRepository,
    private readonly authTokenCacheReadRepository: AuthTokenCacheReadRepository,
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
