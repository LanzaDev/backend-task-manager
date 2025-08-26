import { User } from '../entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';

export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
