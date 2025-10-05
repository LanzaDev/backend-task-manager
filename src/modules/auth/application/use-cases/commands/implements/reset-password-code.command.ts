export class ResetPasswordCodeCommand {
  constructor(
    public readonly code: string,
    public readonly password: string,
    public readonly confirmPassword: string,
  ) {}
}
