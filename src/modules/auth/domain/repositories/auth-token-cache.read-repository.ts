export interface SessionData {
  refreshToken: string;
}

export abstract class AuthTokenCacheReadRepository {
  abstract getUserIdByToken(refreshToken: string): Promise<string | null>;
  abstract getSession(userId: string): Promise<SessionData | null>;
  abstract isTokenBlacklisted(token: string): Promise<boolean>;
}
