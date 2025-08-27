import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserDTO } from '../../application/dto/input/update-user.dto';
import { DeleteUserDTO } from '../../application/dto/input/delete-user.dto';
import { UserMapper } from '../../application/mappers/user.mapper';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly updateUserUserCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}
  
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userRepository.findById(req.user.sub);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toDTO(user);
  }

  @Patch('profile')
  async update(@Request() req, @Body() dto: UpdateUserDTO) {
    await this.updateUserUserCase.execute(
      dto,
      {
        id: req.user.sub,
        role: req.user.role,
      },
      req.user.sub,
    );

    return { message: 'Your profile has been successfully updated.' };
  }

  @Delete('profile')
  async delete(@Request() req, @Body() body: { password?: string }) {
    const dto = new DeleteUserDTO();
    dto.id = req.user.sub;
    dto.password = body.password;

    if (!dto.password) {
      throw new Error('Password is required');
    }

    await this.deleteUserUseCase.execute(dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return { message: 'User successfully deleted' };
  }
}
