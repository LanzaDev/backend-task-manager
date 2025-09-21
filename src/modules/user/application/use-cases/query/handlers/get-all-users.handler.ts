import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { UserMapper } from '../../../mappers/user.mapper';
import { ResponseAdminDTO } from '@/modules/user/presentation/dto/output/response-admin.dto';

import { GetAllUsersQuery } from '../implements/get-all-users.query';
import { Role } from '@/shared/types/role.type';

@Injectable()
@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(query: GetAllUsersQuery): Promise<ResponseAdminDTO[]> {
    const requester = await this.userReadRepository.findById(query.requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    if (query.requesterRole === Role.USER) {
      throw new NotFoundException('You cannot see other users');
    }

    const users = await this.userReadRepository.findAll();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return UserMapper.toDTOList(users);
  }
}
