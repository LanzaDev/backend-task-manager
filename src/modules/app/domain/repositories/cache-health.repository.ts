export abstract class CacheHealthRepository {
  abstract checkConnection(): Promise<boolean>;
}
