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
  ApiBody,
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

import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';

import { GetUserByIdQuery } from '../../application/use-cases/query/implements/get-user-by-id.query';

import { ResponseUserDTO } from '../dto/output/response-user.dto';
import { UpdateUserDTO } from '../dto/input/update-user.dto';
import { DeleteUserDTO } from '../dto/input/delete-user.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';

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
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({
    description: 'Returns the profile of the authenticated user',
    type: ResponseUserDTO,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async getProfile(@Request() req): Promise<ResponseUserDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const query = new GetUserByIdQuery(requesterId, requesterRole, requesterId);

    return this.queryBus.execute(query);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: MessageResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async updateProfile(
    @Request() req,
    @Body() updateData: UpdateUserDTO,
    @Body('currentPassword') currentPassword: string,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new UpdateUserCommand(
      updateData,
      requesterId,
      requesterRole,
      requesterId,
      currentPassword,
    );

    await this.commandBus.execute(command);
    return { message: 'Profile updated successfully' };
  }

  @Delete('profile')
  @ApiBody({ type: DeleteUserDTO })
  @ApiOperation({ summary: 'Delete the authenticated user profile' })
  @ApiOkResponse({
    description: 'Profile deleted successfully',
    type: MessageResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid password' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async deleteProfile(
    @Body('currentPassword') dto: DeleteUserDTO,
    @Request() req,
  ): Promise<MessageResponseDTO> {
    const { sub: requesterId, role: requesterRole } = req.user;

    const command = new DeleteUserCommand(
      requesterId,
      requesterRole,
      requesterId,
      dto.password,
    );

    await this.commandBus.execute(command);
    return { message: 'Profile deleted successfully' };
  }
}
