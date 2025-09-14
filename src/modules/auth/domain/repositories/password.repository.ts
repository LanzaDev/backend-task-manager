import { Token } from "@/shared/domain/value-objects/token.vo";
import { VerificationToken } from "@prisma/client";

export abstract class AbstractVerificationTokenRepository {
  abstract create(data: {
    userId: string;
    token: Token;
    expiresAt: Date;
    isUsed: boolean;
  }): Promise<void>;

  abstract findByToken(token: string): Promise<VerificationToken | null>;

  abstract markAsUsed(id: string): Promise<void>;

  abstract deleteExpired(): Promise<void>;
}
