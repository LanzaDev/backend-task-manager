export class ResetPasswordTokenCommand {
  constructor(
    public readonly token: string,
    public readonly password: string,
    public readonly confirmPassword: string,
  ) {}
}
