export class ValidateUserCredentialsQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
