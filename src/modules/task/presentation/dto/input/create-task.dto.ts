import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from '@/modules/task/domain/entities/task.entity';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Finish task manager project' })
  title!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Complete the task manager project' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @Transform(({ value }) => (value ?? TaskStatus.PENDING) as TaskStatus)
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
