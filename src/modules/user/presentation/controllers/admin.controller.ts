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
  UseGuards,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDTO } from '../../application/dto/input/create-user.dto';
import { UpdateUserDTO } from '../../application/dto/input/update-user.dto';
import { DeleteUserDTO } from '../../application/dto/input/delete-user.dto';
import { ResponseAdminDTO } from '../../application/dto/output/response-admin.dto';
import { UserMapper } from '../../application/mappers/user.mapper';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly createUserUserCase: CreateUserUseCase,
    private readonly updateUserUserCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('all')
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toDTO(user));
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toDTO(user);
  }

  @Post('add')
  async createUser(@Body() dto: CreateUserDTO): Promise<ResponseAdminDTO> {
    return this.createUserUserCase.execute(dto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
    @Request() req,
  ) {
    await this.updateUserUserCase.execute(
      dto,
      {
        id: req.user.sub,
        role: req.user.role,
      },
      id,
    );
    return { message: 'User successfully updated' };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    const dto = new DeleteUserDTO();
    dto.id = id;

    await this.deleteUserUseCase.execute(dto, {
      id: req.user.sub,
      role: req.user.role,
    });

    return {
      message: 'User successfully deleted',
    };
  }
}
