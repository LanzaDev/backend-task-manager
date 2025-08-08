import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { randomUUID } from 'crypto';

interface UserSchema {
  name: string;
  email: Email;
  password: Password;
}

export class User {
  private readonly id: string;
  private readonly props: UserSchema;
  constructor(props: UserSchema, id?: string) {
    this.props = props;
    this.id = id || randomUUID();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.props.name;
  }
  setName(newName: string) {
    this.props.name = newName;
  }

  getEmail(): Email {
    return this.props.email;
  }

  setEmail(newEmail: Email) {
    this.props.email = newEmail;
  }

  getPassword(): Password {
    return this.props.password;
  }

  setPassword(newPassword: Password) {
    this.props.password = newPassword;
  }
}
