import { Token } from "@/shared/domain/value-objects/token.vo";
import { VerificationToken } from "@prisma/client";

export abstract class IVerificationTokenRepository {
  abstract create(data: {
    userId: string;
    token: Token;
    expiresAt: Date;
    used: boolean;
  }): Promise<void>;

  abstract findByToken(token: string): Promise<VerificationToken | null>;

  abstract markAsUsed(id: string): Promise<void>;

  abstract deleteExpired(): Promise<void>;
}
