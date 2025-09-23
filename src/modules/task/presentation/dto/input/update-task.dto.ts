import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateTaskDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Finish task manager project' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Complete the task manager project' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  status?: TaskStatus;

  @Min(1)
  @Max(3)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 3 })
  priority?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-30T23:59:59Z', type: String })
  dueDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-25T12:00:00Z', type: String })
  completedAt?: Date;
}
