import { VerifyRecoveryCommand } from './verify-recovery.command';

export class ResetPasswordCommand {
  constructor(
    public readonly password: string,
    public readonly data: VerifyRecoveryCommand,
  ) {}
}
