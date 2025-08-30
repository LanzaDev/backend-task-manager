import { Token } from "@/shared/domain/value-objects/token.vo";
import { PasswordResetToken } from "@prisma/client";

export abstract class IPasswordResetTokenRepository {
  abstract create(data: {
    userId: string;
    token: Token;
    expiresAt: Date;
    used: boolean;
  }): Promise<void>;

  abstract findByToken(token: string): Promise<PasswordResetToken | null>;

  abstract markAsUsed(id: string): Promise<void>;

  abstract deleteExpired(): Promise<void>;
}
