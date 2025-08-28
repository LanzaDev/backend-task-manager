import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDTO } from '../dto/input/create-task.dto';

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
