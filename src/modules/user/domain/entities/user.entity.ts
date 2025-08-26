import { Task } from '@/modules/task/domain/entities/task.entity';
import { randomUUID } from 'crypto';
import { Role } from '@/shared/domain/value-objects/role.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

interface UserSchema {
  name: string;
  email: Email;
  password: Password;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly id: string;
  private readonly props: UserSchema;
  private tasks: Task[] = [];

  constructor(props: UserSchema, id?: string) {
    this.props = {
      ...props,
      role: props.role ?? 'USER',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    this.id = id || randomUUID();
  }

  // - Core -
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.props.name;
  }
  setName(newName: string) {
    this.props.name = newName;
    this.touch();
  }

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

  /** 🔒 Não expõe o VO inteiro, só a validação controlada */
  async validatePassword(plain: string): Promise<boolean> {
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

  getCreatedAt(): Date {
    return this.props.createdAt!;
  }

  getUpdatedAt(): Date {
    return this.props.updatedAt!;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // - Tasks -
  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  removeTask(taskId: string) {
    this.tasks = this.tasks.filter(task => task.getId() !== taskId);
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.getId() === updatedTask.getId());
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
  }
}
