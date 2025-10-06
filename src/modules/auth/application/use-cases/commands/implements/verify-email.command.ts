export class VerifyEmailCommand {
  constructor(
    public readonly token?: string,
    public readonly code?: string,
  ) {}
}
