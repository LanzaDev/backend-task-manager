import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { ValidateUserCredentialsQuery } from '../implements/validate-user-credentials.query';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
@QueryHandler(ValidateUserCredentialsQuery)
export class ValidateUserCredentialsHandler
  implements IQueryHandler<ValidateUserCredentialsQuery>
{
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(query: ValidateUserCredentialsQuery): Promise<ResponseUserDTO> {
    const email = new Email(query.email);
    const existingUser = await this.userReadRepository.findByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await existingUser.comparePassword(query.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!existingUser.isVerified()) {
      throw new UnauthorizedException('Email not verified');
    }

    return new ResponseUserDTO(existingUser);
  }
}
