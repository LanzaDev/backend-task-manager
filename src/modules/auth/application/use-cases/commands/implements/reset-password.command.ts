export class ResetPasswordCommand {
  constructor(
    public readonly password: string,
    public readonly confirmPassword: string,
    public readonly code?: string,
    public readonly token?: string,
  ) {}
}
