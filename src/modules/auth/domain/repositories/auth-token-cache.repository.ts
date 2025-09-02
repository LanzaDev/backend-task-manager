export interface SessionData {
  refreshToken: string;
}

export abstract class AuthTokenCacheRepository {
  abstract setToken(token: string, data: unknown, ttl: number): Promise<void>;
  abstract getToken<T = unknown>(token: string): Promise<T | null>;
  abstract deleteToken(token: string): Promise<void>;

  abstract setSession(userId: string, data: SessionData, ttl: number): Promise<void>;
  abstract getSession(userId: string): Promise<SessionData | null>;
  abstract deleteSession(userId: string): Promise<void>;

  abstract addToBlacklist(token: string, ttl: number): Promise<void>;
  abstract isTokenBlacklisted(token: string): Promise<boolean>;
}
