import { randomUUID } from 'crypto';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/types/role.type';

interface UserSchema {
  name: string;
  email: Email;
  password: Password;
  role?: Role;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly id: string;
  private readonly props: UserSchema;

  constructor(props: UserSchema, id?: string) {
    this.props = {
      ...props,
      role: props.role ?? 'USER',
      isVerified: props.isVerified ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    this.id = id || randomUUID();
  }

  // id
  getId(): string {
    return this.id;
  }

  // name
  getName(): string {
    return this.props.name;
  }
  setName(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  // email
  getEmail(): Email {
    return this.props.email;
  }
  getEmailValue(): string {
    return this.props.email.getValue();
  }
  setEmail(newEmail: Email) {
    this.props.email = newEmail;
    this.touch();
  }

  // password
  /** 🔒 Não expõe o VO inteiro, só a validação controlada */
  async comparePassword(plain: string): Promise<boolean> {
    return this.props.password.compare(plain);
  }

  /** 🔒 Usado apenas pelo repositório para persistir no banco */
  getHashedPassword(): string {
    return this.props.password.getHashedValue();
  }

  setPassword(newPassword: Password) {
    this.props.password = newPassword;
    this.touch();
  }

  // role
  getRole(): Role {
    return this.props.role ?? 'USER';
  }
  canBeDeleted(): boolean {
    return this.props.role !== 'ADMIN';
  }
  setRole(newRole: Role) {
    this.props.role = newRole;
    this.touch();
  }

  // verification
  isVerified(): boolean {
    return this.props.isVerified ?? false;
  }
  markAsVerified() {
    this.props.isVerified = true;
    this.touch();
  }

  // timestamps
  getCreatedAt(): Date {
    return this.props.createdAt!;
  }
  getUpdatedAt(): Date {
    return this.props.updatedAt!;
  }

  // touch
  private touch() {
    this.props.updatedAt = new Date();
  }
}
