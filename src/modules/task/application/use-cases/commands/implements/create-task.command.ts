import { TaskStatus } from '@/modules/task/domain/entities/task.entity';
import { Role } from '@/shared/types/role.type';

export class CreateTaskCommand {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly targetUserId: string,
    public readonly title: string,
    public readonly description?: string,
    public readonly status?: TaskStatus,
    public readonly priority?: number,
    public readonly dueDate?: Date,
    public readonly completedAt?: Date,
  ) {}
}
