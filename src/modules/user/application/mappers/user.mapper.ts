import { User } from '@/modules/user/domain/entities/user.entity';
import { CreateUserDTO } from '@/modules/user/application/dto/input/create-user.dto';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

export class UserMapper {
  static async toEntity(dto: CreateUserDTO): Promise<User> {
    const email = new Email(dto.email);
    const password = await Password.create(dto.password);

    return new User({
      name: dto.name,
      email,
      password,
    });
  }

  static toDTO(entity: User): ResponseUserDTO {
    return new ResponseUserDTO(entity);
  }

  static toDTOList(entities: User[]): ResponseUserDTO[] {
    return entities.map((user) => new ResponseUserDTO(user));
  }
}
