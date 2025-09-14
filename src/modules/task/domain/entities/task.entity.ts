import { randomUUID } from "crypto";

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
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
      status: props.status ?? TaskStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
    };
    this.updatedAt = new Date();
  }

  // id
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

  // title
  getTitle(): string {
    return this.props.title;
  }
  setTitle(title: string) {
    this.props.title = title;
    this.touch();
  }

  // description
  getDescription(): string | undefined {
    return this.props.description;
  }
  setDescription(description: string) {
    this.props.description = description;
    this.touch();
  }

  // status
  getStatus(): TaskStatus {
    return this.props.status!;
  }
  setStatus(status: TaskStatus) {
    this.props.status = status;
    this.touch();
  }

  // priority
  getPriority(): number | undefined {
    return this.props.priority;
  }
  setPriority(priority: number) {
    this.props.priority = priority;
    this.touch();
  }

  // dueDate
  getDueDate(): Date | undefined {
    return this.props.dueDate;
  }
  setDueDate(dueDate: Date) {
    this.props.dueDate = dueDate;
    this.touch();
  }

  // completedAt
  getCompletedAt(): Date | undefined {
    return this.props.completedAt;
  }
  setCompletedAt(date: Date) {
    this.props.completedAt = date;
    this.touch();
  }

  // timestamps
  getCreatedAt(): Date {
    return this.props.createdAt!;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // touch
  private touch() {
    this.updatedAt = new Date();
  }
}
