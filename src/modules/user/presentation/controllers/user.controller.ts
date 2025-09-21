import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';

import { GetUserByIdQuery } from '../../application/use-cases/query/implements/get-user-by-id.query';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetUserByIdQuery(
      requesterId,
      requesterRole,
      requesterId,
    );

    return this.queryBus.execute(query);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateData,
    @Body('currentPassword') currentPassword: string,
  ) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateUserCommand(
      updateData,
      requesterId,
      requesterRole,
      requesterId,
      currentPassword,
    );

    return this.commandBus.execute(command);
  }

  @Delete('profile')
  async deleteProfile(@Body('currentPassword') currentPassword: string, @Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteUserCommand(
      requesterId,
      requesterRole,
      requesterId,
      currentPassword,
    );

    return this.commandBus.execute(command);
  }
}
