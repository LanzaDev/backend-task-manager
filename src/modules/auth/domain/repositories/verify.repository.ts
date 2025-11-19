import { Verification } from '@/shared/domain/value-objects/verify.vo';
import { VerificationType } from '@/shared/types/verification-type.type';

export abstract class AbstractVerificationRepository {
  abstract create(data: {
    userId: string;
    token: string;
    code: string;
    type: VerificationType;
    expiresAt: Date;
    isUsed: boolean;
  }): Promise<void>;
  abstract findByToken(token: string): Promise<Verification | null>;
  abstract findByCode(code: string): Promise<Verification | null>;
  abstract markAsUsed(id: string): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}
