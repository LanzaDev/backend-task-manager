import { UpdateUserDTO } from '../../../../presentation/dto/input/update-user.dto';
import { Role } from '@/shared/types/role.type';

export class UpdateUserCommand {
  constructor(
    public readonly updateData: Partial<UpdateUserDTO>,
    public readonly requesterId: string,
    public readonly requesterRole: Role,
    public readonly targetUserId: string,
    public readonly currentPassword?: string,
  ) {}
}
