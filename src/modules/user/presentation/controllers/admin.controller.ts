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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';
import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { CreateUserCommand } from '../../application/use-cases/commands/implements/create-user.command';

import { GetUserByIdQuery } from '../../application/use-cases/query/implements/get-user-by-id.query';
import { GetAllUsersQuery } from '../../application/use-cases/query/implements/get-all-users.query';

import { ResponseAdminDTO } from '../dto/output/response-admin.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';
import { CreateUserDTO } from '../dto/input/create-user.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiOkResponse({
    description: 'Returns all users in the system',
    type: ResponseAdminDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async getAllUsers(@Request() req): Promise<ResponseAdminDTO[]> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllUsersQuery(requesterId, requesterRole);

    return this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiOkResponse({
    description: 'Returns a specific user by ID',
    type: ResponseAdminDTO,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async getUserById(
    @Param('id') targetUserId: string,
    @Request() req,
  ): Promise<ResponseAdminDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetUserByIdQuery(
      requesterId,
      requesterRole,
      targetUserId,
    );

    return this.queryBus.execute(query);
  }

  @Post('add')
  @ApiOperation({ summary: 'Create a new user (admin only, already verified)' })
  @ApiBody({ type: CreateUserDTO })
  @ApiCreatedResponse({
    description: 'User created successfully (already verified, no email sent)',
    type: MessageResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async createUser(@Body() createData): Promise<MessageResponseDTO> {
    const command = new CreateUserCommand(
      createData.name,
      createData.email,
      createData.password,
    );

    await this.commandBus.execute(command);
    return { message: 'User created successfully' };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by ID (admin only, update without password)',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: MessageResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(
    @Param('id') targetUserId: string,
    @Body() updateData,
    @Request() req,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateUserCommand(
      updateData,
      requesterId,
      requesterRole,
      targetUserId,
    );

    await this.commandBus.execute(command);
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteUser(
    @Param('id') targetUserId: string,
    @Request() req,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteUserCommand(
      requesterId,
      requesterRole,
      targetUserId,
    );

    await this.commandBus.execute(command);
    return { message: 'User deleted successfully' };
  }
}
