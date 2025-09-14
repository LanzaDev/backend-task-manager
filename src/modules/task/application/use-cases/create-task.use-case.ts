import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { CreateTaskDTO } from '@/modules/task/presentation/dto/input/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskWriteRepository: AbstractTaskWriteRepository) {}

  async execute(dto: CreateTaskDTO, userId: string): Promise<Task> {
    const task = new Task({
      userId,
      title: dto.title!,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate,
      completedAt: dto.completedAt,
      createdAt: new Date(),
    });

    return this.taskWriteRepository.create(task);
  }
}
