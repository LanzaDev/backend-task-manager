import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

import { ResponseUserDTO } from '../../../../presentation/dto/output/response-user.dto';
import { ResponseAdminDTO } from '@/modules/user/presentation/dto/output/response-admin.dto';

import { GetUserByIdQuery } from '../implements/get-user-by-id.query';
import { Role } from '@/shared/types/role.type';

@Injectable()
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(
    query: GetUserByIdQuery,
  ): Promise<ResponseUserDTO | ResponseAdminDTO> {
    const requester = await this.userReadRepository.findById(query.requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    const targetUser = await this.userReadRepository.findById(
      query.targetUserId,
    );
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (
      query.requesterRole === Role.USER &&
      query.targetUserId !== query.requesterId
    ) {
      throw new NotFoundException('Cannot see other users profile');
    }

    const dto =
      query.requesterRole === Role.ADMIN
        ? new ResponseAdminDTO(targetUser)
        : new ResponseUserDTO(targetUser);

    return dto;
  }
}
