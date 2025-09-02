import { Injectable } from '@nestjs/common';
import { AuthTokenCacheRepository } from '@/modules/auth/domain/repositories/auth-token-cache.repository';

@Injectable()
export class SignOutUseCase {
  constructor(private readonly authTokenCacheRepository: AuthTokenCacheRepository) {}

  async execute(userId: string, refreshToken?: string) {
    const cached = await this.authTokenCacheRepository.getSession(userId);
    if (cached && cached.refreshToken === refreshToken) {
      await this.authTokenCacheRepository.deleteSession(userId);
      return true;
    }
    return false;
  }
}
