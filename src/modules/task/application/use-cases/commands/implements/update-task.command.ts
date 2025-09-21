import { UpdateTaskDTO } from '@/modules/task/presentation/dto/input/update-task.dto';
import { Role } from '@/shared/types/role.type';

export class UpdateTaskCommand {
  constructor(
    public readonly updateTaskData: Partial<UpdateTaskDTO>,
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly taskId: string,
    public readonly targetUserId?: string,
  ) {}
}
