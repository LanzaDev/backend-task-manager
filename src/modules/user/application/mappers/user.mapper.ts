import { User } from '@/modules/user/domain/entities/user.entity';
import { CreateUserCommand } from '../use-cases/commands/implements/create-user.command';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

export class UserMapper {
  static async toEntity(command: CreateUserCommand): Promise<User> {
    const email = new Email(command.email);
    const password = await Password.create(command.password);

    return new User({
      name: command.name,
      email,
      password,
      isVerified: false,
    });
  }

  static toDTO(entity: User): ResponseUserDTO {
    return new ResponseUserDTO(entity);
  }

  static toDTOList(entities: User[]): ResponseUserDTO[] {
    return entities.map((user) => new ResponseUserDTO(user));
  }
}
