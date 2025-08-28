import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { Task, TaskStatus } from '@/modules/task/domain/entities/task.entity';

export class ResponseTaskDTO {
  @IsString()
  @Expose()
  title?: string;

  @IsString()
  @Expose()
  description?: string;

  @IsEnum(TaskStatus)
  @Expose()
  status?: TaskStatus;

  @IsInt()
  @Min(1)
  @Max(3)
  @Expose()
  priority?: number;

  @IsDate()
  @Expose()
  dueDate?: Date;

  @IsDate()
  @Expose()
  createdAt?: Date;

  @IsDate()
  @Expose()
  updatedAt?: Date;

  @IsDate()
  @Expose()
  completedAt?: Date;

  constructor(task?: Task) {
    if(!task) return;
    this.title = task.getTitle();
    this.description = task.getDescription();
    this.status = task.getStatus();
    this.priority = task.getPriority();
    this.dueDate = task.getDueDate();
    this.createdAt = task.getCreatedAt();
    this.updatedAt = task.getUpdatedAt();
    this.completedAt = task.getCompletedAt();
  }
}
