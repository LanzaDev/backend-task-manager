import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../implements/get-user-by-id.query';
import { IUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { ResponseUserDTO } from '../../../dto/output/response-user.dto';
import { NotFoundException } from '@nestjs/common';
import { ResponseAdminDTO } from '../../../dto/output/response-admin.dto';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userReadRepository: IUserReadRepository) {}

  async execute(query: GetUserByIdQuery): Promise<ResponseUserDTO> {
    const user = await this.userReadRepository.findById(query.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new ResponseUserDTO(user);
  }
}
