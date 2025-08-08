import { User } from '../../domain/entities/user.entity';

export class ResponseUserDTO {
  id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmail().getValue();
  }
}
