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
import { JwtUser } from '@/modules/auth/domain/repositories/jwt.repository';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@/shared/types/role.type';

import { CreateTaskCommand } from '../../application/use-cases/commands/implements/create-task.command';
import { DeleteTaskCommand } from '../../application/use-cases/commands/implements/delete-task.command';
import { UpdateTaskCommand } from '../../application/use-cases/commands/implements/update-task.command';

import { GetAllTasksByUserIdQuery } from '../../application/use-cases/query/implements/get-all-tasks-by-user-id.query';
import { GetAllTasksQuery } from '../../application/use-cases/query/implements/get-all-tasks.query';
import { GetTaskByIdQuery } from '../../application/use-cases/query/implements/get-task-by-id.query';
import { SearchTasksQuery } from '../../application/use-cases/query/implements/search-tasks.query';

import { CreateTaskDTO } from '../dto/input/create-task.dto';
import { DeleteTaskDTO } from '../dto/input/delete-task.dto';
import { UpdateTaskDTO } from '@/modules/task/presentation/dto/input/update-task.dto';

import { ResponseTaskDTO } from '@/modules/task/presentation/dto/output/response-task.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';

@ApiTags('Admin Task')
@ApiBearerAuth('access-token')
@Controller('admin/tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all tasks in the system (admin only)' })
  @ApiOkResponse({
    description: 'List of all tasks',
    type: ResponseTaskDTO,
    isArray: true,
  })
  async getAllTasks(
    @Request() req: { user: JwtUser },
  ): Promise<ResponseTaskDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllTasksQuery(requesterId, requesterRole);

    return this.queryBus.execute(query);
  }

  @Get('all/:userId')
  @ApiOperation({
    summary: 'Retrieve all tasks of a specific user (admin only)',
  })
  @ApiOkResponse({
    description: 'List of tasks for the specified user',
    type: ResponseTaskDTO,
    isArray: true,
  })
  async getAllTasksByUser(
    @Param('userId') targetUserId: string,
    @Request() req: { user: JwtUser },
  ): Promise<ResponseTaskDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllTasksByUserIdQuery(
      requesterId,
      requesterRole,
      targetUserId,
    );

    return this.queryBus.execute(query);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Retrieve a specific task by ID (admin only)' })
  @ApiOkResponse({
    description: 'The task details',
    type: ResponseTaskDTO,
  })
  async getTaskById(
    @Param('taskId') taskId: string,
    @Request() req: { user: JwtUser },
  ): Promise<ResponseTaskDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetTaskByIdQuery(requesterId, requesterRole, taskId);

    return this.queryBus.execute(query);
  }

  @Get('search')
  @Get('search')
  @ApiOperation({ summary: 'Search tasks with fuzzy matching (admin only)' })
  @ApiQuery({
    name: 'q',
    required: true,
    description:
      'Search term. Supports fuzzy matching (e.g., typos will still match tasks).',
  })
  @ApiQuery({
    name: 'targetUserId',
    required: false,
    description:
      'Optional. Admins can specify a userId to search tasks of a specific user. Ignored for regular users.',
  })
  @ApiOkResponse({
    description: 'List of tasks matching the search term.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid query parameters.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can filter by userId.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No tasks match the search term.',
  })
  async search(
    @Query('q') q: string,
    @Query('targetUserId') targetUserId: string,
    @Request() req: { user: JwtUser },
  ): Promise<ResponseTaskDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new SearchTasksQuery(
      requesterId,
      requesterRole,
      q,
      targetUserId,
    );

    return this.queryBus.execute(query);
  }

  @Post(':userId')
  @ApiOperation({
    summary: 'Create a new task for a specific user (admin only)',
  })
  @ApiBody({
    description: 'Data to create the new task',
    type: CreateTaskDTO,
  })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: ResponseTaskDTO,
  })
  async createTaskForUser(
    @Param('userId') targetUserId: string,
    @Request() req: { user: JwtUser },
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new CreateTaskCommand(
      requesterId,
      requesterRole,
      targetUserId,
      createTaskDTO.title,
      createTaskDTO.description,
      createTaskDTO.status,
      createTaskDTO.priority,
      createTaskDTO.dueDate,
      createTaskDTO.completedAt,
    );

    await this.commandBus.execute(command);

    return;
  }

  @Patch(':taskId')
  @ApiOperation({
    summary: 'Update a task by ID for a specific user (admin only)',
  })
  @ApiBody({
    description: 'Data to update the task',
    type: UpdateTaskDTO,
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: MessageResponseDTO,
  })
  async updateTaskForUser(
    @Param('taskId') taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Request() req: { user: JwtUser },
  ): Promise<ResponseTaskDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateTaskCommand(
      updateTaskDTO,
      requesterId,
      requesterRole,
      taskId,
    );

    return this.commandBus.execute(command);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete a task by ID (admin only)' })
  @ApiBody({
    description: 'ID of the task to delete',
    type: DeleteTaskDTO,
  })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    type: MessageResponseDTO,
  })
  async deleteTaskForUser(
    @Param('taskId') taskId: string,
    @Request() req: { user: JwtUser },
  ) {
    const { sub: requesterId, role: requesterRole } = req.user;
    const command = new DeleteTaskCommand(requesterId, taskId, requesterRole);
    await this.commandBus.execute(command);
    return { message: 'Task deleted successfully' };
  }
}
