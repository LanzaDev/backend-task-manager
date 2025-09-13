import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IUserReadRepository } from '../../domain/repositories/user.read-repository';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { UpdateUserDTO } from '../../application/dto/input/update-user.dto';
import { DeleteUserDTO } from '../../application/dto/input/delete-user.dto';

import { UserMapper } from '../../application/mappers/user.mapper';

import { UpdateUserHandler } from '../../application/use-cases/commands/handlers/update-user.handler';
import { DeleteUserHandler } from '../../application/use-cases/commands/handlers/delete-user.handler';
import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly userReadRepository: IUserReadRepository,
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
