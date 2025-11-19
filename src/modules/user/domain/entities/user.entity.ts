import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/types/role.type';
import { BaseEntityType } from '@/core/types/base-entity.type';
import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { v4 as uuidv4 } from 'uuid';

interface UserProps extends BaseEntityType {
  name: string;
  email: Email;
  password: Password;
  role: Role;
  isVerified: boolean;
}

export type CreateUserProps = {
  name: string;
  email: Email;
  password: Password;
  role?: Role;
  isVerified: boolean;
};

export type UpdateUserProps = Partial<Omit<CreateUserProps, 'password'>>;

export class User extends AggregateRoot {
  private name: string;
  private email: Email;
  private password: Password;
  private role: Role;
  private isVerified: boolean;

  constructor(props: UserProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.isVerified = props.isVerified;
  }

  static create(props: CreateUserProps): User {
    const name = props.name;
    const email = props.email;
    const password = props.password;
    const role = props.role ?? Role.USER;
    const isVerified = props.isVerified ?? false;

    return new User({
      id: uuidv4(),
      name,
      email,
      password,
      role,
      isVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(props: UpdateUserProps) {
    if (props.name) this.name = props.name;
    if (props.email) this.email = props.email;
    if (props.role) this.role = props.role;
    if (props.isVerified) this.isVerified = props.isVerified;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
  setName(newName: string) {
    this.name = newName;
  }

  getEmail(): Email {
    return this.email;
  }
  getEmailValue(): string {
    return this.email.getValue();
  }
  setEmail(newEmail: Email) {
    this.email = newEmail;
  }

  /** 🔒 Não expõe o VO inteiro, só a validação controlada */
  async comparePassword(plain: string): Promise<boolean> {
    return this.password.compare(plain);
  }

  /** 🔒 Usado apenas pelo repositório para persistir no banco */
  getHashedPassword(): string {
    return this.password.getHashedValue();
  }
  setPassword(newPassword: Password) {
    this.password = newPassword;
  }

  getRole(): Role {
    return this.role ?? Role.USER;
  }
  isDeletable(): boolean {
    return this.role === Role.USER;
  }
  setRole(newRole: Role) {
    this.role = newRole;
  }

  isUserVerified(): boolean {
    return this.isVerified ?? false;
  }
  markAsVerified() {
    this.isVerified = true;
  }

  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }
}
