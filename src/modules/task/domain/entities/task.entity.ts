import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { BaseEntityType } from '@/core/types/base-entity.type';
import { v4 as uuidv4 } from 'uuid';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

export type CreateTaskProps = {
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  dueDate: Date;
  completedAt: Date;
};

export type UpdateTaskProps = Partial<CreateTaskProps>;

interface TaskProps extends BaseEntityType {
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus | TaskStatus.PENDING;
  priority: number | null;
  dueDate: Date | null;
  completedAt: Date | null;
}

export class Task extends AggregateRoot {
  private userId: string;
  private title: string;
  private description: string | null;
  private status: TaskStatus | TaskStatus.PENDING;
  private priority: number | null;
  private dueDate: Date | null;
  private completedAt: Date | null;

  constructor(props: TaskProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.userId = props.userId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.priority = props.priority;
    this.dueDate = props.dueDate;
    this.completedAt = props.completedAt;
  }

  static create(props: CreateTaskProps) {
    const userId = props.userId;
    const title = props.title;
    const description = props.description ?? null;
    const status = props.status ?? TaskStatus.PENDING;
    const priority = props.priority ?? null;
    const dueDate = props.dueDate ?? null;
    const completedAt = props.completedAt ?? null;

    return new Task({
      id: uuidv4(),
      userId,
      title,
      description,
      status,
      priority,
      dueDate,
      completedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(props: UpdateTaskProps) {
    if (props.title) this.title = props.title;
    if (props.description) this.description = props.description;
    if (props.status) this.status = props.status;
    if (props.priority) this.priority = props.priority;
    if (props.dueDate) this.dueDate = props.dueDate;
    if (props.completedAt) this.completedAt = props.completedAt;
  }

  getId(): string {
    return this.id;
  }
  getUserId(): string {
    return this.userId;
  }
  setUserId(userId: string) {
    this.userId = userId;
  }

  getTitle(): string {
    return this.title;
  }
  setTitle(title: string) {
    this.title = title;
  }

  getDescription(): string | null {
    return this.description;
  }
  setDescription(description: string) {
    this.description = description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }
  setStatus(status: TaskStatus) {
    this.status = status;
  }

  getPriority(): number | null {
    return this.priority;
  }
  setPriority(priority: number) {
    this.priority = priority;
  }

  getDueDate(): Date | null {
    return this.dueDate;
  }
  setDueDate(dueDate: Date) {
    this.dueDate = dueDate;
  }

  getCompletedAt(): Date | null {
    return this.completedAt;
  }
  setCompletedAt(date: Date) {
    this.completedAt = date;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
