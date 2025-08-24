export class Token {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error("Invalid token")
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Token): boolean {
    return this.value === other.getValue();
  }

  //util for debugger
  toString(): string {
    return this.value;
  }
}
