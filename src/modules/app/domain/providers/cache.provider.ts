export abstract class CacheRepository {
  abstract checkCacheConnection(): Promise<boolean>;
}
