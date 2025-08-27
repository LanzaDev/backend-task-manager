import { randomUUID } from "crypto";

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

interface TaskSchema {
  userId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt?: Date;
}

export class Task {
  private readonly id: string;
  private readonly props: TaskSchema;
  private updatedAt: Date;

constructor(props: TaskSchema, id?: string) {
    this.id = id || randomUUID();
    this.props = {
      ...props,
      status: props.status ?? TaskStatus.PENDENTE,
      createdAt: props.createdAt ?? new Date(),
    };
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.props.userId;
  }
  setUserId(userId: string) {
    this.props.userId = userId;
    this.touch();
  }

  getTitle(): string {
    return this.props.title;
  }
  setTitle(title: string) {
    this.props.title = title;
    this.touch();
  }

  getDescription(): string | undefined {
    return this.props.description;
  }
  setDescription(description: string) {
    this.props.description = description;
    this.touch();
  }

  getStatus(): TaskStatus {
    return this.props.status!;
  }
  setStatus(status: TaskStatus) {
    this.props.status = status;
    this.touch();
  }

  getPriority(): number | undefined {
    return this.props.priority;
  }
  setPriority(priority: number) {
    this.props.priority = priority;
    this.touch();
  }

  getDueDate(): Date | undefined {
    return this.props.dueDate;
  }
  setDueDate(dueDate: Date) {
    this.props.dueDate = dueDate;
    this.touch();
  }

  getCompletedAt(): Date | undefined {
    return this.props.completedAt;
  }
  setCompletedAt(date: Date) {
    this.props.completedAt = date;
    this.touch();
  }

  getCreatedAt(): Date {
    return this.props.createdAt!;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
