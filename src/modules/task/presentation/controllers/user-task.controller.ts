import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { CreateTaskDTO } from '../../application/dto/input/create-task.dto';
import { UpdateTaskDTO } from '../../application/dto/input/update-task.dto';
import { ResponseTaskDTO } from '../../application/dto/output/response-task.dto';

@Controller('user/task')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserTaskController {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get('my-tasks')
  async getAllTasksByUser(@Request() req) {
    const tasks = await this.taskRepository.findAllByUser(req.user.sub);
    return tasks;
  }

  @Post()
  async createTaskForUser(@Request() req, @Body() dto: CreateTaskDTO) {
    const task = await this.createTaskUseCase.execute(dto, req.user.sub);

    return new ResponseTaskDTO(task);
  }

  @Patch(':taskId')
  async updateTaskForUser(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDTO,
    @Request() req,
  ) {
    const updatedTask = await this.updateTaskUseCase.execute(taskId, dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return new ResponseTaskDTO(updatedTask);
  }

  @Delete(':taskId')
  async deleteTaskForUser(@Param('taskId') taskId: string, @Request() req) {
    await this.deleteTaskUseCase.execute(
      { taskId },
      { id: req.user.sub, role: req.user.role },
    );
    return { message: 'Task deleted successfully' };
  }
}
