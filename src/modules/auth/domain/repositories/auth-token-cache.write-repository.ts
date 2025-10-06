export interface SessionData {
  refreshToken: string;
}

export abstract class AbstractAuthTokenCacheWriteRepository {
  abstract setRefreshToken(
    refreshToken: string,
    userId: string,
    ttl: number,
  ): Promise<void>;
  abstract deleteRefreshToken(refreshToken: string): Promise<void>;
  abstract setSession(
    userId: string,
    data: SessionData,
    ttl: number,
  ): Promise<void>;
  abstract deleteSession(userId: string): Promise<void>;
  abstract addToBlacklist(token: string, ttl: number): Promise<void>;
}
