export abstract class HealthRepository {
  abstract check(): Promise<boolean>;
}
