export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email address');
    }

    this.value = email.toLowerCase();
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email) {
    return this.value === other.getValue();
  }
}
