export abstract class DatabaseHealthRepository {
  abstract checkConnection(): Promise<boolean>;
}
