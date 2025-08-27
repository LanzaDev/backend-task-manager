import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTaskDTO {
  @IsString()
  @Expose()
  title!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @Expose()
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  priority?: number;

  @IsOptional()
  @IsDate()
  @Expose()
  dueDate?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  completedAt?: Date
}
