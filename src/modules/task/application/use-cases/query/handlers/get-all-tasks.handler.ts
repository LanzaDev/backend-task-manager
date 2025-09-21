import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';

import { GetAllTasksQuery } from '../implements/get-all-tasks.query';
import { ResponseTaskDTO } from '@/modules/task/presentation/dto/output/response-task.dto';
import { TaskMapper } from '../../../mapper/task.mapper';

import { Role } from '@/shared/types/role.type';

@Injectable()
@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
  ) {}

  async execute(query: GetAllTasksQuery): Promise<ResponseTaskDTO[]> {
    const requester = await this.userReadRepository.findById(query.requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    if (query.requesterRole === Role.USER) {
      throw new NotFoundException('You cannot see other user tasks');
    }

    const tasks = await this.taskReadRepository.findAllTasks();
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No task found');
    }

    return TaskMapper.toDTOList(tasks);
  }
}
