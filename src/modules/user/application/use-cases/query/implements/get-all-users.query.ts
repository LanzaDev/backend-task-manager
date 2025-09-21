export class GetAllUsersQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: string,
  ) {}
}
