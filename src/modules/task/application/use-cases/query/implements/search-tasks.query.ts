import { Role } from "@/shared/types/role.type";

export class SearchTasksQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly searchText: string,
    public readonly targetUserId: string,
  ) {}
}
