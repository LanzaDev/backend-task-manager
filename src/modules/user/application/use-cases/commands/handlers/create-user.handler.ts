import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AbstractUserWriteRepository } from '@/modules/user/domain/repositories/user.write-repository';

import { ResponseAdminDTO } from '@/modules/user/presentation/dto/output/response-admin.dto';

import { CheckEmailQuery } from '../../query/implements/check-email.query';
import { CreateUserCommand } from '../implements/create-user.command';

import { Email } from '@/shared/domain/value-objects/email.vo';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { Role } from '@/shared/types/role.type';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userWriteRepository: AbstractUserWriteRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<ResponseAdminDTO> {
    const email = new Email(command.email);
    const emailExists = await this.queryBus.execute<CheckEmailQuery, boolean>(
      new CheckEmailQuery(email),
    );
    const password = await Password.create(command.password);

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const user = User.create({
      name: command.name,
      email,
      password,
      role: command.role ?? Role.USER,
      isVerified: true,
    });
    await this.userWriteRepository.create(user);

    return new ResponseAdminDTO(user);
  }
}
