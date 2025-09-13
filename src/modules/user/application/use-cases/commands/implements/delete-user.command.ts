export class DeleteUserCommand {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: string,
    public readonly targetUserId: string,
    public readonly password?: string,
  ) {}
}
