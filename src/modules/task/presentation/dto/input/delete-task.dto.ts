import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTaskDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'bf59e95b-512d-4157-a1f1-97aa2822b830',
    description: 'Task ID',
  })
  taskId: string;
}
