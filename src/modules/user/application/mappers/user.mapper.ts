import { User } from '@/modules/user/domain/entities/user.entity';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

export class UserMapper {
  static toDTO(entity: User): ResponseUserDTO {
    return new ResponseUserDTO(entity);
  }

  static toDTOList(entities: User[]): ResponseUserDTO[] {
    return entities.map((user) => new ResponseUserDTO(user));
  }
}
