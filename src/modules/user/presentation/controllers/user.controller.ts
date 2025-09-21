import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';

import { GetUserByIdQuery } from '../../application/use-cases/query/implements/get-user-by-id.query';
import { ResponseUserDTO } from '../dto/output/response-user.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('profile')
  @ApiOkResponse({
    description: 'Returns the profile of the authenticated user',
    type: ResponseUserDTO,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async getProfile(@Request() req) {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetUserByIdQuery(requesterId, requesterRole, requesterId);

    return this.queryBus.execute(query);
  }

  @Patch('profile')
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: ResponseUserDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
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
  @ApiOkResponse({ description: 'Profile deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid password' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async deleteProfile(
    @Body('currentPassword') currentPassword: string,
    @Request() req,
  ) {
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
