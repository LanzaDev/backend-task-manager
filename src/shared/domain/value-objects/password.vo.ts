import * as bcrypt from 'bcrypt';

export class Password {
  private readonly hashed: string;

  private constructor(hashed: string) {
    this.hashed = hashed;
  }

  // cria a senha já com hash
  static async create(plain: string): Promise<Password> {
    if (!plain || typeof plain !== 'string' || plain.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(plain, 10);
    return new Password(hashed);
  }

  // restaura do banco (hash já existente)
  static fromHashed(hashed: string): Password {
    return new Password(hashed);
  }

  getHashedValue(): string {
    return this.hashed;
  }

  async compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.hashed);
  }
}
