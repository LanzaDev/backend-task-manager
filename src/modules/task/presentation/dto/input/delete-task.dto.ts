import { IsUUID } from "class-validator";

export class DeleteTaskDTO {
  @IsUUID()
  taskId: string;
}
