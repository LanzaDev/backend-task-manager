import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

export class ResponseTaskDTO {
  @Expose()
  @IsString()
  @ApiProperty({
    example: 'bf59e95b-512d-4157-a1f1-97aa2822b830',
    description: 'Task ID',
  })
  id: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'fba1c9fb-b4ee-4513-8a5d-1ad0b1d16b49',
    description: 'User ID',
  })
  userId: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Finish task manager project' })
  title: string;

  @Expose()
  @IsString()
  @ApiPropertyOptional({ example: 'Complete the task manager project' })
  description?: string;

  @Expose()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  status?: TaskStatus;

  @Min(1)
  @Max(3)
  @IsInt()
  @Expose()
  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 3 })
  priority?: number;

  @IsDate()
  @Expose()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-30T23:59:59Z', type: String })
  dueDate?: Date;

  @IsDate()
  @Expose()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-30T23:59:59Z', type: String })
  createdAt?: Date;

  @IsDate()
  @Expose()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-30T23:59:59Z', type: String })
  updatedAt?: Date;

  @IsDate()
  @Expose()
  @Type(() => Date)
  @ApiPropertyOptional({ example: '2025-09-30T23:59:59Z', type: String })
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
