import { Injectable } from '@nestjs/common';
import { Task } from '@/modules/task/domain/entities/task.entity';
import { ITaskRepository } from '@/modules/task/domain/repositories/task.repository';
import { CreateTaskDTO } from '@/modules/task/application/dto/input/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

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

    return this.taskRepository.create(task);
  }
}
