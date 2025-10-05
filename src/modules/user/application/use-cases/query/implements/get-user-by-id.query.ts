import { Role } from '@/shared/types/role.type';

export class GetUserByIdQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly targetUserId: string,
  ) {}
}
