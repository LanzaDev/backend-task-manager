import { User } from '@/modules/user/domain/entities/user.entity';
import { Email } from '@/shared/domain/value-objects/email.vo';

export abstract class AbstractUserReadRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
