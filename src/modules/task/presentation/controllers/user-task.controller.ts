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
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { CreateTaskCommand } from '../../application/use-cases/commands/implements/create-task.command';
import { DeleteTaskCommand } from '../../application/use-cases/commands/implements/delete-task.command';
import { UpdateTaskCommand } from '../../application/use-cases/commands/implements/update-task.command';

import { GetAllTasksByUserIdQuery } from '../../application/use-cases/query/implements/get-all-tasks-by-user-id.query';
import { GetTaskByIdQuery } from '../../application/use-cases/query/implements/get-task-by-id.query';

@Controller('user/task/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserTaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMyTasks(@Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllTasksByUserIdQuery(
      requesterId,
      requesterRole,
      requesterId,
    );

    return this.queryBus.execute(query);
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string, @Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetTaskByIdQuery(requesterId, requesterRole, taskId);

    return this.queryBus.execute(query);
  }

  @Post()
  async createTask(@Request() req, @Body() createData) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new CreateTaskCommand(
      requesterId,
      requesterRole,
      requesterId,
      createData.title,
      createData.description,
      createData.status,
      createData.priority,
      createData.dueDate,
      createData.completedAt,
    );

    return this.commandBus.execute(command);
  }

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateData,
    @Request() req,
  ) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateTaskCommand(
      updateData,
      requesterId,
      requesterRole,
      taskId,
      requesterId,
    );

    return this.commandBus.execute(command);
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string, @Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteTaskCommand(
      requesterId,
      taskId,
      requesterRole,
      requesterId,
    );

    return this.commandBus.execute(command);
  }
}
