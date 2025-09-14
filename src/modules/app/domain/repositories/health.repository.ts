export abstract class HealthRepository {
  abstract checkConnection(): Promise<boolean>;
}
