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
import { ITaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { CreateTaskDTO } from '@/modules/task/application/dto/input/create-task.dto';
import { UpdateTaskDTO } from '@/modules/task/application/dto/input/update-task.dto';
import { DeleteTaskDTO } from '@/modules/task/application/dto/input/delete-task.dto';
import { ResponseTaskDTO } from '@/modules/task/application/dto/output/response-task.dto';

import { CreateTaskUseCase } from '@/modules/task/application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '@/modules/task/application/use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from '@/modules/task/application/use-cases/update-task.use-case';

@Controller('admin/task/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTaskController {
  constructor(
    private readonly taskReadRepository: ITaskReadRepository,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get('all')
  async getAllTasks() {
    const tasks = await this.taskReadRepository.findAllTasks();
    return tasks;
  }

  @Get('all/:userId')
  async getAllTasksByUser(@Param('userid') userId: string) {
    const tasks = await this.taskReadRepository.findAllByUser(userId);
    return tasks;
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    const task = await this.taskReadRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  @Post(':userId')
  async createTaskForUser(
    @Param('userId') userId: string,
    @Body() dto: CreateTaskDTO,
  ): Promise<ResponseTaskDTO> {
    await this.createTaskUseCase.execute(dto, userId);

    return new ResponseTaskDTO();
  }

  @Patch(':taskId')
  async updateTaskForUser(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDTO,
    @Request() req,
  ): Promise<ResponseTaskDTO> {
    const task = await this.updateTaskUseCase.execute(taskId, dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return new ResponseTaskDTO(task);
  }

  @Delete(':taskId')
  async deleteTaskForUser(@Param('taskId') taskId: string, @Request() req) {
    const dto = new DeleteTaskDTO();
    dto.taskId = taskId;

    await this.deleteTaskUseCase.execute(dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return { message: 'Task successfully deleted' };
  }
}
