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

import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';
import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { CreateUserCommand } from '../../application/use-cases/commands/implements/create-user.command';

import { GetUserByIdQuery } from '../../application/use-cases/query/implements/get-user-by-id.query';
import { GetAllUsersQuery } from '../../application/use-cases/query/implements/get-all-users.query';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('all')
  async getAllUsers(@Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetAllUsersQuery(requesterId, requesterRole);

    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getUserById(@Param('id') targetUserId: string, @Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetUserByIdQuery(
      requesterId,
      requesterRole,
      targetUserId,
    );

    return this.queryBus.execute(query);
  }

  @Post('add')
  async createUser(@Body() createData) {
    const command = new CreateUserCommand(
      createData.name,
      createData.email,
      createData.password,
    );

    return this.commandBus.execute(command);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') targetUserId: string,
    @Body() updateData,
    @Request() req,
  ) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateUserCommand(
      updateData,
      requesterId,
      requesterRole,
      targetUserId,
    );

    return this.commandBus.execute(command);
  }

  @Delete(':id')
  async deleteUser(@Param('id') targetUserId: string, @Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteUserCommand(
      requesterId,
      requesterRole,
      targetUserId,
    );

    return this.commandBus.execute(command);
  }
}
