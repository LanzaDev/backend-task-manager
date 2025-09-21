import { Role } from '@/shared/types/role.type';

export class DeleteTaskCommand {
  constructor(
    public readonly requesterId: string,
    public readonly taskId: string,
    public readonly requesterRole: Role,
    public readonly targetUserId?: string,
  ) {}
}
