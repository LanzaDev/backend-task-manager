import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ITaskReadRepository } from '../../domain/repositories/task.read-repository';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { CreateTaskDTO } from '../../application/dto/input/create-task.dto';
import { UpdateTaskDTO } from '../../application/dto/input/update-task.dto';
import { ResponseTaskDTO } from '../../application/dto/output/response-task.dto';

import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';

@Controller('user/task/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserTaskController {
  constructor(
    private readonly taskReadRepository: ITaskReadRepository,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get()
  async getMyTasks(@Request() req) {
    const tasks = await this.taskReadRepository.findAllByUser(req.user.sub);
    return tasks;
  }

  @Post()
  async createTask(@Request() req, @Body() dto: CreateTaskDTO) {
    const task = await this.createTaskUseCase.execute(dto, req.user.sub);
    return new ResponseTaskDTO(task);
  }

  @Patch(':taskId')
  async updateTask(
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
  async deleteTask(@Param('taskId') taskId: string, @Request() req) {
    await this.deleteTaskUseCase.execute(
      { taskId },
      { id: req.user.sub, role: req.user.role },
    );

    return { message: 'Task deleted successfully' };
  }
}
