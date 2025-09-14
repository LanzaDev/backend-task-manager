import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { UserMapper } from '@/modules/user/application/mappers/user.mapper';
import { ResponseAdminDTO } from '@/modules/user/presentation/dto/output/response-admin.dto';

import { Email } from '@/shared/domain/value-objects/email.vo';

import { CheckEmailQuery } from '../../query/implements/check-email.query';
import { CreateUserCommand } from '../implements/create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<ResponseAdminDTO> {
    const email = new Email(command.email);

    const emailExists = await this.queryBus.execute(new CheckEmailQuery(email));

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const user = await UserMapper.toEntity(command);
    await this.userWriteRepository.create(user);

    return new ResponseAdminDTO(user);
  }
}
