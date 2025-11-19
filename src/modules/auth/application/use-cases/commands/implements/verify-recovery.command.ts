import { VerificationType } from '@prisma/client';

export class VerifyRecoveryCommand {
  constructor(
    public readonly type: VerificationType,
    public readonly token?: string,
    public readonly code?: string,
  ) {}
}
