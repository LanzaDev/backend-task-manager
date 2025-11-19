import { VerificationType } from '@prisma/client';

export type Verification = {
  id: string;
  userId: string;
  token: string;
  code: string;
  type: VerificationType;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  usedAt: Date | null;
};
