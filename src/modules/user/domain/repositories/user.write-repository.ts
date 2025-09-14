import { User } from '@/modules/user/domain/entities/user.entity';

export abstract class AbstractUserWriteRepository {
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract updateIsVerified(id: string): Promise<void>;
}
