import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';

import { GetAllTasksByUserIdQuery } from '../implements/get-all-tasks-by-user-id.query';
import { ResponseTaskDTO } from '@/modules/task/presentation/dto/output/response-task.dto';
import { TaskMapper } from '../../../mapper/task.mapper';
import { Role } from '@/shared/types/role.type';

@Injectable()
@QueryHandler(GetAllTasksByUserIdQuery)
export class GetAllTaskByUserIdHandler
  implements IQueryHandler<GetAllTasksByUserIdQuery>
{
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly taskReadRepository: AbstractTaskReadRepository,
  ) {}

  async execute(query: GetAllTasksByUserIdQuery): Promise<ResponseTaskDTO[]> {
    const requester = await this.userReadRepository.findById(query.requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    if (
      query.requesterRole === Role.USER &&
      query.targetUserId !== query.requesterId
    ) {
      throw new NotFoundException('You cannot see other user tasks');
    }

    const userIdToFetch = query.targetUserId || query.requesterId;

    const tasks = await this.taskReadRepository.findAllByUser(userIdToFetch);
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No task found for this user');
    }

    return TaskMapper.toDTOList(tasks);
  }
}
