export class MetaInputVO<T = string> {
  constructor(
    public readonly sortBy?: T,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}

  toKey(): string {
    return JSON.stringify({
      sortBy: this.sortBy,
      page: this.page,
      limit: this.limit,
    });
  }
}
