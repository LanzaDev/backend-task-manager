export class VerifyResetPasswordCommand {
  constructor(
    public readonly token?: string,
    public readonly code?: string,
  ) {}
}
