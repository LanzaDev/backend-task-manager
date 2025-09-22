import { RegisterDTO } from "@/modules/auth/presentation/dto/input/register.dto";

export class CreateAccountCommand {
  constructor(public readonly dto: RegisterDTO) {}
}
