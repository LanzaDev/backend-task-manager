import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Task } from '@/modules/task/domain/entities/task.entity';

import { AbstractTaskWriteRepository } from '@/modules/task/domain/repositories/task.write-repository';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { CreateTaskCommand } from '../implements/create-task.command';
import { Role } from '@/shared/types/role.type';
import axios from 'axios';

@Injectable()
@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskWriteRepository: AbstractTaskWriteRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: CreateTaskCommand) {
    const requester = await this.userReadRepository.findById(
      command.requesterId,
    );
    if (!requester) {
      throw new Error('requester not found');
    }

    const targetUser = await this.userReadRepository.findById(
      command.targetUserId,
    );
    if (!targetUser) {
      throw new Error('target user not found');
    }

    if (
      command.requesterRole === Role.USER &&
      command.targetUserId !== command.requesterId
    ) {
      throw new ForbiddenException('You cannot create this task');
    }

    if (!command.title) {
      throw new Error('title is required');
    }

    const task = new Task({
      userId: command.targetUserId,
      title: command.title,
      description: command.description,
      status: command.status,
      priority: command.priority,
      dueDate: command.dueDate,
      completedAt: command.completedAt,
      createdAt: new Date(),
    });

    const createdTask = await this.taskWriteRepository.create(task);

    // -----------------------------
    // Envio para o MCP (desacoplado)
    // -----------------------------
    // try {
    //   const taskForMCP = {
    //     id: createdTask.getId(),
    //     userId: createdTask.getUserId(),
    //     title: createdTask.getTitle(),
    //     description: createdTask.getDescription(),
    //     status: createdTask.getStatus(),
    //     priority: createdTask.getPriority(),
    //     dueDate: createdTask.getDueDate()?.toISOString(),
    //     createdAt: createdTask.getCreatedAt()?.toISOString(),
    //     updatedAt: createdTask.getUpdatedAt()?.toISOString(),
    //     completedAt: createdTask.getCompletedAt()?.toISOString(),
    //     metadata: { source: 'NestJS API' },
    //   };
    //   await axios.post('http://localhost:8001/process-task', taskForMCP);
    // } catch (error) {
    //   console.warn('MCP offline, skipping task processing', error);
    // }

    return createdTask;
  }
}
