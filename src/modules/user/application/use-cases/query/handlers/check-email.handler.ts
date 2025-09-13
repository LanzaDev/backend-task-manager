import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckEmailQuery } from "../implements/check-email.query";
import { IUserReadRepository } from "@/modules/user/domain/repositories/user.read-repository";

@QueryHandler(CheckEmailQuery)
export class CheckEmailHandler implements IQueryHandler<CheckEmailQuery> {
  constructor(private readonly userReadRepository: IUserReadRepository) {}

  async execute(query: CheckEmailQuery): Promise<boolean> {
    const user = await this.userReadRepository.findByEmail(query.email);
    return !!user;
  }
}
