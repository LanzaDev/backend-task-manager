import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '../../domain/repositories/user.read-repository';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { UpdateUserDTO } from '../dto/input/update-user.dto';

import { UserMapper } from '../../application/mappers/user.mapper';

import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userReadRepository.findById(req.user.sub);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toDTO(user);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateUserDTO) {
    console.log(req.user);

    const command = new UpdateUserCommand(
      updateData,
      req.user.sub,
      req.user.role,
      req.user.sub,
    );

    await this.commandBus.execute(command);

    return { message: 'Your profile has been successfully updated.' };
  }

  @Delete('profile')
  async deleteProfile(@Body('password') password: string, @Request() req) {
    if (!req.user?.sub) throw new BadRequestException('User not found');

    const command = new DeleteUserCommand(
      req.user.sub,
      req.user.role,
      req.user.sub,
      password,
    );

    await this.commandBus.execute(command);
    return { message: 'User successfully deleted' };
  }
}
