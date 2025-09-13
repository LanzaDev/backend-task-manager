import { UpdateUserDTO } from '../../../dto/input/update-user.dto';

export class UpdateUserCommand {
  constructor(
    public readonly updateData: Partial<UpdateUserDTO>,
    public readonly requesterId: string,
    public readonly requesterRole: string,
    public readonly targetUserId: string,
  ) {}
}
