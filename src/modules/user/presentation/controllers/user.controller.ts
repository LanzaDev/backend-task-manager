import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindUserUseCase } from '../../application/use-cases/find-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDTO } from '../../application/dto/input/create-user.dto';
import { DeleteUserDTO } from '../../application/dto/input/delete-user.dto';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.createUserUseCase.execute(body);
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.findUserUseCase.execute({ email });

    if (!user) {
      throw new Error('Error');
    }

    return user;
  }

  @Delete('me')
  async delete(@Request() req) {
    const dto = new DeleteUserDTO();
    dto.id = req.user.sub; // pega o id do próprio token

    await this.deleteUserUseCase.execute(dto);
    return { message: 'User successfully deleted' };
  }
}
