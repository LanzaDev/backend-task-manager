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
import { DeleteTaskDTO } from '../../application/dto/input/delete-task.dto';
import { ResponseTaskDTO } from '../../application/dto/output/response-task.dto';

@Controller('admin/task/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTaskController {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly createTaskUserCase: CreateTaskUseCase,
    private readonly updateTaskUserCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get('all')
  async getAllTasks() {
    const tasks = await this.taskRepository.findAllTasks();
    return tasks;
  }

  @Get('all/:userId')
  async getAllTasksByUser(@Param('userid') userId: string) {
    const tasks = await this.taskRepository.findAllByUser(userId);
    return tasks;
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  @Post(':userId')
  async createTaskForUser(
    @Param('userId') userId: string,
    @Body() dto: CreateTaskDTO,
  ): Promise<ResponseTaskDTO> {
    await this.createTaskUserCase.execute(dto, userId);

    return new ResponseTaskDTO()
  }

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDTO,
    @Request() req,
  ): Promise<ResponseTaskDTO> {
    const task = await this.updateTaskUserCase.execute(taskId, dto, {
      id: req.user.sub,
      role: req.user.role,
    });
    return new ResponseTaskDTO(task);
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string, @Request() req) {
    const dto = new DeleteTaskDTO();
    dto.taskId = taskId;

    await this.deleteTaskUseCase.execute(dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return {
      message: 'Task successfully deleted',
    };
  }
}
