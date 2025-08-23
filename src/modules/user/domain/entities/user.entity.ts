import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { randomUUID } from 'crypto';
import { Task } from '@/modules/task/domain/entities/task.entity';

interface UserSchema {
  name: string;
  email: Email;
  password: Password;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly id: string;
  private props: UserSchema;
  private tasks: Task[] = [];

  constructor(props: UserSchema, id?: string) {
    this.props = {
      ...props,
      role: props.role ?? 'user',
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

  getRole(): string {
    return this.props.role ?? 'user';
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
