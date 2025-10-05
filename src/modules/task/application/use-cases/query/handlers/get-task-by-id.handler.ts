import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';

import { GetTaskByIdQuery } from '../implements/get-task-by-id.query';
import { ResponseTaskDTO } from '@/modules/task/presentation/dto/output/response-task.dto';
import { TaskMapper } from '../../../mapper/task.mapper';

import { Role } from '@/shared/types/role.type';

@Injectable()
@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
  ) {}

  async execute(query: GetTaskByIdQuery): Promise<ResponseTaskDTO> {
    const requester = await this.userReadRepository.findById(query.requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    const task = await this.taskReadRepository.findById(query.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const targetUserId = task.getUserId();

    if (
      query.requesterRole === Role.USER &&
      targetUserId !== query.requesterId
    ) {
      throw new NotFoundException('Cannot see other tasks');
    }

    return TaskMapper.toDTO(task);
  }
}
