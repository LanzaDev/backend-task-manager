export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new InvalidEmailError(email);
    }

    this.value = email.toLowerCase();
  }

  static isValid(email: string): boolean {
    // Regex RFC 5322 simplified
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }


  equals(other: Email): boolean {
    if (!other) return false;
    return this.value === other.getValue();
  }
}

// Domain-specific exception
export class InvalidEmailError extends Error{
  constructor(email: string) {
    super(`The email "${email}" is not valid`)
    this.name = "InvalidEmailError"
  }
}
