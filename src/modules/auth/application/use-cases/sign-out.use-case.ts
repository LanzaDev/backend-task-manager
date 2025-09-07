import { Injectable } from '@nestjs/common';
import { AuthTokenCacheRepository } from '@/modules/auth/domain/repositories/auth-token-cache.repository';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly authTokenCacheRepository: AuthTokenCacheRepository,
  ) {}

  async execute(refreshToken: string) {
    const userId =
      await this.authTokenCacheRepository.getUserIdByToken(refreshToken);

    if (!userId) {
      return false;
    }

    await this.authTokenCacheRepository.deleteSession(userId);

    return true;
  }
}
