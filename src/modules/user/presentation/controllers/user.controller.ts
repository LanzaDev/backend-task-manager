import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindUserUseCase } from '../../application/use-cases/find-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDTO } from '../../application/dto/input/create-user.dto';
import { DeleteUserDTO } from '../../application/dto/input/delete-user.dto';

@Controller('user')
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto = new DeleteUserDTO();
    dto.id = id;

    await this.deleteUserUseCase.execute(dto);
    return { message: 'User successfully deleted' };
  }
}
