import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { CreateTaskCommand } from '../../application/use-cases/commands/implements/create-task.command';
import { DeleteTaskCommand } from '../../application/use-cases/commands/implements/delete-task.command';
import { UpdateTaskCommand } from '../../application/use-cases/commands/implements/update-task.command';

import { GetAllTasksByUserIdQuery } from '../../application/use-cases/query/implements/get-all-tasks-by-user-id.query';
import { GetTaskByIdQuery } from '../../application/use-cases/query/implements/get-task-by-id.query';

import { CreateTaskDTO } from '../dto/input/create-task.dto';
import { UpdateTaskDTO } from '../dto/input/update-task.dto';
import { ResponseTaskDTO } from '../dto/output/response-task.dto';
import { DeleteTaskDTO } from '../dto/input/delete-task.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';
import { SearchTasksQuery } from '../../application/use-cases/query/implements/search-tasks.query';

@ApiTags('User Task')
@ApiBearerAuth('access-token')
@Controller('user/task/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserTaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks of the authenticated user' })
  @ApiBody({ type: ResponseTaskDTO, isArray: true })
  async getMyTasks(@Request() req): Promise<ResponseTaskDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllTasksByUserIdQuery(
      requesterId,
      requesterRole,
      requesterId,
    );

    return this.queryBus.execute(query);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get a task by its ID' })
  @ApiBody({ type: ResponseTaskDTO })
  async getTaskById(
    @Param('taskId') taskId: string,
    @Request() req,
  ): Promise<ResponseTaskDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetTaskByIdQuery(requesterId, requesterRole, taskId);

    return this.queryBus.execute(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tasks with fuzzy matching' })
  @ApiQuery({
    name: 'q',
    required: true,
    description:
      'Search term. Supports fuzzy matching (e.g., typos will still match tasks).',
  })
  @ApiOkResponse({
    description: 'List of tasks matching the search term.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can filter by userId.',
  })
  async search(@Query('q') q: string, @Request() req): Promise<ResponseTaskDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new SearchTasksQuery(
      requesterId,
      requesterRole,
      q,
      requesterId,
    );

    return this.queryBus.execute(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: MessageResponseDTO,
  })
  async createTask(
    @Request() req,
    @Body() createData,
  ): Promise<MessageResponseDTO> {
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

    await this.commandBus.execute(command);
    return { message: 'Task created successfully' };
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update a task by its ID' })
  @ApiBody({ type: UpdateTaskDTO })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: MessageResponseDTO,
  })
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateData,
    @Request() req,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateTaskCommand(
      updateData,
      requesterId,
      requesterRole,
      taskId,
      requesterId,
    );

    await this.commandBus.execute(command);
    return { message: 'Task updated successfully' };
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete a task by its ID' })
  @ApiBody({ type: DeleteTaskDTO })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    type: MessageResponseDTO,
  })
  async deleteTask(
    @Param('taskId') taskId: string,
    @Request() req,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteTaskCommand(
      requesterId,
      taskId,
      requesterRole,
      requesterId,
    );

    await this.commandBus.execute(command);
    return { message: 'Task deleted successfully' };
  }
}
