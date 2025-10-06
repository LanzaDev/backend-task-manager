export type Verification = {
  id: string;
  userId: string;
  token: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  usedAt: Date | null;
};
