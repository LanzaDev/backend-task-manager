import { Role } from '@/shared/types/role.type';

export class GetAllUsersQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
  ) {}
}
