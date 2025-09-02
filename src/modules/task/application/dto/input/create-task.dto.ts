import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @Transform(({ value }) => value ?? TaskStatus.PENDENTE)
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsDate()
  completedAt?: Date
}
