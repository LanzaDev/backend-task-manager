import { Injectable } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { AbstractUserReadRepository } from "@/modules/user/domain/repositories/user.read-repository";
import { CheckEmailQuery } from "../implements/check-email.query";

@Injectable()
@QueryHandler(CheckEmailQuery)
export class CheckEmailHandler implements IQueryHandler<CheckEmailQuery> {
  constructor(private readonly userReadRepository: AbstractUserReadRepository) {}

  async execute(query: CheckEmailQuery): Promise<boolean> {
    const user = await this.userReadRepository.findByEmail(query.email);
    return !!user;
  }
}
