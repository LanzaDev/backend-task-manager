import { Task } from '../../domain/entities/task.entity';
import { ResponseTaskDTO } from '../../presentation/dto/output/response-task.dto';

export class TaskMapper {
  static toDTO(task: Task): ResponseTaskDTO {
    return new ResponseTaskDTO({
      id: task.getId(),
      userId: task.getUserId(),
      title: task.getTitle(),
      description: task.getDescription(),
      status: task.getStatus(),
      priority: task.getPriority(),
      dueDate: task.getDueDate(),
      completedAt: task.getCompletedAt(),
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    });
  }

  static toDTOList(entities: Task[]): ResponseTaskDTO[] {
    return entities.map((task) => this.toDTO(task));
  }
}
