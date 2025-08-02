export abstract class DatabaseRepository {
  abstract checkDatabaseConnection(): Promise<boolean>;
}
