import { randomUUID } from "crypto";

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  CANCELADA = 'CANCELADA',
  CONCLUIDA = 'CONCLUIDA',
}

interface TaskSchema {
  userId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  createdAt: Date;
}

export class Task {
  private readonly id: string;
  private readonly props: TaskSchema;

  constructor(props: TaskSchema, id?: string) { 
    this.id = id || randomUUID()
    this.props = {
      ...props,
      status: props.status ?? TaskStatus.PENDENTE,
      createdAt: props.createdAt ?? new Date()
    };
  }
  
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.props.userId;
  }
  setUserId(userId: string) {
    this.props.userId = userId;
  }

  getTitle(): string {
    return this.props.title;
  }
  setTitle(title: string) {
    this.props.title = title;
  }

  getDescription(): string | undefined {
    return this.props.description;
  }
  setDescription(description: string) {
    this.props.description = description;
  }

  getStatus(): TaskStatus {
    return this.props.status!;
  }
  setStatus(status: TaskStatus) {
    this.props.status = status;
  }

  getCreatedAt(): Date {
    return this.props.createdAt!;
  }
}