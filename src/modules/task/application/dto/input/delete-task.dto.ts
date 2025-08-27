import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class DeleteTaskDTO {
  @IsUUID()
  @Expose()
  taskId: string;
}
