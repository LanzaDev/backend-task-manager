export interface SessionData {
  refreshToken: string;
}

export abstract class AuthTokenCacheRepository {
  abstract getUserIdByToken(refreshToken: string): Promise<string | null>

  abstract getUserIdByToken(refreshToken: string): Promise<string | null>;
  abstract setRefreshToken(refreshToken: string, userId: string, ttl: number): Promise<void>;
  abstract deleteRefreshToken(refreshToken: string): Promise<void>;

  abstract setSession(userId: string, data: SessionData, ttl: number): Promise<void>;
  abstract getSession(userId: string): Promise<SessionData | null>;
  abstract deleteSession(userId: string): Promise<void>;

  abstract addToBlacklist(token: string, ttl: number): Promise<void>;
  abstract isTokenBlacklisted(token: string): Promise<boolean>;
}
