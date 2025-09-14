import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { CreateUserDTO } from '@/modules/user/presentation/dto/input/create-user.dto';
import { UpdateUserDTO } from '@/modules/user/presentation/dto/input/update-user.dto';
import { ResponseAdminDTO } from '@/modules/user/presentation/dto/output/response-admin.dto';

import { UserMapper } from '@/modules/user/application/mappers/user.mapper';

import { CreateUserHandler } from '@/modules/user/application/use-cases/commands/handlers/create-user.handler';
import { UpdateUserCommand } from '../../application/use-cases/commands/implements/update-user.command';
import { DeleteUserCommand } from '../../application/use-cases/commands/implements/delete-user.command';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly userReadRepository: AbstractUserReadRepository,
    private readonly createUserHandler: CreateUserHandler,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('all')
  async getAllUsers() {
    const users = await this.userReadRepository.findAll();
    return users.map((user) => UserMapper.toDTO(user));
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userReadRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toDTO(user);
  }

  @Post('add')
  async createUser(@Body() dto: CreateUserDTO): Promise<ResponseAdminDTO> {
    return this.createUserHandler.execute(dto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDTO,
    @Request() req,
  ) {
    const command = new UpdateUserCommand(
      updateData,
      req.user.sub,
      req.user.role,
      id,
    );

    await this.commandBus.execute(command);

    return { message: 'User successfully updated' };
  }

  @Delete(':id')
  async deleteUser(@Param('id') targetUserId: string, @Request() req) {
    if (!req.user?.sub || !req.user?.role) {
      throw new UnauthorizedException('User not authenticated');
    }

    const command = new DeleteUserCommand(
      req.user.sub,
      req.user.role,
      targetUserId,
    );

    await this.commandBus.execute(command);
    return {
      message: 'User successfully deleted',
    };
  }
}
