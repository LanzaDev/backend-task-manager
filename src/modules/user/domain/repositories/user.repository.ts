import { Email } from '@/shared/domain/value-objects/email.vo';
import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
}
