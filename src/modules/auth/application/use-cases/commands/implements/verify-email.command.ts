import { VerifyRecoveryCommand } from './verify-recovery.command';

export class VerifyEmailCommand {
  constructor(public readonly data: VerifyRecoveryCommand) {}
}
