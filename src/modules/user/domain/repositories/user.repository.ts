import { User } from '../entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';

export abstract class IUserRepository {
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
