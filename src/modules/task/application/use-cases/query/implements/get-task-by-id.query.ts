import { Role } from "@/shared/types/role.type";

export class GetTaskByIdQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly taskId: string,
  ) {}
}
