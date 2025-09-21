import { Task, TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

export class ResponseTaskDTO {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  title: string;

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

  constructor(data: {
    id: string;
    userId: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: number;
    dueDate?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, data);
  }
}
