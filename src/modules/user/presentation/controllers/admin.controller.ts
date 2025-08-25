import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from '../../application/services/admin-user.service';
import { UpdateUserDTO } from '../../application/dto/input/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('all')
  async findAll() {
    return this.adminUserService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminUserService.getUserById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.adminUserService.updateUser(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminUserService.deleteUser(id);
  }
}
