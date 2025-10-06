import { Role } from '@/shared/types/role.type';

export class GetAllTasksQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
  ) {}
}
